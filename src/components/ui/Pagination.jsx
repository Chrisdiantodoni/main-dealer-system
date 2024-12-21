import React, { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";

const Pagination = ({
  totalPages,
  currentPage,
  handlePageChange,
  text,
  totalItems = 0,
  currentPageItems = 0,
  className = "custom-class",
}) => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    let pagesToShow = [];
    const maxPages = 6;
    const halfMaxPages = Math.floor(maxPages / 2);

    if (totalPages <= maxPages) {
      for (let i = 1; i <= totalPages; i++) {
        pagesToShow.push(i);
      }
    } else {
      if (currentPage <= halfMaxPages) {
        // Display from 1 to maxPages
        for (let i = 1; i <= maxPages; i++) {
          pagesToShow.push(i);
        }
      } else if (currentPage >= totalPages - halfMaxPages) {
        // Display from (totalPages - maxPages + 1) to totalPages
        for (let i = totalPages - maxPages + 1; i <= totalPages; i++) {
          pagesToShow.push(i);
        }
      } else {
        // Display pages around the current page
        const startPage = currentPage - halfMaxPages;
        const endPage = currentPage + halfMaxPages;
        for (let i = startPage; i <= endPage; i++) {
          pagesToShow.push(i);
        }
      }
    }
    setPages(pagesToShow);
  }, [totalPages, currentPage]);

  return (
    <div className={`${className} flex justify-between`}>
      <div className="flex flex-1 justify-between lg:hidden">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      <div className="hidden lg:flex lg:flex-1 sm:items-center sm:justify-between">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium mx-1">{currentPage}</span> to{" "}
          <span className="font-medium mx-1">{currentPageItems}</span> of
          <span className="font-medium mx-1">{totalItems}</span> entries
        </p>
      </div>
      <ul className="pagination hidden lg:flex lg:flex-1 lg:items-center sm:justify-between lg:justify-end">
        <li>
          {text ? (
            <button
              className=" text-slate-600 dark:text-slate-300 prev-next-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          ) : (
            <span className="flex">
              <button
                className="text-xl leading-4 text-slate-900 dark:text-white h-6  w-6 flex  items-center justify-center flex-col prev-next-btn "
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <Icon icon="heroicons-outline:chevron-double-left" />
              </button>
              <button
                className="text-xl leading-4 text-slate-900 dark:text-white h-6  w-6 flex  items-center justify-center flex-col prev-next-btn "
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <Icon icon="heroicons-outline:chevron-left" />
              </button>
            </span>
          )}
        </li>

        {pages.map((page) => (
          <li key={page}>
            <button
              className={`${page === currentPage ? "active" : ""} page-link`}
              onClick={() => handlePageChange(page)}
              disabled={page === currentPage}
            >
              {page}
            </button>
          </li>
        ))}

        <li>
          {text ? (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className=" text-slate-600 dark:text-slate-300 prev-next-btn"
            >
              Next
            </button>
          ) : (
            <span className="flex">
              <button
                className="text-xl leading-4 text-slate-900 dark:text-white  h-6  w-6 flex  items-center justify-center flex-col prev-next-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <Icon icon="heroicons-outline:chevron-right" />
              </button>
              <button
                className="text-xl leading-4 text-slate-900 dark:text-white h-6  w-6 flex  items-center justify-center flex-col prev-next-btn "
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                <Icon icon="heroicons-outline:chevron-double-right" />
              </button>
            </span>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
