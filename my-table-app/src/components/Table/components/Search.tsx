import React from 'react';
import { SearchProps } from '../types';
import './Search.css';

/**
 * Search component for filtering table data
 */
export const Search: React.FC<SearchProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
}) => {
  return (
    <div className="table-search">
      <input
        type="text"
        className="table-search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="table-search-icon">🔍</span>
    </div>
  );
};
