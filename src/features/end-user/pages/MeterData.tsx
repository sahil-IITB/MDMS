import { useEffect, useState } from "react";
import { Activity, CalendarDays, Gauge } from "lucide-react";
import PageHeader from "../../../shared/components/PageHeader";
import FormField from "../../../shared/components/FormField/FormField";
import DataTable, { type DataTableColumn } from "../../../shared/components/DataTable/DataTable";
import EmptyState from "../../../shared/components/EmptyState/EmptyState";
import Pagination from "../../../shared/components/Pagination/Pagination";
import { ChartCard } from "../../../shared/components/ChartCard/ChartCard";
import type { TimeRange } from "../../../shared/components/ChartCard/TimeRangeToggle";
import { LineChartView } from "../../../shared/components/charts/LineChartView";
import { getConsumption } from "../services/consumptionService";
import { getMeterReadings } from "../services/meterDataService";
import type { ConsumptionPoint } from "../types/consumption";
import type { MeterReading, MeterReadingsQuery } from "../types/meterReading";
import "./MeterData.css";

function toLocalDateInput(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getMonthStart() {
    const today = new Date();
    return toLocalDateInput(new Date(today.getFullYear(), today.getMonth(), 1));
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(`${value}T00:00:00`));
}

type ReadingsState =
    | { queryKey: string; status: "success"; readings: MeterReading[]; totalPages: number; totalItems: number }
    | { queryKey: string; status: "error"; message: string }
    | null;

type ChartState =
    | { range: TimeRange; status: "success"; data: ConsumptionPoint[] }
    | { range: TimeRange; status: "error"; message: string }
    | null;

