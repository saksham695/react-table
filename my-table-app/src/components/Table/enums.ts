/**
 * Enum for sort directions
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
  NONE = 'none',
}

/**
 * Enum for pagination sizes
 */
export enum PageSize {
  SMALL = 10,
  MEDIUM = 20,
  LARGE = 50,
  EXTRA_LARGE = 100,
}

/**
 * Enum for table actions
 */
export enum TableAction {
  SORT = 'SORT',
  PAGINATE = 'PAGINATE',
  SEARCH = 'SEARCH',
  RESIZE = 'RESIZE',
}
