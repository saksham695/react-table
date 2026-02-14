# FitConnect - Code Refactoring Guide

## Executive Summary
Current codebase has **785 lines** in storageService, **421 lines** in TrainerProfile, and significant code duplication across 27 component files. This document outlines scalability issues and refactoring opportunities.

---

## 📁 1. FILE & FOLDER STRUCTURE ISSUES

### Current Problems:

#### 1.1 Flat Page Structure
```
pages/
  ├── Availability/AvailabilityManagement.tsx
  ├── Booking/BookSession.tsx
  ├── Booking/TrainerBookings.tsx
  ├── Booking/ClientBookings.tsx
  ├── Profile/TrainerProfile.tsx
  ├── Profile/ClientProfile.tsx
```
**Issues:**
- No feature-based organization
- Hard to find related files
- No clear module boundaries
- CSS files scattered everywhere (27 CSS files)

#### 1.2 Missing Folders
- No `hooks/` folder for custom hooks
- No `lib/` or `api/` folder for utilities
- No `constants/` folder for magic strings
- No `features/` folder for feature modules
- No shared `components/ui/` folder

#### 1.3 Monolithic Service File
- `storageService.ts`: **785 lines** - handles users, courses, bookings, availability, connections
- Should be split into domain-specific services

### Recommended Structure:
```
src/
├── features/                    # Feature-based modules
│   ├── auth/
│   │   ├── components/         # Auth-specific components
│   │   ├── hooks/              # useAuth, useLogin
│   │   ├── services/           # authService
│   │   └── types/              # Auth types
│   ├── profile/
│   │   ├── components/         # ProfileForm, ProfileView
│   │   ├── hooks/              # useProfile, useProfileForm
│   │   └── pages/              # TrainerProfile, ClientProfile
│   ├── booking/
│   │   ├── components/         # BookingCard, BookingFilters
│   │   ├── hooks/              # useBookings, useAvailability
│   │   ├── services/           # bookingService
│   │   └── pages/
│   ├── courses/
│   └── trainers/
├── shared/                      # Shared across features
│   ├── components/
│   │   ├── ui/                 # Button, Input, Card, Modal
│   │   ├── forms/              # FormField, FormSection
│   │   └── layouts/            # Layout, Header
│   ├── hooks/                  # useLocalStorage, usePagination
│   ├── utils/                  # calculations, formatters
│   └── constants/              # API endpoints, status codes
├── core/                       # Core app logic
│   ├── types/                  # Global types
│   ├── contexts/               # Global contexts
│   └── config/                 # App configuration
└── styles/                     # Global & shared styles
    ├── global.css
    ├── variables.css
    └── components/             # Shared component styles
```

**Refactoring Tasks:**
- [ ] Create feature-based folder structure
- [ ] Move related files into feature modules
- [ ] Split storageService into domain services
- [ ] Create shared UI components folder
- [ ] Consolidate CSS into shared styles

---

## 🧩 2. COMPONENT DIVISION ISSUES

### Current Problems:

#### 2.1 Fat Components (400+ lines)
**TrainerProfile.tsx (421 lines)**
```tsx
// Contains:
- 15+ useState declarations
- Form logic
- Validation logic
- API calls
- BMI calculations
- View rendering
- Edit mode rendering
```
**Should be split into:**
- `ProfileView` component
- `ProfileEditForm` component
- `BasicInfoSection` component
- `ProfessionalDetailsSection` component
- `PricingSection` component
- `PhysicalDetailsSection` component

#### 2.2 Duplicate Component Logic
**TrainerBookings.tsx & ClientBookings.tsx** (204 lines each)
```tsx
// 80% identical code:
- Same filter logic
- Same stats cards
- Same booking cards
- Only difference: getClientName vs getTrainerName
```

**Should be:**
- `BookingsPage` (base component)
- `BookingCard` (reusable)
- `BookingFilters` (reusable)
- `BookingStats` (reusable)
- Props to customize behavior

#### 2.3 No Atomic Components
**Missing reusable UI components:**
- No generic `Button` component (10+ button styles duplicated)
- No generic `Input` component (forms repeated everywhere)
- No generic `Card` component (cards duplicated in 8 files)
- No generic `Modal` component (using window.confirm)
- No generic `EmptyState` component (duplicated in 10 files)
- No generic `StatCard` component (duplicated in 3 files)
- No generic `Tag` component (expertise tags everywhere)

### Refactoring Tasks:

