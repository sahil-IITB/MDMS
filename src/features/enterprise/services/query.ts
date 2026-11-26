import API from "../../../services/http";
import type { ListParams, PagedResult } from "../types/enterprise.types";

type Query = Record<string, string | number>;
type FilterValue = string | number;

interface JsonServerPage<T> {
    items: number;
    data: T[];
}

const FILTER_OPERATORS = new Set([
    "eq",
    "ne",
    "lt",
    "lte",
    "gt",
    "gte",
    "in",
    "contains",
    "startsWith",
    "endsWith",
]);

function getFilterParts(key: string): { field: string; operator: string } {
    const separator = key.lastIndexOf(":");
    if (separator === -1) return { field: key, operator: "eq" };

    const field = key.slice(0, separator);
    const operator = key.slice(separator + 1);
    if (!field || !FILTER_OPERATORS.has(operator)) {
        throw new Error(`Unsupported JSON Server filter: ${key}`);
    }

    return { field, operator };
}

export function toQueryParams(params: ListParams): Query {
    const query: Query = {
        _page: params.page,
        _per_page: params.pageSize,
    };

    if (params.sortBy) {
        query._sort = params.sortOrder === "desc" ? `-${params.sortBy}` : params.sortBy;
    }

    const where: Record<string, unknown> = {};
    const fieldFilters = new Map<string, Record<string, FilterValue>>();

    Object.entries(params.filters ?? {}).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === "all") return;

        const { field, operator } = getFilterParts(key);
        const operators = fieldFilters.get(field) ?? {};
        operators[operator] = value;
        fieldFilters.set(field, operators);
    });

    fieldFilters.forEach((operators, field) => {
        where[field] = operators;
    });

    const search = params.search?.trim();
    if (search) {
        const fields = params.searchFields?.filter((field) => field.trim()) ?? [];
        if (fields.length === 0) {
            throw new Error("Provide searchFields to search with JSON Server v1.");
        }

        where.or = fields.map((field) => ({ [field]: { contains: search } }));
    }

    if (Object.keys(where).length > 0) {
        query._where = JSON.stringify(where);
    }

    return query;
}

export async function fetchPaged<T>(
    url: string,
    params: ListParams,
): Promise<PagedResult<T>> {
    const response = await API.get<JsonServerPage<T>>(url, {
        params: toQueryParams(params),
    });
    return { items: response.data.data, total: response.data.items };
}

export async function fetchCount(
    url: string,
    filters: Record<string, string | number> = {},
): Promise<number> {
    const result = await fetchPaged<unknown>(url, {
        page: 1,
        pageSize: 1,
        filters,
    });
    return result.total;
}

export async function fetchList<T>(
    url: string,
    params: Query = {},
): Promise<T[]> {
    const response = await API.get<T[]>(url, { params });
    return response.data;
}
