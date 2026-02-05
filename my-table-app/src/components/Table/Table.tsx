import React from 'react';
import { TableProps } from './types';
import { PageSize } from './enums';
import { useTableState } from './hooks/useTableState';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { Pagination } from './components/Pagination';
import { Search } from './components/Search';
import './Table.css';

/**
 * Main Table component with sorting, pagination, and search
 */
export function Table<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  className = '',
  enablePagination = true,
  initialPageSize = PageSize.MEDIUM,
  pageSizeOptions = [PageSize.SMALL, PageSize.MEDIUM, PageSize.LARGE, PageSize.EXTRA_LARGE],
  enableSearch = true,
  searchPlaceholder = 'Search in table...',
  defaultSort,
  isLoading = false,
}: TableProps<T>) {
  const {
    sortState,
    searchConfig,
    paginationConfig,
    paginatedData,
    handleSort,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
  } = useTableState(data, initialPageSize, defaultSort);

  const displayData = enablePagination ? paginatedData : data;

  return (
    <div className={`table-wrapper ${className}`}>
      {enableSearch && !isLoading && (
        <Search
          value={searchConfig.searchTerm}
          onChange={handleSearch}
          placeholder={searchPlaceholder}
        />
      )}

      <div className="table-container">
        <table className="table">
          <TableHeader
            columns={columns}
            sortState={sortState}
            onSort={handleSort}
          />
          <TableBody
            data={displayData}
            columns={columns}
            onRowClick={onRowClick}
            isLoading={isLoading}
          />
        </table>
      </div>

      {enablePagination && !isLoading && data.length > 0 && (
        <Pagination
          config={paginationConfig}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
}