#### Priority 1: Create Atomic UI Components
```
shared/components/ui/
├── Button/
│   ├── Button.tsx
│   ├── Button.types.ts
│   └── Button.css
├── Input/
├── Card/
├── Modal/
├── Tag/
├── EmptyState/
├── StatCard/
└── LoadingSpinner/
```

#### Priority 2: Split Large Components
- [ ] TrainerProfile → 6 sub-components
- [ ] ClientProfile → 6 sub-components
- [ ] BookSession → BookingForm + TrainerSummary
- [ ] TrainerDetail → DetailHeader + DetailSections

#### Priority 3: Extract Feature Components
```
features/booking/components/
├── BookingCard.tsx          # Reusable booking display
├── BookingFilters.tsx       # Filter UI
├── BookingStats.tsx         # Stats cards
├── BookingList.tsx          # List with filters
└── BookingActions.tsx       # Cancel/Complete buttons
```

#### Priority 4: Create Form Components
```
shared/components/forms/
├── FormField.tsx            # Label + Input + Error
├── FormSection.tsx          # Section with heading
├── FormActions.tsx          # Save/Cancel buttons
├── PhysicalDetailsForm.tsx  # Reusable H/W/BMI form
└── ExpertiseSelector.tsx    # Tags input
```

---

## 🪝 3. CUSTOM HOOKS ISSUES

### Current Problems:

#### 3.1 No Custom Hooks (Missing Abstraction)
**Repeated patterns without hooks:**

**Data Fetching Pattern (in 12+ components):**
```tsx
const [data, setData] = useState([]);
const loadData = () => {
  const result = storageService.getSomething();
  setData(result);
};
useEffect(() => {
  loadData();
}, []);
```

**Form State Pattern (in 8+ components):**
```tsx
const [field1, setField1] = useState('');
const [field2, setField2] = useState('');
const [field3, setField3] = useState('');
// ... 10+ more fields
const handleSave = () => { /* complex logic */ };
```

**Filter/Search Pattern (in 4 components):**
```tsx
const [searchTerm, setSearchTerm] = useState('');
const [filter, setFilter] = useState('');
const filtered = data.filter(/* complex logic */);
```

### Recommended Custom Hooks:

#### 3.1 Data Management Hooks
```tsx
// hooks/useBookings.ts
export const useBookings = (userId: string, role: 'trainer' | 'client') => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  
  const loadBookings = useCallback(() => {
    setLoading(true);
    const data = role === 'trainer' 
      ? storageService.getBookingsByTrainerId(userId)
      : storageService.getBookingsByClientId(userId);
    setBookings(data);
    setLoading(false);
  }, [userId, role]);
  
  const cancelBooking = async (id: string) => {
    storageService.cancelBooking(id);
    loadBookings();
  };
  
  return { bookings, loading, loadBookings, cancelBooking };
};

// Usage:
const { bookings, loading, cancelBooking } = useBookings(trainer.id, 'trainer');
```

#### 3.2 Form Management Hooks
```tsx
// hooks/useProfileForm.ts
export const useProfileForm = (initialProfile: TrainerProfile) => {
  const [formData, setFormData] = useState(initialProfile);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };
  
  const validate = () => {
    // Validation logic
  };
  
  const reset = () => {
    setFormData(initialProfile);
    setIsDirty(false);
  };
  
  return { formData, errors, isDirty, updateField, validate, reset };
};
```

#### 3.3 UI State Hooks
```tsx
// hooks/useFilters.ts
export const useFilters = <T>(data: T[], filterFn: (item: T, filters: any) => boolean) => {
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  
  const filtered = useMemo(() => {
    return data.filter(item => filterFn(item, { ...filters, searchTerm }));
  }, [data, filters, searchTerm]);
  
  return { filtered, filters, setFilters, searchTerm, setSearchTerm };
};

// hooks/usePagination.ts
export const usePagination = <T>(items: T[], pageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);
  
  return { paginatedItems, currentPage, setCurrentPage, totalPages: Math.ceil(items.length / pageSize) };
};

// hooks/useModal.ts
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);
  
  return { isOpen, open, close, toggle };
};
```

#### 3.4 LocalStorage Hooks
```tsx
// hooks/useLocalStorage.ts
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  
  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    localStorage.setItem(key, JSON.stringify(valueToStore));
  };
  
  return [storedValue, setValue] as const;
};
```

