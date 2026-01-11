# Frontend Structure and Architecture in Blood4Life

## Introduction

The Blood4Life frontend is built with **React 18** and **TypeScript**, following clean architecture principles and modern development patterns. The application is organized in a modular, scalable, and maintainable way, facilitating teamwork and the addition of new features.

## Technologies and Tools

- **React 18**: UI library with hooks and functional components.
- **TypeScript**: Static typing for safety and maintainability.
- **Vite**: Ultra-fast build tool and dev server.
- **React Router**: Navigation and routing.
- **Axios**: HTTP client for backend communication.
- **TailwindCSS**: Utility-first CSS framework.
- **Context API**: Global state management.

## Directory Structure

```
frontend/src/
├── App.tsx                 # Root application component
├── main.tsx                # Application entry point
├── index.css               # Global styles
├── config.ts               # Global configuration (API_URL, etc.)
│
├── assets/                 # Static resources
│   └── images/             # Project images
│
├── components/             # Reusable components
│   ├── common/             # Generic, reusable components
│   │   ├── ui/             # Buttons, Cards, Inputs
│   │   ├── forms/          # Form fields & components
│   │   └── feedback/       # Modals, Toasts
│   │
│   ├── features/           # Business-specific components
│   │   ├── auth/           # Login & Registration
│   │   ├── donor/          # Donor Dashboard
│   │   ├── hospital/       # Hospital Dashboard
│   │   ├── admin/          # Admin tables & tools
│   │   └── profile/        # Profile management
│   │
│   └── layout/             # Layout components (Header, Footer)
│   └── ...
│
├── context/                # React Contexts (Global State)
│   └── AuthContext.tsx
│
├── hooks/                  # Reusable Custom Hooks
│   ├── useBloodDonorRegister.ts
│   ├── useHospitalRegister.ts
│   ├── useHospitalDashboard.ts
│   └── ...
│
├── models/                 # TypeScript Interfaces and Types
│   ├── BloodDonor.ts
│   └── Hospital.ts
│
├── pages/                  # Application Views/Pages
│   ├── Login/
│   ├── Register/
│   ├── DashboardBloodDonorPage/
│   ├── DashboardHospitalPage/
│   └── ...
│
├── services/               # API Communication Services
│   ├── authService.ts
│   ├── bloodDonorService.ts
│   └── hospitalService.ts
│
├── utils/                  # Utilities and Helpers
│   ├── axiosInstance.ts
│   └── validation.ts
│
└── tests/                  # Unit and Integration Tests
```

## Organization by Responsibility

### 1. Models (`models/`)

**Models** define TypeScript interfaces representing domain entities.

#### Example: `BloodDonor.ts`

```typescript
export interface BloodDonor {
  id?: number;        // Optional: doesn't exist on creation
  dni: string;
  firstName: string;
  // ... other fields
}
```

**Key Features:**
- **Optional Properties (`?`)**: For fields not always present (like ID before creation).
- **Strong Typing**: Prevents compile-time errors.
- **Implicit Documentation**: Serves as a reference for data structures.

### 2. Services (`services/`)

**Services** encapsulate backend communication logic.

#### Example: `hospitalService.ts`

```typescript
import axiosInstance from '../utils/axiosInstance';
import type { Hospital, HospitalFormData } from '../models/Hospital';

export const hospitalService = {
  async getHospitals(): Promise<Hospital[]> {
    // ... logic to fetch hospitals
  },
  
  async createHospital(hospital: HospitalFormData): Promise<Hospital> {
     // ... logic to create hospital
  }
};
```

**Principles Applied:**
- ✅ **Separation of Concerns**: HTTP logic is isolated.
- ✅ **Reusability**: Services can be used by multiple components.
- ✅ **Error Handling**: Centralized place for API error management.

### 3. Custom Hooks (`hooks/`)

**Custom hooks** encapsulate reusable stateful logic.

#### Example: `useHospitalCrud.ts`

```typescript
export const useHospitalCrud = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const loadHospitals = async () => {
    // ... implementation
  };

  return {
    hospitals,
    loading,
    loadHospitals,
    // ... other methods and state
  };
};
```

**Advantages:**
- ✅ **Logic Reuse**: Shared across components.
- ✅ **Declarative Code**: Components don't need to know implementation details.
- ✅ **Testable**: Can be tested in isolation.

### 4. Reusable Components (`components/`)

Components are divided into:
- **Common (Generic)**: Reusable UI blocks (`Button`), form inputs (`FormField`), and generic feedback (`Modal`).
- **Features (Business)**: Components with specific business logic (`BloodDonorRegisterForm`, `DonorStatsCards`).
- **Layout**: Structural components (`Header`, `Footer`).

#### Example: `Button.tsx`
A highly configurable button component supporting variants, loading states, and navigation.

### 5. Context API (`context/`)

Used for global state that needs to be accessible everywhere, primarily **Authentication**.

#### `AuthContext.tsx`
Manages:
- Current user type (`bloodDonor`, `hospital`, `admin`).
- Authentication status (`isAuthenticated`).
- Login and Logout methods.

### 6. Utilities (`utils/`)

Helper functions that don't depend on React state.

- **`axiosInstance.ts`**: Configures the Axios client with base URLs and credential settings (cookies).
- **`validation.ts`**: Centralized validation logic (Regex, required fields) used by forms.

## Design Patterns

### 1. Container vs. Presentational Components

- **Container (Smart) Components**: Manage state and logic (usually via Hooks). Example: `DashboardHospitalPage.tsx` (uses `useHospitalDashboard`).
- **Presentational (Dumb) Components**: Focus on rendering UI based on props. Example: `StatsCards.tsx`.

### 2. Provider Pattern

Used in `AuthContext` to wrap the application and provide authentication state to the entire component tree.

```tsx
<AuthProvider>
  <App />
</AuthProvider>
```
