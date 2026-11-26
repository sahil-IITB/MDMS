import { useEffect, useState } from "react";
import { ArrowLeft, Download, Printer, ReceiptText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../shared/components/Button/Button";
import DataTable, { type DataTableColumn } from "../../../shared/components/DataTable/DataTable";
import EmptyState from "../../../shared/components/EmptyState/EmptyState";
import PageHeader from "../../../shared/components/PageHeader";
import StatusBadge from "../../../shared/components/StatusBadge/StatusBadge";
import Loader from "../../../shared/components/Loader/Loader";
import { getBillById, getBillDays } from "../services/billsService";
import type { Bill, BillDay } from "../types/bill";
import "./BillDetails.css";

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
});

const READING_FORMATTER = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

function formatBillMonth(month: string) {
    return new Intl.DateTimeFormat("en-IN", {
        month: "long",
        year: "numeric",
    }).format(new Date(`${month}-01T00:00:00`));
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(`${value}T00:00:00`));
}

type BillDetailsState =
    | { billId: string; status: "success"; bill: Bill; days: BillDay[] }
    | { billId: string; status: "error"; message: string }
    | null;

function BillDetails() {
    const { billId } = useParams<{ billId: string }>();
    const navigate = useNavigate();
    const [detailsState, setDetailsState] = useState<BillDetailsState>(null);

    useEffect(() => {
        if (!billId) return;

        let isCurrent = true;
        Promise.all([getBillById(billId), getBillDays(billId)])
            .then(([billResponse, daysResponse]) => {
                if (isCurrent) {
                    setDetailsState({
                        billId,
                        status: "success",
                        bill: billResponse.data,
                        days: daysResponse.data,
                    });
                }
            })
            .catch(() => {
                if (isCurrent) {
                    setDetailsState({
                        billId,
                        status: "error",
                        message: "We couldn’t load this bill. It may no longer be available.",
                    });
                }
            });

        return () => {
            isCurrent = false;
        };
    }, [billId]);

    const currentDetails = detailsState?.billId === billId ? detailsState : null;
    const loading = currentDetails === null;
    const bill = currentDetails?.status === "success" ? currentDetails.bill : null;
    const days = currentDetails?.status === "success" ? currentDetails.days : [];
    const error = currentDetails?.status === "error" ? currentDetails.message : "";

    const columns: DataTableColumn<BillDay>[] = [
        {
            key: "date",
            header: "Date",
            accessor: "date",
            sortable: true,
            render: (day) => formatDate(day.date),
        },
        {
            key: "reading",
            header: "Meter reading",
            accessor: "reading",
            align: "right",
            sortable: true,
            render: (day) => `${READING_FORMATTER.format(day.reading)} kWh`,
        },
        {
            key: "consumption",
            header: "Consumption",
            accessor: "consumption",
            align: "right",
            sortable: true,
            render: (day) => `${READING_FORMATTER.format(day.consumption)} kWh`,
        },
        {
            key: "cost",
            header: "Cost",
            accessor: "cost",
            align: "right",
            sortable: true,
            render: (day) => CURRENCY_FORMATTER.format(day.cost),
        },
    ];

    return (
        <div className="bill-details-page">
            <PageHeader
                title="Bill details"
                description={bill ? `Daily usage and charges for ${formatBillMonth(bill.month)}.` : "View the daily readings and charges for this bill."}
                actions={(
                    <Button variant="outline" onClick={() => navigate("/user/bills")}>
                        <ArrowLeft size={16} /> Back to bills
                    </Button>
                )}
            />

            {loading ? (
                <div className="bill-details-loading"><Loader size="lg" /></div>
            ) : error ? (
                <EmptyState
                    title="Bill unavailable"
                    description={error}
                    icon={<ReceiptText size={28} />}
                    action={(
                        <Button variant="outline" onClick={() => navigate("/user/bills")}>
                            Back to bills
                        </Button>
                    )}
                />
            ) : bill ? (
                <>
                    <section className="bill-summary" aria-label="Bill summary">
                        <div className="bill-summary__heading">
                            <span className="bill-summary__icon"><ReceiptText size={20} /></span>
                            <div>
                                <p>Billing month</p>
                                <h2>{formatBillMonth(bill.month)}</h2>
                            </div>
                        </div>
                        <div className="bill-summary__amount">
                            <span>Total amount</span>
                            <strong>{CURRENCY_FORMATTER.format(bill.amount)}</strong>
                        </div>
                        <div className="bill-summary__due">
                            <span>Due date</span>
                            <strong>{formatDate(bill.dueDate)}</strong>
                        </div>
                        <div className="bill-summary__status">
                            <span>Payment status</span>
                            <StatusBadge status={bill.status} />
                        </div>
                    </section>

                    <section className="bill-readings" aria-label="Daily bill readings">
                        <div className="bill-readings__header">
                            <div>
                                <h2>Daily readings & charges</h2>
                                <p>{days.length} daily readings for this billing period</p>
                            </div>
                            <div className="bill-details-actions">
                                <Button type="button" variant="outline" disabled title="PDF download will be available in a later phase">
                                    <Download size={16} /> Download PDF
                                </Button>
                                <Button type="button" variant="outline" onClick={() => window.print()}>
                                    <Printer size={16} /> Print
                                </Button>
                                <Button type="button" disabled title="Payments will be available in a later phase">
                                    Pay now
                                </Button>
                            </div>
                        </div>

                        {days.length > 0 ? (
                            <DataTable
                                columns={columns}
                                data={days}
                                rowKey="id"
                                caption={`${formatBillMonth(bill.month)} daily readings`}
                            />
                        ) : (
                            <EmptyState
                                title="No daily readings available"
                                description="Daily meter readings for this bill have not been added yet."
                                icon={<ReceiptText size={28} />}
                            />
                        )}
                    </section>
                </>
            ) : null}
        </div>
    );
}

export default BillDetails;