#### 3.5 Availability & Booking Hooks
```tsx
// features/booking/hooks/useAvailability.ts
export const useAvailability = (trainerId: string) => {
  const [availability, setAvailability] = useState<Availability[]>([]);
  
  const loadAvailability = () => {
    const data = storageService.getAvailabilityByTrainerId(trainerId);
    setAvailability(data);
  };
  
  const addSlot = (day: DayOfWeek, slot: TimeSlot) => {
    // Logic for adding slot
    loadAvailability();
  };
  
  const removeSlot = (day: DayOfWeek, index: number) => {
    // Logic for removing slot
    loadAvailability();
  };
  
  return { availability, loadAvailability, addSlot, removeSlot };
};
```

### Refactoring Tasks:
- [ ] Create `hooks/` directory structure
- [ ] Extract 15+ custom hooks from components
- [ ] Document hook APIs and usage examples
- [ ] Add tests for custom hooks

---

## ♻️ 4. RE-USABILITY ISSUES

### Current Problems:

#### 4.1 Duplicate Code Patterns

**Stats Cards (3 locations)**
```tsx
// Duplicated in: TrainerBookings, ClientBookings, Dashboard
<div className="stats-grid">
  <div className="stat-card">
    <div className="stat-value">{stats.total}</div>
    <div className="stat-label">Total</div>
  </div>
  // ... more cards
</div>
```

**Empty States (10 locations)**
```tsx
// Duplicated across 10 components
<div className="empty-state">
  <p>No data found</p>
</div>
```

**Filter UI (5 locations)**
```tsx
// Duplicated in: TrainerList, ClientList, Courses, etc.
<div className="filters">
  <button className={filter === 'all' ? 'active' : ''}>All</button>
  <button className={filter === 'upcoming' ? 'active' : ''}>Upcoming</button>
</div>
```

**Form Sections (15+ locations)**
```tsx
// Repeated form structure everywhere
<div className="form-section">
  <h2>Section Title</h2>
  <div className="form-group">
    <label>Label</label>
    <input />
  </div>
</div>
```

#### 4.2 Utility Functions Not Extracted

**In TrainerBookings.tsx & ClientBookings.tsx:**
```tsx
// Duplicate filter logic
const filteredBookings = bookings.filter((booking) => {
  const bookingDate = new Date(booking.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // ... 20 lines of date comparison logic
});

// Duplicate sort logic
const sortedBookings = [...filteredBookings].sort((a, b) => {
  const dateA = new Date(a.date + ' ' + a.timeSlot.startTime);
  const dateB = new Date(b.date + ' ' + b.timeSlot.startTime);
  return dateA.getTime() - dateB.getTime();
});
```

**Should be:**
```tsx
// utils/bookingUtils.ts
export const filterBookingsByStatus = (bookings, filter) => { /* */ };
export const sortBookingsByDate = (bookings) => { /* */ };
export const getBookingStats = (bookings) => { /* */ };
```

#### 4.3 No Type Utilities
**Missing helper types:**
```tsx
// Should have:
type FormState<T> = {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isDirty: boolean;
};

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

type FilterConfig<T> = {
  searchFields: (keyof T)[];
  filterFields: (keyof T)[];
};
```

#### 4.4 CSS Duplication

**Duplicate styles across 27 CSS files:**
```css
/* Appears in 10 files */
.empty-state {
  padding: 3rem;
  text-align: center;
  background: white;
  border-radius: 0.5rem;
}

/* Appears in 3 files */
.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Appears in 15+ files */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Button styles duplicated 8+ times */
.primary-button {
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
}
```

### Reusable Component Library Needed:

#### 4.5.1 Layout Components
```tsx
// shared/components/ui/Card.tsx
export const Card = ({ children, variant, padding }) => { /* */ };

// shared/components/ui/Section.tsx
export const Section = ({ title, children, actions }) => { /* */ };

// shared/components/ui/EmptyState.tsx
export const EmptyState = ({ message, icon, action }) => { /* */ };

// shared/components/ui/StatsGrid.tsx
export const StatsGrid = ({ stats }) => { /* */ };

// shared/components/ui/StatCard.tsx
export const StatCard = ({ value, label, icon, color }) => { /* */ };
```

#### 4.5.2 Form Components
```tsx
// shared/components/forms/FormField.tsx
export const FormField = ({ label, error, required, children }) => { /* */ };

// shared/components/forms/Input.tsx
export const Input = ({ type, value, onChange, error, ...props }) => { /* */ };

// shared/components/forms/Select.tsx
export const Select = ({ options, value, onChange, placeholder }) => { /* */ };

// shared/components/forms/TextArea.tsx
export const TextArea = ({ value, onChange, rows }) => { /* */ };
```

