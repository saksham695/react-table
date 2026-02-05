import React, { useState, useEffect } from 'react';
import { Table, Column, PageSize, SortDirection } from './components/Table';
import { fetchUsers, clearAllUsers, resetUsers, User } from './services/mockApi';
import './App.css';

const columns: Column<User>[] = [
  {
    key: 'id',
    header: 'ID',
    sortable: true,
    width: 80,
  },
  {
    key: 'name',
    header: 'Name',
    sortable: true,
    searchable: true,
    width: 150,
  },
  {
    key: 'email',
    header: 'Email',
    sortable: true,
    searchable: true,
    width: 250,
  },
  {
    key: 'role',
    header: 'Role',
    sortable: true,
    width: 120,
  },
  {
    key: 'department',
    header: 'Department',
    sortable: true,
    width: 130,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    width: 120,
    render: (value) => (
      <span className={`status-badge status-${value.toLowerCase()}`}>
        {value}
      </span>
    ),
  },
  {
    key: 'age',
    header: 'Age',
    sortable: true,
    width: 80,
  },
  {
    key: 'salary',
    header: 'Salary',
    sortable: true,
    width: 120,
    render: (value) => `$${Number(value).toLocaleString()}`,
  },
];

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching data from backend on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (user: User) => {
    console.log('Clicked user:', user);
    alert(`Selected: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}`);
  };

  const handleClearData = () => {
    clearAllUsers();
    setUsers([]);
  };

  const handleResetData = async () => {
    resetUsers(100);
    await loadUsers();
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🚀 React Table Component Library</h1>
        <p>Scalable, modular, and feature-rich table with TypeScript</p>
      </header>
      <main className="main">
        <div className="table-info">
          <div className="info-content">
            <h2>Features Included:</h2>
            <ul>
              <li>✅ <strong>Loading State</strong> - Simulated API calls with spinner</li>
              <li>✅ <strong>Empty State</strong> - Beautiful no-data display</li>
              <li>✅ <strong>100 Mock Records</strong> - Generated with realistic data</li>
              <li>✅ <strong>Sorting</strong> - Click column headers (3 states)</li>
              <li>✅ <strong>Pagination</strong> - Material UI style with page numbers</li>
              <li>✅ <strong>Search</strong> - Global search across all columns</li>
              <li>✅ <strong>Custom Rendering</strong> - Status badges, formatted salary</li>
              <li>✅ <strong>TypeScript</strong> - Full type safety with enums</li>
            </ul>
          </div>
          <div className="info-actions">
            <button className="action-button reload" onClick={handleResetData}>
              🔄 Reload Data (100 records)
            </button>
            <button className="action-button clear" onClick={handleClearData}>
              🗑️ Clear All (Test Empty State)
            </button>
          </div>
        </div>

        <Table
          columns={columns}
          data={users}
          onRowClick={handleRowClick}
          isLoading={isLoading}
          enablePagination={true}
          initialPageSize={PageSize.MEDIUM}
          pageSizeOptions={[PageSize.SMALL, PageSize.MEDIUM, PageSize.LARGE, PageSize.EXTRA_LARGE]}
          enableSearch={true}
          searchPlaceholder="Search by name, email, role, department..."
          defaultSort={{ column: 'name', direction: SortDirection.ASC }}
        />
      </main>
    </div>
  );
}

export default App;
