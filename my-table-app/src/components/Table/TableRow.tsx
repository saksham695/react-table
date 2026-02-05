import React from 'react';
import { Column } from './types';
import './Table.css';

interface TableRowProps<T> {
  row: T;
  columns: Column<T>[];
  onClick?: (row: T) => void;
}

export function TableRow<T>({ row, columns, onClick }: TableRowProps<T>) {
  return (
    <tr
      className={onClick ? 'clickable' : ''}
      onClick={() => onClick?.(row)}
    >
      {columns.map((column) => (
        <td key={String(column.key)}>
          {column.render
            ? column.render(row[column.key], row)
            : String(row[column.key] ?? '—')}
        </td>
      ))}
    </tr>
  );
}
