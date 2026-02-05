# React Table Component Library

A scalable, modular, and feature-rich table component built with React and TypeScript.

## 🚀 Features

- ✅ **Sorting** - Click column headers to sort (asc/desc/none)
- ✅ **Pagination** - Navigate through data with customizable page sizes
- ✅ **Search** - Global search across all table data
- ✅ **TypeScript** - Full type safety with enums and interfaces
- ✅ **Modular** - Easily extensible component architecture
- ✅ **Custom Rendering** - Custom cell renderers for any column
- ✅ **Row Actions** - Click handlers for row interactions
- ✅ **Responsive** - Mobile-friendly design

## 📁 Project Structure

```
src/
├── components/
│   └── Table/
│       ├── enums.ts              # Enums (SortDirection, PageSize, TableAction)
│       ├── types.ts              # TypeScript interfaces
│       ├── hooks/
│       │   └── useTableState.ts  # Custom hook for state management
│       ├── components/
│       │   ├── Pagination.tsx    # Pagination component
│       │   ├── Pagination.css
│       │   ├── Search.tsx        # Search component
│       │   └── Search.css
│       ├── Table.tsx             # Main Table component
│       ├── TableHeader.tsx       # Header component
│       ├── TableBody.tsx         # Body component
│       ├── TableRow.tsx          # Row component
│       ├── Table.css
│       └── index.ts              # Exports
└── App.tsx                       # Example usage
```

## 🎯 Usage

### Basic Example

```tsx
import { Table, Column, PageSize } from './components/Table';

interface User {
  id: number;
  name: string;
  email: string;
}

const columns: Column<User>[] = [
  { key: 'id', header: 'ID', sortable: true },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
];

const data: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  // ... more data
];

<Table
  columns={columns}
  data={data}
  enablePagination={true}
  enableSearch={true}
  initialPageSize={PageSize.MEDIUM}
/>
```

### With Custom Rendering

```tsx
const columns: Column<User>[] = [
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (value) => (
      <span className={`badge status-${value}`}>
        {value}
      </span>
    ),
  },
];
```

### With Row Click Handler

```tsx
<Table
  columns={columns}
  data={data}
  onRowClick={(row) => console.log('Clicked:', row)}
/>
```

## 🔧 Available Enums

### SortDirection
```typescript
enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
  NONE = 'none',
}
```

### PageSize
```typescript
enum PageSize {
  SMALL = 10,
  MEDIUM = 20,
  LARGE = 50,
  EXTRA_LARGE = 100,
}
```

## 📋 Table Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `Column<T>[]` | required | Column definitions |
| `data` | `T[]` | required | Data array |
| `onRowClick` | `(row: T) => void` | - | Row click handler |
| `className` | `string` | `''` | Additional CSS class |
| `enablePagination` | `boolean` | `true` | Enable pagination |
| `initialPageSize` | `PageSize` | `PageSize.MEDIUM` | Initial page size |
| `pageSizeOptions` | `PageSize[]` | `[10, 20, 50, 100]` | Available page sizes |
| `enableSearch` | `boolean` | `true` | Enable search |
| `searchPlaceholder` | `string` | `'Search...'` | Search placeholder |
| `defaultSort` | `SortState<T>` | - | Initial sort state |

## 📋 Column Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `key` | `keyof T` | ✅ | Data key |
| `header` | `string` | ✅ | Column header text |
| `sortable` | `boolean` | - | Enable sorting |
| `searchable` | `boolean` | - | Include in search |
| `render` | `(value, row) => ReactNode` | - | Custom renderer |
| `width` | `string \| number` | - | Column width |

## 🎨 Customization

### Extending the Table

1. **Add new enum values**:
```typescript
// enums.ts
export enum TableDensity {
  COMPACT = 'compact',
  NORMAL = 'normal',
  COMFORTABLE = 'comfortable',
}
```

2. **Create new components**:
```typescript
// components/Filter.tsx
export const Filter = () => {
  // Your filter logic
};
```

3. **Use the custom hook**:
```typescript
import { useTableState } from './hooks/useTableState';

const { sortState, handleSort } = useTableState(data);
```

## 🚀 Running the App

```bash
cd /Users/saksham/Documents/Practice/demo/my-table-app
npm install
npm start
```

Opens at **http://localhost:3000**

## 📦 What's Included

- **50 mock users** for testing
- **8 columns** with various data types
- **Sorting** on all columns
- **Pagination** with 4 size options (10, 20, 50, 100)
- **Global search** across all data
- **Custom rendering** for status badges and salary
- **Row click handlers** with alerts
- **Professional styling** with gradients

## 🔄 Easy to Extend

Add new features easily:
- ✅ Filters per column
- ✅ Row selection with checkboxes
- ✅ Export to CSV/Excel
- ✅ Column visibility toggles
- ✅ Resizable columns
- ✅ Virtual scrolling for large datasets
- ✅ Inline editing

The modular architecture makes it simple to add any feature!
