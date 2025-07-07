import React from "react";

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (newPage: number) => void;
  onLimitChange?: (newLimit: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}) => {
  const totalPages = Math.ceil(total / limit);
  const maxPageButtons = 5;

  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, page - Math.floor(maxPageButtons / 2));
    let end = Math.min(totalPages, start + maxPageButtons - 1);

    if (end - start < maxPageButtons - 1) {
      start = Math.max(1, end - maxPageButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
      {onLimitChange && (
        <div className="flex items-center gap-2">
          <span>Items per page:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {[10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          First
        </button>

        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        {getPageNumbers().map((pg) => (
          <button
            key={pg}
            onClick={() => onPageChange(pg)}
            className={`px-3 py-1 border rounded ${
              page === pg ? "bg-blue-500 text-white" : ""
            }`}
          >
            {pg}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default Pagination;
