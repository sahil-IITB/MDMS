import API from "../../../services/http";
import type { BillsQuery, PaginatedBillsResponse } from "../types/bill";

const BILLS_PER_PAGE = 8;
const END_USER_ID = "2";

export function getUserBills({ page, status, search }: BillsQuery) {
    const params: Record<string, string | number> = {
        userId: END_USER_ID,
        _page: page,
        _per_page: BILLS_PER_PAGE,
        _sort: "-month",
    };

    if (status) params.status = status;
    if (search.trim()) params["monthLabel:contains"] = search.trim();

    return API.get<PaginatedBillsResponse>("/bills", { params });
}
