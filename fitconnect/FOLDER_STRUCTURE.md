# FitConnect - Recommended Folder Structure

## 📁 Current Structure (Before Refactoring)

```
fitconnect/
├── public/
│   └── index.html
├── src/
│   ├── App.tsx
│   ├── index.tsx
│   ├── index.css
│   ├── App.css
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Header.css
│   │   │   ├── Layout.tsx
│   │   │   └── Layout.css
│   │   └── ProtectedRoute.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── Landing/
│   │   ├── Login/
│   │   ├── Signup/
│   │   ├── Dashboard/
│   │   ├── Trainers/
│   │   ├── Clients/
│   │   ├── Courses/
│   │   ├── Goals/
│   │   ├── Profile/
│   │   ├── Availability/
│   │   └── Booking/
│   ├── services/
│   │   ├── authService.ts
│   │   └── storageService.ts (785 lines!)
│   ├── types/
│   │   ├── enums.ts
│   │   └── interfaces.ts
│   ├── utils/
│   │   └── calculations.ts
│   └── styles/
│       ├── variables.css
│       └── utilities.css
└── package.json
```

**Issues:**
- ❌ Flat page structure
- ❌ No feature-based organization
- ❌ Services mixed together
- ❌ No hooks folder
- ❌ CSS scattered everywhere

---

## 🎯 Recommended Structure (Scalable & Production-Ready)

