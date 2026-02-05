import { useState, useMemo, useCallback } from 'react';
import { SortDirection, PageSize } from '../enums';
import { SortState, PaginationConfig, SearchConfig } from '../types';

/**
 * Custom hook to manage table state (sorting, pagination, search)
 */
export function useTableState<T extends Record<string, any>>(
  data: T[],
  initialPageSize: PageSize = PageSize.MEDIUM,
  defaultSort?: SortState<T>
) {
  // Sort state
  const [sortState, setSortState] = useState<SortState<T>>(
    defaultSort || { column: null, direction: SortDirection.NONE }
  );

  // Search state
  const [searchConfig, setSearchConfig] = useState<SearchConfig>({
    enabled: false,
    searchTerm: '',
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(initialPageSize);

  /**
   * Handle sorting
   */
  const handleSort = useCallback((column: keyof T) => {
    setSortState((prev) => {
      if (prev.column === column) {
        // Cycle: asc -> desc -> none
        if (prev.direction === SortDirection.ASC) {
          return { column, direction: SortDirection.DESC };
        } else if (prev.direction === SortDirection.DESC) {
          return { column: null, direction: SortDirection.NONE };
        }
      }
      return { column, direction: SortDirection.ASC };
    });
    setCurrentPage(1); // Reset to first page on sort
  }, []);

  /**
   * Handle search
   */
  const handleSearch = useCallback((term: string) => {
    setSearchConfig((prev) => ({ ...prev, searchTerm: term }));
    setCurrentPage(1); // Reset to first page on search
  }, []);

  /**
   * Handle page change
   */
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  /**
   * Handle page size change
   */
  const handlePageSizeChange = useCallback((size: PageSize) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
  }, []);

  /**
   * Filter data based on search term
   */
  const filteredData = useMemo(() => {
    if (!searchConfig.searchTerm) return data;

    const term = searchConfig.searchTerm.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(term)
      )
    );
  }, [data, searchConfig.searchTerm]);

  /**
   * Sort filtered data
   */
  const sortedData = useMemo(() => {
    if (!sortState.column || sortState.direction === SortDirection.NONE) {
      return filteredData;
    }

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortState.column!];
      const bVal = b[sortState.column!];

      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return sortState.direction === SortDirection.ASC ? comparison : -comparison;
    });
  }, [filteredData, sortState]);

  /**
   * Calculate pagination
   */
  const paginationConfig: PaginationConfig = useMemo(() => {
    const totalItems = sortedData.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      currentPage,
      pageSize,
      totalItems,
      totalPages,
    };
  }, [sortedData.length, pageSize, currentPage]);

  /**
   * Get paginated data
   */
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize]);

  return {
    sortState,
    searchConfig,
    paginationConfig,
    paginatedData,
    handleSort,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
  };
}
