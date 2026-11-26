import { useCallback, useMemo, useState } from "react";
import { PAGE_SIZE } from "../types/enterprise.constants";
import type { ListParams, SortOrder } from "../types/enterprise.types";
import { useDebounce } from "./useEnterpriseData";

export interface ServerTableOptions {
    pageSize?: number;
    sortBy?: string;
    sortOrder?: SortOrder;
    filters?: Record<string, string>;
    fixedFilters?: Record<string, string>;
    searchFields?: string[];
}

export function useServerTable(options: ServerTableOptions = {}) {
    const [page, setPage] = useState(1);
    const [pageSize] = useState(options.pageSize ?? PAGE_SIZE);
    const [sortBy, setSortBy] = useState<string | undefined>(options.sortBy);
    const [sortOrder, setSortOrder] = useState<SortOrder>(options.sortOrder ?? "asc");
    const [searchInput, setSearchInput] = useState("");
    const [filters, setFilters] = useState<Record<string, string>>(options.filters ?? {});
    const search = useDebounce(searchInput, 400);
    const fixedFiltersKey = JSON.stringify(options.fixedFilters ?? {});
    const searchFieldsKey = JSON.stringify(options.searchFields ?? []);

    const setSearch = useCallback((value: string) => {
        setSearchInput(value);
        setPage(1);
    }, []);

    const setFilter = useCallback((key: string, value: string) => {
        setFilters((previous) =>
            previous[key] === value ? previous : { ...previous, [key]: value },
        );
        setPage(1);
    }, []);

    const setSort = useCallback((key: string, order: SortOrder) => {
        setSortBy(key);
        setSortOrder(order);
        setPage(1);
    }, []);

    const params = useMemo<ListParams>(
        () => ({
            page,
            pageSize,
            sortBy,
            sortOrder,
            search,
            searchFields: JSON.parse(searchFieldsKey) as string[],
            filters: {
                ...filters,
                ...(JSON.parse(fixedFiltersKey) as Record<string, string>),
            },
        }),
        [page, pageSize, sortBy, sortOrder, search, searchFieldsKey, filters, fixedFiltersKey],
    );

    return {
        params,
        page,
        setPage,
        pageSize,
        sortBy,
        sortOrder,
        setSort,
        searchInput,
        setSearch,
        filters,
        setFilter,
    };
}

export type ServerTable = ReturnType<typeof useServerTable>;