```
fitconnect/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
│
├── src/
│   │
│   ├── core/                           # Core app logic (shared across features)
│   │   ├── types/
│   │   │   ├── index.ts                # Re-export all types
│   │   │   ├── enums.ts                # UserRole, FitnessLevel, etc.
│   │   │   ├── interfaces.ts           # User, Trainer, Client, Course
│   │   │   └── api.ts                  # API response types
│   │   │
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx         # Authentication context
│   │   │   └── index.ts                # Re-export contexts
│   │   │
│   │   ├── config/
│   │   │   ├── constants.ts            # App constants
│   │   │   ├── routes.ts               # Route definitions
│   │   │   └── storage.ts              # Storage keys, config
│   │   │
│   │   └── utils/
│   │       ├── calculations.ts         # BMI, date calculations
│   │       ├── formatters.ts           # Date, currency formatters
│   │       ├── validators.ts           # Form validation helpers
│   │       └── index.ts                # Re-export utils
│   │
│   ├── features/                       # Feature-based modules
│   │   │
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── SignupForm.tsx
│   │   │   │   └── RoleSelector.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts          # Custom auth hook
│   │   │   │   └── useLogin.ts         # Login logic
│   │   │   ├── pages/
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Signup.tsx
│   │   │   │   └── Landing.tsx
│   │   │   ├── services/
│   │   │   │   └── authService.ts
│   │   │   ├── types/
│   │   │   │   └── auth.types.ts       # Auth-specific types
│   │   │   └── index.ts                # Feature exports
│   │   │
│   │   ├── profile/
│   │   │   ├── components/
│   │   │   │   ├── TrainerProfileView.tsx
│   │   │   │   ├── TrainerProfileEdit.tsx
│   │   │   │   ├── ClientProfileView.tsx
│   │   │   │   ├── ClientProfileEdit.tsx
│   │   │   │   ├── BasicInfoSection.tsx
│   │   │   │   ├── ProfessionalSection.tsx
│   │   │   │   ├── PhysicalDetailsSection.tsx
│   │   │   │   ├── PricingSection.tsx
│   │   │   │   └── CertificationsSection.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useProfile.ts       # Profile data fetching
│   │   │   │   ├── useProfileForm.ts   # Form state management
│   │   │   │   └── useBMICalculation.ts
│   │   │   ├── pages/
│   │   │   │   ├── TrainerProfile.tsx
│   │   │   │   └── ClientProfile.tsx
│   │   │   ├── services/
│   │   │   │   └── profileService.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── booking/
│   │   │   ├── components/
│   │   │   │   ├── BookingCard.tsx
│   │   │   │   ├── BookingFilters.tsx
│   │   │   │   ├── BookingStats.tsx
│   │   │   │   ├── BookingList.tsx
│   │   │   │   ├── BookingActions.tsx
│   │   │   │   ├── AvailabilityCalendar.tsx
│   │   │   │   └── TimeSlotSelector.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useBookings.ts      # Booking data fetching
│   │   │   │   ├── useAvailability.ts  # Availability management
│   │   │   │   ├── useBookingForm.ts   # Booking form logic
│   │   │   │   └── useBookingFilters.ts
│   │   │   ├── pages/
│   │   │   │   ├── AvailabilityManagement.tsx
│   │   │   │   ├── BookSession.tsx
│   │   │   │   ├── TrainerBookings.tsx
│   │   │   │   └── ClientBookings.tsx
│   │   │   ├── services/
│   │   │   │   ├── bookingService.ts
│   │   │   │   └── availabilityService.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── courses/
│   │   │   ├── components/
│   │   │   │   ├── CourseCard.tsx
│   │   │   │   ├── CourseList.tsx
│   │   │   │   ├── CourseForm.tsx
│   │   │   │   └── CourseDetail.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useCourses.ts
│   │   │   │   └── useCourseForm.ts
│   │   │   ├── pages/
│   │   │   │   ├── CourseList.tsx
│   │   │   │   ├── CreateCourse.tsx
│   │   │   │   ├── CourseDetail.tsx
│   │   │   │   └── MyCourses.tsx
│   │   │   ├── services/
│   │   │   │   └── courseService.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── trainers/
│   │   │   ├── components/
│   │   │   │   ├── TrainerCard.tsx
│   │   │   │   ├── TrainerList.tsx
│   │   │   │   ├── TrainerDetail.tsx
│   │   │   │   └── TrainerFilters.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useTrainers.ts
│   │   │   │   └── useTrainerSearch.ts
│   │   │   ├── pages/
│   │   │   │   ├── TrainerList.tsx
│   │   │   │   └── TrainerDetail.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── clients/
│   │       ├── components/
│   │       │   ├── ClientCard.tsx
│   │       │   ├── ClientList.tsx
│   │       │   ├── ClientDetail.tsx
│   │       │   └── ClientFilters.tsx
│   │       ├── hooks/
│   │       │   ├── useClients.ts
│   │       │   └── useClientSearch.ts
│   │       ├── pages/
│   │       │   ├── ClientList.tsx
│   │       │   └── ClientDetail.tsx
│   │       └── index.ts
│   │
│   ├── shared/                          # Shared across features
│   │   │
│   │   ├── components/
│   │   │   │
│   │   │   ├── ui/                      # Atomic UI components
│   │   │   │   ├── Button/
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Button.types.ts
│   │   │   │   │   ├── Button.css
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Input/
│   │   │   │   │   ├── Input.tsx
│   │   │   │   │   ├── Input.types.ts
│   │   │   │   │   ├── Input.css
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Card/
│   │   │   │   │   ├── Card.tsx
│   │   │   │   │   ├── Card.css
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Modal/
│   │   │   │   │   ├── Modal.tsx
│   │   │   │   │   ├── Modal.css
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Tag/
│   │   │   │   │   ├── Tag.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Badge/
│   │   │   │   │   ├── Badge.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── EmptyState/
│   │   │   │   │   ├── EmptyState.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── StatCard/
│   │   │   │   │   ├── StatCard.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── LoadingSpinner/
│   │   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts            # Re-export all UI components
│   │   │   │
│   │   │   ├── forms/                   # Form components
│   │   │   │   ├── FormField.tsx
│   │   │   │   ├── FormSection.tsx
│   │   │   │   ├── FormActions.tsx
│   │   │   │   ├── FormError.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── filters/                 # Filter components
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── FilterSelect.tsx
│   │   │   │   ├── FilterChips.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── layouts/                 # Layout components
│   │   │       ├── Layout.tsx
│   │   │       ├── Header.tsx
│   │   │       ├── Footer.tsx          # Future
│   │   │       ├── Sidebar.tsx          # Future
│   │   │       └── index.ts
│   │   │
│   │   ├── hooks/                       # Shared custom hooks
│   │   │   ├── useSearch.ts
│   │   │   ├── useFilter.ts
│   │   │   ├── usePagination.ts
│   │   │   ├── useModal.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useDebounce.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── services/                    # Shared services
│   │   │   ├── storage/
│   │   │   │   ├── baseStorage.ts      # localStorage wrapper
│   │   │   │   ├── userService.ts      # User CRUD
│   │   │   │   ├── courseService.ts    # Course CRUD
│   │   │   │   ├── connectionService.ts # Connection CRUD
│   │   │   │   └── mockData.ts         # Mock data generation
│   │   │   └── api/                     # Future: API client
│   │   │       ├── client.ts
│   │   │       └── endpoints.ts
│   │   │
│   │   └── utils/                       # Shared utilities
│   │       ├── date.ts
│   │       ├── validation.ts
│   │       └── index.ts
│   │
│   ├── styles/                          # Global styles
│   │   ├── variables.css                # CSS custom properties
│   │   ├── base.css                     # Reset & base styles
│   │   ├── components.css               # Shared component styles
│   │   ├── utilities.css                # Utility classes
│   │   └── themes/                      # Future: dark mode
│   │       └── dark.css
│   │
│   ├── App.tsx                          # Root component
│   ├── App.css                          # App-specific styles
│   ├── index.tsx                        # Entry point
│   └── index.css                        # Global imports
│
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
├── DESIGN_SYSTEM.md
└── REFACTORING_GUIDE.md
```

