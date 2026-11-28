import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarDays, ReceiptText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared/components/Button/Button";
import DataTable, { type DataTableColumn } from "../../../shared/components/DataTable/DataTable";
import EmptyState from "../../../shared/components/EmptyState/EmptyState";
import PageHeader from "../../../shared/components/PageHeader";
import Pagination from "../../../shared/components/Pagination/Pagination";
import SearchFilter from "../../../shared/components/Search&Filter/Search&filter";
import StatusBadge from "../../../shared/components/StatusBadge/StatusBadge";
import { getUserBills } from "../services/billsService";
import type { Bill, BillStatus, BillsQuery } from "../types/bill";
import "./BillsPayments.css";

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
});

function formatBillMonth(month: string) {
    return new Intl.DateTimeFormat("en-IN", {
        month: "long",
        year: "numeric",
    }).format(new Date(`${month}-01T00:00:00`));
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
}

function BillsPayments() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<BillStatus | "">("");
    const [search, setSearch] = useState("");
    const [requestState, setRequestState] = useState<
        | { queryKey: string; state: "success"; bills: Bill[]; totalPages: number; totalItems: number }
        | { queryKey: string; state: "error"; message: string }
        | null
    >(null);

    const queryKey = JSON.stringify({ page, status, search });

    useEffect(() => {
        let isCurrent = true;
        const query = JSON.parse(queryKey) as BillsQuery;

        getUserBills(query)
            .then((response) => {
                if (!isCurrent) return;
                setRequestState({
                    queryKey,
                    state: "success",
                    bills: response.data.data,
                    totalPages: response.data.pages,
                    totalItems: response.data.items,
                });
            })
            .catch(() => {
                if (isCurrent) {
                    setRequestState({
                        queryKey,
                        state: "error",
                        message: "We couldn’t load your bills. Check your connection and try again.",
                    });
                }
            });

        return () => {
            isCurrent = false;
        };
    }, [queryKey]);

    const currentRequest = requestState?.queryKey === queryKey ? requestState : null;
    const isLoading = currentRequest === null;
    const bills = currentRequest?.state === "success" ? currentRequest.bills : [];
    const totalPages = currentRequest?.state === "success" ? currentRequest.totalPages : 0;
    const totalItems = currentRequest?.state === "success" ? currentRequest.totalItems : 0;
    const error = currentRequest?.state === "error" ? currentRequest.message : "";

    const columns: DataTableColumn<Bill>[] = [
        {
            key: "month",
            header: "Billing month",
            accessor: "month",
            sortable: true,
            render: (bill) => <span className="bill-month">{formatBillMonth(bill.month)}</span>,
        },
        {
            key: "amount",
            header: "Amount",
            accessor: "amount",
            sortable: true,
            render: (bill) => <span className="bill-amount">{CURRENCY_FORMATTER.format(bill.amount)}</span>,
        },
        {
            key: "dueDate",
            header: "Due date",
            accessor: "dueDate",
            sortable: true,
            render: (bill) => formatDate(bill.dueDate),
        },
        {
            key: "status",
            header: "Status",
            accessor: "status",
            sortable: true,
            render: (bill) => <StatusBadge status={bill.status} />,
        },
        {
            key: "action",
            header: "Action",
            align: "right",
            render: (bill) => (
                <Button
                    type="button"
                    variant={bill.status === "Paid" ? "secondary" : "outline"}
                    size="sm"
                    className="bill-action-button"
                    onClick={() => navigate(`/user/bills/${bill.id}`)}
                >
                    {bill.status === "Paid" ? "View" : "Pay"}
                    <ArrowUpRight size={14} aria-hidden="true" />
                </Button>
            ),
        },
    ];

    const updateSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const updateStatus = (value: string) => {
        setStatus(value as BillStatus | "");
        setPage(1);
    };

    return (
        <div className="bills-page">
            <PageHeader
                title="My bills"
                description="Review your monthly electricity bills and payment status."
                actions={(
                    <div className="bills-page__total" aria-live="polite">
                        <ReceiptText size={17} />
                        <span>{isLoading ? "Loading bills" : `${totalItems} bills`}</span>
                    </div>
                )}
            />

            <section className="bills-panel" aria-label="Bill history">
                <div className="bills-panel__toolbar">
                    <div className="bills-panel__intro">
                        <h2>Bill history</h2>
                        <p>Latest bills appear first.</p>
                    </div>
                    <SearchFilter
                        className="bills-panel__filters"
                        searchValue={search}
                        onSearchChange={updateSearch}
                        placeholder="Search billing month"
                        filters={[
                            {
                                name: "status",
                                label: "Status",
                                value: status,
                                onChange: updateStatus,
                                options: [
                                    { label: "Paid", value: "Paid" },
                                    { label: "Pending", value: "Pending" },
                                    { label: "Overdue", value: "Overdue" },
                                ],
                                allLabel: "All statuses",
                            },
                        ]}
                    />
                </div>

                {error ? (
                    <div className="bills-page__error" role="alert">{error}</div>
                ) : currentRequest?.state === "success" && bills.length === 0 ? (
                    <EmptyState
                        className="bills-page__empty"
                        title="No bills found"
                        description="Try changing your search or status filter. Your bill history will appear here."
                        icon={<CalendarDays size={28} />}
                    />
                ) : (
                    <DataTable
                        columns={columns}
                        data={bills}
                        rowKey="id"
                        caption="Monthly bill history"
                        loading={isLoading}
                        loadingMessage="Loading your bills…"
                    />
                )}

                <div className="bills-panel__footer">
                    <p>All bills are generated on the 1st of every month.</p>
                    {totalItems > 0 ? (
                        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                    ) : null}
                </div>
            </section>
        </div>
    );
}

export default BillsPayments;
