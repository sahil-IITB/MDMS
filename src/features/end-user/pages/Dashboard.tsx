import { useEffect, useState } from "react";
import { ArrowDownToLine, ArrowUpRight, Bell, CalendarDays, CreditCard, Gauge, ReceiptText, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../shared/components/PageHeader";
import { StatCard } from "../../../shared/components/StatCard/StatCard";
import { ChartCard } from "../../../shared/components/ChartCard/ChartCard";
import type { TimeRange } from "../../../shared/components/ChartCard/TimeRangeToggle";
import { LineChartView } from "../../../shared/components/charts/LineChartView";
import Button from "../../../shared/components/Button/Button";
import { getConsumption, getDashboardSummary } from "../services/consumptionService";
import type { ConsumptionPoint, DashboardSummary } from "../types/consumption";
import "./Dashboard.css";

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
});

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
}

function formatToday() {
    return new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date());
}

function Dashboard() {
    const navigate = useNavigate();
    const [range, setRange] = useState<TimeRange>("Day");
    const [summaryState, setSummaryState] = useState<
        | { status: "loading" }
        | { status: "success"; data: DashboardSummary }
        | { status: "error"; message: string }
    >({ status: "loading" });
    const [chartState, setChartState] = useState<
        | { range: TimeRange; status: "success"; data: ConsumptionPoint[] }
        | { range: TimeRange; status: "error"; message: string }
        | null
    >(null);

    useEffect(() => {
        let isCurrent = true;

        getDashboardSummary()
            .then((response) => {
                if (isCurrent) setSummaryState({ status: "success", data: response.data });
            })
            .catch(() => {
                if (isCurrent) {
                    setSummaryState({
                        status: "error",
                        message: "We couldn’t load your account summary. Please try again later.",
                    });
                }
            });

        return () => {
            isCurrent = false;
        };
    }, []);

    useEffect(() => {
        let isCurrent = true;

        getConsumption(range)
            .then((response) => {
                if (isCurrent) setChartState({ range, status: "success", data: response.data });
            })
            .catch(() => {
                if (isCurrent) {
                    setChartState({ range, status: "error", message: "Consumption data could not be loaded." });
                }
            });

        return () => {
            isCurrent = false;
        };
    }, [range]);

    const summary = summaryState.status === "success" ? summaryState.data : null;
    const isSummaryLoading = summaryState.status === "loading";
    const summaryError = summaryState.status === "error" ? summaryState.message : "";
    const currentChartState = chartState?.range === range ? chartState : null;
    const isChartLoading = currentChartState === null;
    const chartData = currentChartState?.status === "success" ? currentChartState.data : [];
    const chartError = currentChartState?.status === "error" ? currentChartState.message : "";
    const greetingName = summary?.userName ?? "there";

    return (
        <div className="end-user-dashboard">
            <section className="dashboard-welcome" aria-label="Account overview">
                <div className="dashboard-welcome__main">
                    <PageHeader
                        title={`Welcome back, ${greetingName}`}
                        description={`Here’s your electricity overview for ${formatToday()}.`}
                    />
                    <div className="dashboard-welcome__zone">
                        <span className="dashboard-welcome__zone-icon"><Zap size={16} /></span>
                        <span>{summary?.zoneName ?? "Your zone"}</span>
                    </div>
                </div>
                <div className="dashboard-welcome__sync">
                    <div className="dashboard-welcome__sync-item">
                        <span className="dashboard-welcome__sync-label"><CalendarDays size={15} /> Last synced</span>
                        <strong>{summary?.lastSynced ?? "—"}</strong>
                    </div>
                    <div className="dashboard-welcome__sync-item">
                        <span className="dashboard-welcome__sync-label"><Gauge size={15} /> Data source</span>
                        <strong>{summary?.meterNumber ?? "—"}</strong>
                    </div>
                </div>
            </section>

            {summaryError ? (
                <div className="dashboard-error" role="alert">{summaryError}</div>
            ) : null}

            <section className="dashboard-stat-grid" aria-label="Account summary">
                <StatCard
                    label="Current consumption"
                    value={<>{summary?.currentConsumptionKwh.toFixed(1) ?? "—"}<span className="dashboard-stat-unit"> kWh</span></>}
                    hint="Today so far"
                    icon={<Zap size={20} />}
                    loading={isSummaryLoading}
                    align="left"
                />
                <StatCard
                    label="This month’s bill"
                    value={summary ? CURRENCY_FORMATTER.format(summary.currentMonthBill) : "—"}
                    hint={summary ? `Due ${formatDate(summary.billDueDate)}` : "Billing period"}
                    icon={<ReceiptText size={20} />}
                    loading={isSummaryLoading}
                    align="left"
                />
                <StatCard
                    label="Outstanding balance"
                    value={summary ? CURRENCY_FORMATTER.format(summary.outstandingBalance) : "—"}
                    hint="Across unpaid bills"
                    icon={<CreditCard size={20} />}
                    loading={isSummaryLoading}
                    align="left"
                />
                <StatCard
                    label="Last payment"
                    value={summary ? CURRENCY_FORMATTER.format(summary.lastPaymentAmount) : "—"}
                    hint={summary ? `Paid ${formatDate(summary.lastPaymentDate)}` : "Most recent payment"}
                    icon={<ArrowDownToLine size={20} />}
                    loading={isSummaryLoading}
                    align="left"
                />
            </section>

            <ChartCard
                title="Consumption overview"
                subtitle="Track your electricity use over time"
                range={{ value: range, onChange: setRange }}
                loading={isChartLoading}
                error={chartError || null}
                isEmpty={!isChartLoading && !chartError && chartData.length === 0}
                emptyMessage="No consumption data is available for this period."
                height={320}
            >
                <LineChartView
                    data={chartData}
                    xKey="label"
                    series={[{ dataKey: "current", name: "This period", color: "var(--chart-1)" }]}
                    height={320}
                    unit="kWh"
                />
            </ChartCard>

            <section className="dashboard-actions" aria-labelledby="dashboard-actions-title">
                <div className="dashboard-actions__header">
                    <div>
                        <h2 id="dashboard-actions-title">Quick actions</h2>
                        <p>Shortcuts to the things you do most.</p>
                    </div>
                </div>
                <div className="dashboard-actions__grid">
                    <Button className="dashboard-action" variant="outline" onClick={() => navigate("/bills")}>
                        <CreditCard size={19} />
                        <span><strong>Pay bill</strong><small>Review your amount due</small></span>
                        <ArrowUpRight className="dashboard-action__arrow" size={17} />
                    </Button>
                    <Button className="dashboard-action" variant="outline" onClick={() => navigate("/bills")}>
                        <ReceiptText size={19} />
                        <span><strong>View bill history</strong><small>See previous bills</small></span>
                        <ArrowUpRight className="dashboard-action__arrow" size={17} />
                    </Button>
                    <Button className="dashboard-action" variant="outline" onClick={() => navigate("/user/meter-data")}>
                        <Gauge size={19} />
                        <span><strong>View detailed usage</strong><small>Explore meter readings</small></span>
                        <ArrowUpRight className="dashboard-action__arrow" size={17} />
                    </Button>
                    <Button className="dashboard-action" variant="outline" onClick={() => navigate("/alerts")}>
                        <Bell size={19} />
                        <span><strong>Manage notifications</strong><small>Review your alerts</small></span>
                        <ArrowUpRight className="dashboard-action__arrow" size={17} />
                    </Button>
                </div>
            </section>

        </div>
    );
}

export default Dashboard;
