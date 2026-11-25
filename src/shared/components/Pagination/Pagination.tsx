import "./Pagination.css";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
    className?: string;
}

function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1,
    className = "",
}: PaginationProps) {
    const safeCurrentPage = Math.min(
        Math.max(currentPage, 1),
        Math.max(totalPages, 1),
    );

    const getPages = (): Array<number | "ellipsis"> => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        }

        const start = Math.max(2, safeCurrentPage - siblingCount);
        const end = Math.min(totalPages - 1, safeCurrentPage + siblingCount);
        const pages: Array<number | "ellipsis"> = [1];

        if (start > 2) pages.push("ellipsis");

        for (let page = start; page <= end; page += 1) {
            pages.push(page);
        }

        if (end < totalPages - 1) pages.push("ellipsis");

        pages.push(totalPages);
        return pages;
    };

    const changePage = (page: number) => {
        if (page < 1 || page > totalPages || page === safeCurrentPage) return;
        onPageChange(page);
    };

    if (totalPages <= 1) return null;

    return (
        <nav
            className={`pagination ${className}`.trim()}
            aria-label="Pagination"
        >
            <button
                type="button"
                className="pagination__button pagination__button--direction"
                onClick={() => changePage(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
                aria-label="Previous page"
            >
                ‹
            </button>

            {getPages().map((page, index) =>
                page === "ellipsis" ? (
                    <span
                        key={`ellipsis-${index}`}
                        className="pagination__ellipsis"
                        aria-hidden="true"
                    >
                        …
                    </span>
                ) : (
                    <button
                        type="button"
                        key={page}
                        className={`pagination__button ${
                            page === safeCurrentPage
                                ? "pagination__button--active"
                                : ""
                        }`.trim()}
                        onClick={() => changePage(page)}
                        aria-current={page === safeCurrentPage ? "page" : undefined}
                        aria-label={`Page ${page}`}
                    >
                        {page}
                    </button>
                ),
            )}

            <button
                type="button"
                className="pagination__button pagination__button--direction"
                onClick={() => changePage(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages}
                aria-label="Next page"
            >
                ›
            </button>
        </nav>
    );
}

export default Pagination;