function MeterData() {
    const today = toLocalDateInput(new Date());
    const [startDate, setStartDate] = useState(getMonthStart);
    const [endDate, setEndDate] = useState(today);
    const [page, setPage] = useState(1);
    const [range, setRange] = useState<TimeRange>("Month");
    const [readingsState, setReadingsState] = useState<ReadingsState>(null);
    const [chartState, setChartState] = useState<ChartState>(null);

    const dateRangeError = startDate && endDate && startDate > endDate
        ? "Start date must be before or the same as end date."
        : "";
    const readingsQueryKey = JSON.stringify({ page, startDate, endDate });

    useEffect(() => {
        if (dateRangeError) return;

        let isCurrent = true;
        const query = JSON.parse(readingsQueryKey) as MeterReadingsQuery;

        getMeterReadings(query)
            .then((response) => {
                if (isCurrent) {
                    setReadingsState({
                        queryKey: readingsQueryKey,
                        status: "success",
                        readings: response.data.data,
                        totalPages: response.data.pages,
                        totalItems: response.data.items,
                    });
                }
            })
            .catch(() => {
                if (isCurrent) {
                    setReadingsState({
                        queryKey: readingsQueryKey,
                        status: "error",
                        message: "Meter readings could not be loaded. Please try again later.",
                    });
                }
            });

        return () => {
            isCurrent = false;
        };
    }, [dateRangeError, readingsQueryKey]);

    useEffect(() => {
        let isCurrent = true;

        getConsumption(range)
            .then((response) => {
                if (isCurrent) setChartState({ range, status: "success", data: response.data });
            })
            .catch(() => {
                if (isCurrent) {
                    setChartState({ range, status: "error", message: "Consumption comparison data could not be loaded." });
                }
            });

        return () => {
            isCurrent = false;
        };
    }, [range]);

    const currentReadingsState = readingsState?.queryKey === readingsQueryKey ? readingsState : null;
    const readingsLoading = !dateRangeError && currentReadingsState === null;
    const readings = currentReadingsState?.status === "success" ? currentReadingsState.readings : [];
    const totalPages = currentReadingsState?.status === "success" ? currentReadingsState.totalPages : 0;
    const totalItems = currentReadingsState?.status === "success" ? currentReadingsState.totalItems : 0;
    const readingsError = currentReadingsState?.status === "error" ? currentReadingsState.message : "";

    const currentChartState = chartState?.range === range ? chartState : null;
    const chartLoading = currentChartState === null;
    const chartData = currentChartState?.status === "success" ? currentChartState.data : [];
    const chartError = currentChartState?.status === "error" ? currentChartState.message : "";

    const columns: DataTableColumn<MeterReading>[] = [
        {
            key: "date",
            header: "Date",
            accessor: "date",
            sortable: true,
            render: (reading) => formatDate(reading.date),
        },
        {
            key: "reading",
            header: "Meter reading",
            accessor: "reading",
            align: "right",
            sortable: true,
            render: (reading) => `${reading.reading.toLocaleString("en-IN", { maximumFractionDigits: 2 })} kWh`,
        },
        {
            key: "difference",
            header: "Difference",
            accessor: "difference",
            align: "right",
            sortable: true,
            render: (reading) => `${reading.difference.toFixed(2)} kWh`,
        },
        {
            key: "notes",
            header: "Notes",
            accessor: "notes",
        },
    ];

    const updateStartDate = (value: string) => {
        setStartDate(value);
        setPage(1);
    };

    const updateEndDate = (value: string) => {
        setEndDate(value);
        setPage(1);
    };

    return (
        <div className="meter-data-page">
            <PageHeader
                title="Meter data"
                description="Review detailed readings and compare your electricity usage over time."
            />

            <section className="meter-date-filter" aria-label="Meter reading date range">
                <div className="meter-date-filter__heading">
                    <span className="meter-date-filter__icon"><CalendarDays size={18} /></span>
                    <div>
                        <h2>Date range</h2>
                        <p>Choose which daily meter readings to view.</p>
                    </div>
                </div>
                <div className="meter-date-filter__fields">
                    <FormField
                        label="From"
                        name="meter-data-start-date"
                        type="date"
                        value={startDate}
                        onChange={updateStartDate}
                    />
                    <FormField
                        label="To"
                        name="meter-data-end-date"
                        type="date"
                        value={endDate}
                        onChange={updateEndDate}
                    />
                </div>
                {dateRangeError && <p className="meter-data-error" role="alert">{dateRangeError}</p>}
            </section>

            <ChartCard
                title="Usage comparison"
                subtitle="Compare this period with the previous period"
                range={{
                    value: range,
                    onChange: setRange,
                    options: ["Day", "Week", "Month"],
                }}
                loading={chartLoading}
                error={chartError || null}
                isEmpty={!chartLoading && !chartError && chartData.length === 0}
                emptyMessage="No usage comparison is available for this period."
                height={320}
            >
                <LineChartView
                    data={chartData}
                    xKey="label"
                    series={[
                        { dataKey: "current", name: "Current period", color: "var(--chart-1)" },
                        { dataKey: "previous", name: "Previous period", color: "var(--chart-2)" },
                    ]}
                    height={320}
                    unit="kWh"
                />
            </ChartCard>

            <section className="meter-readings-panel" aria-label="Meter readings table">
                <div className="meter-readings-panel__header">
                    <div className="meter-readings-panel__title">
                        <span className="meter-readings-panel__icon"><Activity size={18} /></span>
                        <div>
                            <h2>Daily readings</h2>
                            <p>{readingsLoading ? "Loading readings…" : `${totalItems} readings from ${formatDate(startDate)} to ${formatDate(endDate)}`}</p>
                        </div>
                    </div>
                    <span className="meter-readings-panel__meter"><Gauge size={15} /> MNG-20418</span>
                </div>

                {dateRangeError ? (
                    <EmptyState title="Select a valid date range" description={dateRangeError} />
                ) : readingsError ? (
                    <div className="meter-data-error meter-data-error--panel" role="alert">{readingsError}</div>
                ) : currentReadingsState?.status === "success" && readings.length === 0 ? (
                    <EmptyState
                        title="No readings for this date range"
                        description="Try selecting another date range."
                    />
                ) : (
                    <DataTable
                        columns={columns}
                        data={readings}
                        rowKey="id"
                        caption="Daily electricity meter readings"
                        loading={readingsLoading}
                        loadingMessage="Loading meter readings…"
                    />
                )}

                <div className="meter-readings-panel__footer">
                    <span>Readings are supplied by your smart meter.</span>
                    {totalItems > 0 && !dateRangeError ? (
                        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                    ) : null}
                </div>
            </section>
        </div>
    );
}

export default MeterData;
