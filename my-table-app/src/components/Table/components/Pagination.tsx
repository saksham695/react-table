import React, { useMemo } from 'react';
import { PaginationProps } from '../types';
import { PageSize } from '../enums';
import './Pagination.css';

/**
 * Pagination component with Material UI style numbered pages
 */
export const Pagination: React.FC<PaginationProps> = ({
  config,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
}) => {
  const { currentPage, pageSize, totalItems, totalPages } = config;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  /**
   * Generate page numbers to display
   * Shows: 1 ... 4 5 [6] 7 8 ... 20
   */
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 7; // Show max 7 page buttons
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of middle section
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if current page is near the start
      if (currentPage <= 3) {
        endPage = 5;
      }

      // Adjust if current page is near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
      }

      // Add ellipsis if needed before middle section
      if (startPage > 2) {
        pages.push('...');
      }

      // Add middle section
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed after middle section
      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="table-pagination">
      <div className="pagination-info">
        <span>
          Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{' '}
          <strong>{totalItems}</strong> entries
        </span>
      </div>

      <div className="pagination-controls">
        {/* Previous button */}
        <button
          className="pagination-nav-button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          title="Previous page"
        >
          <span className="nav-arrow">‹</span>
        </button>

        {/* Page number buttons */}
        <div className="pagination-pages">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                className={`pagination-page-button ${isActive ? 'active' : ''}`}
                onClick={() => onPageChange(pageNum)}
                disabled={isActive}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          className="pagination-nav-button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          title="Next page"
        >
          <span className="nav-arrow">›</span>
        </button>
      </div>

      <div className="pagination-size-selector">
        <label htmlFor="page-size">Rows per page:</label>
        <select
          id="page-size"
          className="pagination-size-dropdown"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value) as PageSize)}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
