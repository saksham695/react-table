import { SortDirection, PageSize } from './enums';

/**
 * Column configuration interface
 */
export interface Column<T = any> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  searchable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string | number;
}

/**
 * Pagination configuration interface
 */
export interface PaginationConfig {
  currentPage: number;
  pageSize: PageSize;
  totalItems: number;
  totalPages: number;
}

/**
 * Sort state interface
 */
export interface SortState<T = any> {
  column: keyof T | null;
  direction: SortDirection;
}

/**
 * Search configuration interface
 */
export interface SearchConfig {
  enabled: boolean;
  placeholder?: string;
  searchTerm: string;
}

/**
 * Main table props interface
 */
export interface TableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  className?: string;
  
  // Pagination props
  enablePagination?: boolean;
  initialPageSize?: PageSize;
  pageSizeOptions?: PageSize[];
  
  // Search props
  enableSearch?: boolean;
  searchPlaceholder?: string;
  
  // Sorting props
  defaultSort?: SortState<T>;
  
  // Loading state
  isLoading?: boolean;
}

/**
 * Pagination component props
 */
export interface PaginationProps {
  config: PaginationConfig;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: PageSize) => void;
  pageSizeOptions: PageSize[];
}

/**
 * Search component props
 */
export interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
