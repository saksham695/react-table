import React from 'react';
import { Column, SortState } from './types';
import { SortDirection } from './enums';
import './Table.css';

interface TableHeaderProps<T> {
  columns: Column<T>[];
  sortState: SortState<T>;
  onSort: (column: keyof T) => void;
}

/**
 * Table header component with sortable columns
 */
export function TableHeader<T>({ columns, sortState, onSort }: TableHeaderProps<T>) {
  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;
    
    if (sortState.column !== column.key) {
      return <span className="sort-indicator inactive">⇅</span>;
    }

    if (sortState.direction === SortDirection.ASC) {
      return <span className="sort-indicator active">↑</span>;
    } else if (sortState.direction === SortDirection.DESC) {
      return <span className="sort-indicator active">↓</span>;
    }

    return <span className="sort-indicator inactive">⇅</span>;
  };

  return (
    <thead className="table-header">
      <tr>
        {columns.map((column) => (
          <th
            key={String(column.key)}
            className={column.sortable ? 'sortable' : ''}
            onClick={() => column.sortable && onSort(column.key)}
            style={{ width: column.width }}
          >
            <div className="th-content">
              <span>{column.header}</span>
              {getSortIcon(column)}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
