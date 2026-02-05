import React from 'react';
import { Column } from './types';
import { TableRow } from './TableRow';
import './Table.css';

interface TableBodyProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
}

export function TableBody<T>({ data, columns, onRowClick, isLoading }: TableBodyProps<T>) {
  if (isLoading) {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length} className="table-loading-cell">
            <div className="table-loading">
              <div className="table-loading-spinner"></div>
              <span>Loading data...</span>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  if (data.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length} className="table-empty-cell">
            <div className="table-empty">
              <span className="empty-icon">📋</span>
              <p className="empty-text">No data available</p>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {data.map((row, index) => (
        <TableRow
          key={index}
          row={row}
          columns={columns}
          onClick={onRowClick}
        />
      ))}
    </tbody>
  );
}