---

## 📋 Detailed Breakdown by Category

### 🎯 **Core** (`src/core/`)
**Purpose:** App-wide logic that doesn't belong to any specific feature

```
core/
├── types/              # Global TypeScript types
├── contexts/           # Global React contexts
├── config/             # App configuration
└── utils/              # Global utility functions
```

**Key Files:**
- `core/types/interfaces.ts` - User, Trainer, Client, Course interfaces
- `core/types/enums.ts` - UserRole, FitnessLevel, BookingStatus
- `core/contexts/AuthContext.tsx` - Authentication state
- `core/config/constants.ts` - App-wide constants
- `core/utils/calculations.ts` - BMI, date calculations

---

### 🎨 **Features** (`src/features/`)
**Purpose:** Feature-based modules (each feature is self-contained)

**Structure Pattern (Same for all features):**
```
feature-name/
├── components/         # Feature-specific components
├── hooks/              # Feature-specific hooks
├── pages/              # Feature pages/routes
├── services/           # Feature-specific services
├── types/              # Feature-specific types (optional)
└── index.ts            # Public API exports
```

**Features:**
1. **auth/** - Authentication & onboarding
2. **profile/** - Profile management (Trainer & Client)
3. **booking/** - Availability & booking system
4. **courses/** - Course management
5. **trainers/** - Trainer discovery
6. **clients/** - Client management

---

### 🔧 **Shared** (`src/shared/`)
**Purpose:** Reusable components, hooks, and utilities

#### **shared/components/ui/**
**Atomic UI components** - Small, reusable building blocks

```
ui/
├── Button/             # Button component
│   ├── Button.tsx
│   ├── Button.types.ts
│   ├── Button.css
│   └── index.ts
├── Input/              # Input component
├── Card/               # Card component
├── Modal/              # Modal component
└── ...                 # More components
```

**Why separate folders?**
- Each component can have its own styles
- Easy to find and modify
- Can add tests later (`Button.test.tsx`)
- Can add stories (`Button.stories.tsx`)

#### **shared/components/forms/**
**Form-related components** - Used across multiple features

```
forms/
├── FormField.tsx       # Label + Input + Error wrapper
├── FormSection.tsx     # Section with heading
├── FormActions.tsx     # Save/Cancel buttons
└── FormError.tsx       # Error message display
```

#### **shared/components/filters/**
**Filter/search components** - Used in lists

```
filters/
├── SearchBar.tsx       # Search input
├── FilterSelect.tsx    # Dropdown filter
└── FilterChips.tsx     # Chip-based filters
```

#### **shared/hooks/**
**Reusable custom hooks** - Logic shared across features

```
hooks/
├── useSearch.ts        # Search functionality
├── useFilter.ts        # Filter functionality
├── usePagination.ts    # Pagination logic
├── useModal.ts         # Modal state management
└── useLocalStorage.ts  # localStorage wrapper
```

#### **shared/services/**
**Shared services** - Data layer abstraction

```
services/
├── storage/
│   ├── baseStorage.ts      # localStorage wrapper
│   ├── userService.ts      # User operations
│   ├── courseService.ts    # Course operations
│   ├── connectionService.ts # Connection operations
│   └── mockData.ts         # Mock data generation
└── api/                    # Future: HTTP client
```

---

### 🎨 **Styles** (`src/styles/`)
**Purpose:** Global styling system

```
styles/
├── variables.css       # CSS custom properties (design tokens)
├── base.css           # Reset, normalize, base styles
├── components.css      # Shared component styles
├── utilities.css       # Utility classes (.btn-primary, etc.)
└── themes/            # Future: theme variants
    └── dark.css
```

---

## 🔄 Migration Path

### Phase 1: Create New Structure (Week 1)

```bash
# 1. Create core folder structure
mkdir -p src/core/{types,contexts,config,utils}
mkdir -p src/features/{auth,profile,booking,courses,trainers,clients}
mkdir -p src/shared/{components/{ui,forms,filters,layouts},hooks,services/storage,utils}
mkdir -p src/styles/themes

# 2. Move existing files
# Move types
mv src/types/* src/core/types/

# Move contexts
mv src/contexts/* src/core/contexts/

# Move utils
mv src/utils/* src/core/utils/

# 3. Split storageService
# Create new service files in shared/services/storage/
```

### Phase 2: Move Features (Week 2)

```bash
# Move auth pages
mv src/pages/Login src/features/auth/pages/
mv src/pages/Signup src/features/auth/pages/
mv src/pages/Landing src/features/auth/pages/

# Move profile pages
mv src/pages/Profile/* src/features/profile/pages/

# Move booking pages
mv src/pages/Availability src/features/booking/pages/
mv src/pages/Booking src/features/booking/pages/

# Move course pages
mv src/pages/Courses/* src/features/courses/pages/

# Move trainer pages
mv src/pages/Trainers/* src/features/trainers/pages/

# Move client pages
mv src/pages/Clients/* src/features/clients/pages/
```

### Phase 3: Create Shared Components (Week 3)

```bash
# Create UI components
mkdir -p src/shared/components/ui/{Button,Input,Card,Modal,Tag,Badge,EmptyState,StatCard}

# Create form components
mkdir -p src/shared/components/forms

# Create filter components
mkdir -p src/shared/components/filters
```

---

## 📝 File Naming Conventions

### Components
```
✅ PascalCase for components: Button.tsx, UserCard.tsx
✅ kebab-case for CSS: Button.css, user-card.css
✅ index.ts for re-exports
```

### Hooks
```
✅ camelCase starting with "use": useAuth.ts, useBookings.ts
```

### Services
```
✅ camelCase ending with "Service": authService.ts, userService.ts
```

### Types
```
✅ camelCase: interfaces.ts, enums.ts
✅ Or descriptive: auth.types.ts, booking.types.ts
```

### Pages
```
✅ PascalCase: Login.tsx, TrainerProfile.tsx
```

---

## 🎯 Import Path Examples

### Before (Current):
```tsx
import { storageService } from '../../services/storageService';
import { Trainer } from '../../types/interfaces';
import Layout from '../../components/Layout/Layout';
```

### After (Recommended):
```tsx
// Feature imports
import { useTrainers } from '@/features/trainers/hooks/useTrainers';
import { TrainerCard } from '@/features/trainers/components/TrainerCard';

// Shared imports
import { Button } from '@/shared/components/ui/Button';
import { useSearch } from '@/shared/hooks/useSearch';
import { userService } from '@/shared/services/storage/userService';

// Core imports
import { Trainer } from '@/core/types';
import { useAuth } from '@/core/contexts/AuthContext';
```

**Note:** Configure path aliases in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"],
      "@/features/*": ["src/features/*"],
      "@/shared/*": ["src/shared/*"],
      "@/core/*": ["src/core/*"]
    }
  }
}
```

---

## 📊 File Count Comparison

| Category | Current | Recommended | Change |
|----------|---------|-------------|--------|
| **Pages** | 18 files | 18 files | Same |
| **Components** | 2 files | 50+ files | More granular |
| **Services** | 2 files | 6 files | Split by domain |
| **Hooks** | 0 files | 20+ files | New |
| **Types** | 2 files | 2 files | Same (better organized) |
| **Styles** | 27 files | 5 files | Consolidated |

**Total Files:** ~50 → ~100+ (but much better organized!)

---

## ✅ Benefits of This Structure

### 1. **Scalability**
- ✅ Easy to add new features (just create new folder)
- ✅ Features are independent
- ✅ No file conflicts

### 2. **Maintainability**
- ✅ Easy to find files (by feature)
- ✅ Clear separation of concerns
- ✅ Easy to refactor one feature at a time

### 3. **Reusability**
- ✅ Shared components in one place
- ✅ Shared hooks easy to discover
- ✅ No code duplication

### 4. **Team Collaboration**
- ✅ Multiple developers can work on different features
- ✅ Clear ownership boundaries
- ✅ Easy code reviews

### 5. **Testing**
- ✅ Easy to test features in isolation
- ✅ Shared utilities easy to test
- ✅ Component tests next to components

---

## 🚀 Quick Start Commands

```bash
# Create entire structure
mkdir -p src/{core/{types,contexts,config,utils},features/{auth,profile,booking,courses,trainers,clients}/{components,hooks,pages,services},shared/{components/{ui,forms,filters,layouts},hooks,services/storage,utils},styles/themes}

# Create UI component folders
mkdir -p src/shared/components/ui/{Button,Input,Card,Modal,Tag,Badge,EmptyState,StatCard,LoadingSpinner}

# Create index files for re-exports
touch src/core/types/index.ts
touch src/shared/components/ui/index.ts
touch src/shared/hooks/index.ts
```

---

## 📚 Additional Recommendations

### 1. **Add Path Aliases** (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/*": ["./*"],
      "@/features/*": ["./features/*"],
      "@/shared/*": ["./shared/*"],
      "@/core/*": ["./core/*"],
      "@/styles/*": ["./styles/*"]
    }
  }
}
```

### 2. **Add Barrel Exports** (index.ts files)
```tsx
// src/shared/components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';
// ... etc
```

### 3. **Feature Index Files**
```tsx
// src/features/trainers/index.ts
export { TrainerList } from './pages/TrainerList';
export { TrainerDetail } from './pages/TrainerDetail';
export { useTrainers } from './hooks/useTrainers';
```

### 4. **Consider Adding**
- `__tests__/` folders for tests
- `__stories__/` folders for Storybook (optional)
- `README.md` in each feature folder (documentation)

---

**Last Updated:** February 15, 2026  
**Version:** 1.0.0  
**Status:** Ready for Implementation