#### 4.5.3 Data Display Components
```tsx
// shared/components/ui/Tag.tsx
export const Tag = ({ label, onRemove, color, variant }) => { /* */ };

// shared/components/ui/Badge.tsx
export const Badge = ({ label, variant, size }) => { /* */ };

// shared/components/ui/Table.tsx
export const Table = ({ columns, data, onRowClick }) => { /* */ };

// shared/components/ui/List.tsx
export const List = ({ items, renderItem, emptyState }) => { /* */ };
```

#### 4.5.4 Feedback Components
```tsx
// shared/components/ui/Modal.tsx
export const Modal = ({ isOpen, onClose, title, children }) => { /* */ };

// shared/components/ui/ConfirmDialog.tsx
export const ConfirmDialog = ({ message, onConfirm, onCancel }) => { /* */ };

// shared/components/ui/Toast.tsx
export const Toast = ({ message, type, duration }) => { /* */ };

// shared/components/ui/LoadingSpinner.tsx
export const LoadingSpinner = ({ size, color }) => { /* */ };
```

#### 4.5.5 Filter & Search Components
```tsx
// shared/components/filters/SearchBar.tsx
export const SearchBar = ({ value, onChange, placeholder }) => { /* */ };

// shared/components/filters/FilterGroup.tsx
export const FilterGroup = ({ filters, activeFilter, onChange }) => { /* */ };

// shared/components/filters/FilterChips.tsx
export const FilterChips = ({ chips, onRemove }) => { /* */ };
```

### Refactoring Tasks:

#### Phase 1: Extract Common Utilities
- [ ] Create `utils/bookingUtils.ts`
- [ ] Create `utils/dateUtils.ts`
- [ ] Create `utils/validationUtils.ts`
- [ ] Create `utils/formatUtils.ts`

#### Phase 2: Build UI Component Library
- [ ] Create 15+ reusable UI components
- [ ] Create consistent prop interfaces
- [ ] Document component usage
- [ ] Add Storybook (optional)

#### Phase 3: Create Global Styles
- [ ] Extract common CSS to `styles/components.css`
- [ ] Create CSS variables for colors, spacing
- [ ] Remove duplicate styles from individual files

#### Phase 4: Type Utilities
- [ ] Create helper types for forms, async states
- [ ] Create utility types for filtering, sorting
- [ ] Document type usage patterns

---

## 📊 DETAILED REFACTORING BREAKDOWN

### By Priority:

#### 🔴 CRITICAL (Do First)
1. **Split storageService.ts** (785 lines → 5 files)
   - `services/userService.ts` (users CRUD)
   - `services/courseService.ts` (courses CRUD)
   - `services/bookingService.ts` (bookings, availability)
   - `services/connectionService.ts` (connections)
   - `services/storage.ts` (base localStorage wrapper)

2. **Create UI Component Library** (15 components)
   - Button, Input, Card, Modal, Tag
   - EmptyState, StatCard, FormField
   - Expected reduction: 40% less code duplication

3. **Extract Custom Hooks** (10+ hooks)
   - useBookings, useAvailability, useProfile
   - useFilters, usePagination, useModal
   - Expected reduction: 30% less component code

#### 🟡 HIGH (Do Second)
4. **Refactor Large Components**
   - TrainerProfile.tsx: 421 → 150 lines (6 sub-components)
   - ClientProfile.tsx: 362 → 120 lines (6 sub-components)
   - BookSession.tsx: 221 → 100 lines (3 sub-components)

5. **Consolidate Duplicate Components**
   - Merge TrainerBookings + ClientBookings → BookingsPage
   - Extract BookingCard, BookingFilters, BookingStats
   - Expected reduction: 50% less booking code

6. **Reorganize Folder Structure**
   - Create feature-based modules
   - Move files to appropriate folders
   - Consolidate CSS files

#### 🟢 MEDIUM (Do Third)
7. **Create Utility Functions**
   - Date utilities (formatting, comparison)
   - Validation utilities
   - Booking utilities (filtering, sorting)

8. **Extract Form Components**
   - PhysicalDetailsForm (used in 2 profiles)
   - ExpertiseSelector (used in multiple places)
   - PricingForm (trainer profile)

9. **Global Styles**
   - Extract common CSS patterns
   - Create CSS variables
   - Remove duplication

#### 🔵 LOW (Do Last)
10. **Type Improvements**
    - Create helper types
    - Add stricter typing
    - Document complex types

11. **Constants Extraction**
    - Extract magic strings
    - Create constants file
    - Use enums where appropriate

