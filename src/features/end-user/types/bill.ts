export type BillStatus = "Paid" | "Pending" | "Overdue";

export interface Bill {
    id: string;
    userId: string;
    month: string;
    monthLabel: string;
    amount: number;
    dueDate: string;
    status: BillStatus;
}

export interface PaginatedBillsResponse {
    first: number;
    prev: number | null;
    next: number | null;
    last: number;
    pages: number;
    items: number;
    data: Bill[];
}

export interface BillsQuery {
    page: number;
    status: BillStatus | "";
    search: string;
}
