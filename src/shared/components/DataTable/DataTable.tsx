import { useMemo, useState, type ReactNode } from "react";
import "./DataTable.css";

export interface DataTableColumn<T> {
    key: string;
    header: ReactNode;
    accessor?: keyof T;
    render?: (row: T, index: number) => ReactNode;
    align?: "left" | "center" | "right";
    width?: string | number;
    sortable?: boolean;
}

interface DataTableProps<T> {
    columns: DataTableColumn<T>[];
    data: T[];
    rowKey?: keyof T | ((row: T, index: number) => string | number);
    caption?: string;
    emptyMessage?: ReactNode;
    loading?: boolean;
    loadingMessage?: string;
    onRowClick?: (row: T, index: number) => void;
    className?: string;
}

function getSortableValue<T>(row: T, column: DataTableColumn<T>): unknown {
    if (!column.accessor) return undefined;
    return row[column.accessor];
}

function DataTable<T>({ 
    columns,
    data,
    rowKey,
    caption,
    emptyMessage = "No records found.",
    loading = false,
    loadingMessage = "Loading...",
    onRowClick,
    className = "",
}: DataTableProps<T>) {
    const [sort, setSort] = useState<{
        key: string;
        direction: "asc" | "desc";
    } | null>(null);

    const sortedData = useMemo(() => {
        if (!sort) return data;

        const column = columns.find((item) => item.key === sort.key);
        if (!column) return data;

        return [...data].sort((firstRow, secondRow) => {
            const firstValue = getSortableValue(firstRow, column);
            const secondValue = getSortableValue(secondRow, column);

            if (firstValue == null && secondValue == null) return 0;
            if (firstValue == null) return 1;
            if (secondValue == null) return -1;

            const firstText = String(firstValue).toLowerCase();
            const secondText = String(secondValue).toLowerCase();
            const comparison = firstText.localeCompare(secondText, undefined, {
                numeric: true,
                sensitivity: "base",
            });

            return sort.direction === "asc" ? comparison : -comparison;
        });
    }, [columns, data, sort]);

    const getRowKey = (row: T, index: number): string | number => {
        if (typeof rowKey === "function") return rowKey(row, index);
        if (rowKey) {
            const value = row[rowKey];
            if (typeof value === "string" || typeof value === "number") {
                return value;
            }
        }
        return index;
    };

    const handleSort = (column: DataTableColumn<T>) => {
        if (!column.sortable) return;

        setSort((current) => {
            if (current?.key !== column.key) {
                return { key: column.key, direction: "asc" };
            }

            return {
                key: column.key,
                direction: current.direction === "asc" ? "desc" : "asc",
            };
        });
    };

    return (
        <div className={`data-table ${className}`.trim()}>
            <div className="data-table__wrapper">
                <table className="data-table__table">
                    {caption && <caption className="data-table__caption">{caption}</caption>}

                    <thead>
                        <tr>
                            {columns.map((column) => {
                                const isSorted = sort?.key === column.key;
                                const ariaSort = isSorted
                                    ? sort.direction === "asc"
                                        ? "ascending"
                                        : "descending"
                                    : undefined;

                                return (
                                    <th
                                        key={column.key}
                                        scope="col"
                                        className={`data-table__head data-table__head--${column.align ?? "left"}`}
                                        style={{ width: column.width }}
                                        aria-sort={ariaSort}
                                    >
                                        {column.sortable ? (
                                            <button
                                                type="button"
                                                className="data-table__sort"
                                                onClick={() => handleSort(column)}
                                            >
                                                <span>{column.header}</span>
                                                <span
                                                    className={`data-table__sort-icon ${
                                                        isSorted ? "data-table__sort-icon--active" : ""
                                                    }`}
                                                    aria-hidden="true"
                                                >
                                                    {isSorted
                                                        ? sort.direction === "asc"
                                                            ? "↑"
                                                            : "↓"
                                                        : "↕"}
                                                </span>
                                            </button>
                                        ) : (
                                            column.header
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    className="data-table__status"
                                    colSpan={columns.length}
                                    role="status"
                                >
                                    {loadingMessage}
                                </td>
                            </tr>
                        ) : sortedData.length === 0 ? (
                            <tr>
                                <td
                                    className="data-table__status"
                                    colSpan={columns.length}
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            sortedData.map((row, index) => (
                                <tr
                                    key={getRowKey(row, index)}
                                    className={onRowClick ? "data-table__row--clickable" : undefined}
                                    onClick={
                                        onRowClick
                                            ? () => onRowClick(row, index)
                                            : undefined
                                    }
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className={`data-table__cell data-table__cell--${column.align ?? "left"}`}
                                        >
                                            {column.render
                                                ? column.render(row, index)
                                                : column.accessor
                                                  ? String(row[column.accessor] ?? "")
                                                  : ""}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DataTable; 