12. **Performance Optimization**
    - Add React.memo where needed
    - Optimize re-renders
    - Add loading states

---

## 📈 EXPECTED IMPROVEMENTS

### Code Metrics:
- **Lines of Code**: 4,000+ → 2,500 (37% reduction)
- **Component Files**: 27 → 45 (smaller, focused components)
- **Average Component Size**: 150 lines → 80 lines
- **Code Duplication**: ~40% → <10%
- **CSS Files**: 27 → 5 (consolidated)

### Developer Experience:
- ✅ Easier to find and modify code
- ✅ Faster development with reusable components
- ✅ Better testing with isolated logic
- ✅ Clearer separation of concerns
- ✅ Easier onboarding for new developers

### Maintainability:
- ✅ Single source of truth for UI components
- ✅ Consistent styling across app
- ✅ Easier bug fixes (change once, apply everywhere)
- ✅ Better scalability for new features

---

## 🎯 REFACTORING ROADMAP

### Week 1: Foundation
- [ ] Create folder structure
- [ ] Split storageService
- [ ] Create base UI components (Button, Input, Card)
- [ ] Extract 5 most used hooks

### Week 2: Components
- [ ] Build remaining UI library
- [ ] Refactor TrainerProfile & ClientProfile
- [ ] Consolidate booking components
- [ ] Extract form components

### Week 3: Cleanup
- [ ] Consolidate CSS
- [ ] Create utility functions
- [ ] Add documentation
- [ ] Remove duplicate code

### Week 4: Polish
- [ ] Add types and validation
- [ ] Performance optimization
- [ ] Testing
- [ ] Final review

---

## 📝 SPECIFIC FILES TO REFACTOR

### Immediate Action Items:

#### 1. TrainerProfile.tsx (421 lines)
```
Current: 1 file
Target: 7 files
- TrainerProfilePage.tsx (main)
- TrainerProfileView.tsx
- TrainerProfileEditForm.tsx
- BasicInfoSection.tsx
- ProfessionalSection.tsx
- PricingSection.tsx
- PhysicalSection.tsx
```

#### 2. ClientProfile.tsx (362 lines)
```
Current: 1 file
Target: 7 files
- ClientProfilePage.tsx (main)
- ClientProfileView.tsx
- ClientProfileEditForm.tsx
- BasicInfoSection.tsx
- FitnessSection.tsx
- GoalsSection.tsx
- PhysicalSection.tsx
```

#### 3. TrainerBookings.tsx & ClientBookings.tsx (408 total lines)
```
Current: 2 files (80% duplicate)
Target: 5 files
- BookingsPage.tsx (base, 100 lines)
- BookingCard.tsx (40 lines)
- BookingFilters.tsx (30 lines)
- BookingStats.tsx (50 lines)
- BookingActions.tsx (30 lines)
```

#### 4. storageService.ts (785 lines)
```
Current: 1 file
Target: 6 files
- storage.ts (base localStorage wrapper, 50 lines)
- userService.ts (150 lines)
- courseService.ts (100 lines)
- bookingService.ts (200 lines)
- availabilityService.ts (100 lines)
- connectionService.ts (100 lines)
```

---

## 🚀 GETTING STARTED

### Step 1: Create Folder Structure
```bash
mkdir -p src/features/{auth,profile,booking,courses,trainers}
mkdir -p src/shared/{components/ui,components/forms,hooks,utils,constants}
mkdir -p src/core/{types,contexts,config}
mkdir -p src/styles/components
```

### Step 2: Create First Reusable Component
Start with the most used: `Button`

### Step 3: Extract First Custom Hook
Start with: `useBookings` (used in 2 places)

### Step 4: Split First Service
Start with: `bookingService` from storageService

---

## 💡 TIPS FOR REFACTORING

1. **Refactor incrementally** - Don't try to do everything at once
2. **Test after each change** - Ensure functionality still works
3. **Keep old code** - Create new components alongside old ones
4. **Document as you go** - Add comments and README files
5. **Use TypeScript strictly** - Better types = better refactoring
6. **Review before merging** - Check for regressions

---

## 📚 RESOURCES

### Recommended Reading:
- [React Component Patterns](https://kentcdodds.com/blog/compound-components-with-react-hooks)
- [Custom Hooks Guide](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Clean Code in React](https://www.freecodecamp.org/news/clean-code-typescript/)

### Tools:
- ESLint for code quality
- Prettier for formatting
- Storybook for component development
- React DevTools for debugging

---

**Generated:** 2026-02-14
**Last Updated:** 2026-02-14
