# Frontend Refactoring Documentation

## 1. Project Overview & Objectives

The main goal of this refactoring was to simplify the frontend codebase, making it more accessible and readable—especially for educational purposes. We prioritized fixing inconsistencies, centralizing repetitive logic, and establishing a clear separation of concerns between business logic (Hooks) and User Interface (Components).

## 2. Core Principles

*   **Separation of Concerns:** React components should focus primarily on rendering the UI (`JSX`). State management, side effects, and service calls belong in Custom Hooks.
*   **DRY (Don't Repeat Yourself):** Validation logic, previously scattered and duplicated across multiple forms, has been centralized into a single utility.
*   **Consistency:** Data access patterns (using `axiosInstance`) and component structures were unified across the project.

## 3. Change Details

### 3.1. Centralized Validation (`src/utils/validation.ts`)

Previously, every form defined its own regex patterns and validation functions, leading to duplication.
We created `src/utils/validation.ts`, which exports pure, reusable functions:

*   **Functions:** `validateDNI`, `validateCIF`, `validateName`, `validateEmail`, `validatePassword`, etc.
*   **Usage:** These are consumed by both registration form hooks and the profile editing modal.
*   **Benefit:** If a business rule changes (e.g., the DNI format), it only needs to be updated in one place.

### 3.2. Registration Forms

#### `BloodDonorRegisterForm` & `HospitalRegisterForm`

*   **Before:** Monolithic components mixing form UI with hundreds of lines of validation logic, complex `useState` management, and API calls.
*   **After:**
    *   Created `useBloodDonorRegister.ts` and `useHospitalRegister.ts`.
    *   These hooks return everything the component needs: `formData`, `errors`, `handleChange`, `handleSubmit`, `loading`.
    *   The `.tsx` components are now purely presentational and significantly shorter.

### 3.3. Authentication Service Unification (`authService.ts`)

*   **Problem:** The code mixed global `axios` usage with a custom `axiosInstance`. This caused inconsistencies with base URLs and interceptor handling.
*   **Solution:** Refactored `authService.ts` to exclusively use `axiosInstance`. unused imports were cleaned up, and comments were translated to maintain language consistency.

### 3.4. Hospital Dashboard Refactor

*   **Problem:** `DashboardHospitalPage.tsx` contained complex logic for WebSockets, multiple modal management (Create, Edit, Delete Campaigns), calendar filtering, and statistics loading—all in one file.
*   **Solution:**
    *   Created `src/hooks/useHospitalDashboard.ts`.
    *   This hook encapsulates all complexity, exposing clear functions like `refreshCampaigns`, `handleDeleteConfirm`, and clean state.
    *   The page now reads almost like a table of contents for the visuals.

### 3.5. Profile Editing Refactor (`EditProfileModal`)

*   **Problem:** An extremely complex modal handling image uploads, password changes, data editing for two different user types, and account deletion.
*   **Solution:**
    *   Created `useEditProfile.ts` as the main orchestrator.
    *   This hook internally uses other smaller hooks (`useImageUpload`, `usePasswordChange`) and the centralized validations.
    *   `EditProfileModal.tsx` was significantly reduced, only handling the conditional rendering of fields based on user type.

## 4. Guide for Future Contributors

### Adding a New Form
1.  Create the visual component (UI) in `src/components/features/[feature_name]`.
2.  Import necessary validations from `src/utils/validation.ts`.
3.  Create a custom hook in `src/hooks` (e.g., `useMyTableForm.ts`) to handle state and submission.
4.  Connect them.

### Modifying Validation Rules
1.  Edit `src/utils/validation.ts`.
2.  Changes will automatically reflect across all application forms.

## 5. Key Directory Structure (Post-Refactor)

```
src/
├── components/
│   ├── common/             # Generic UI & inputs (Buttons, Modals)
│   ├── features/           # Business Logic (Auth, Dashboards)
│   └── layout/             # Header, Footer
├── hooks/                  # Encapsulated business logic
│   ├── useBloodDonorRegister.ts
│   ├── useHospitalRegister.ts
│   ├── useHospitalDashboard.ts
│   └── ...
├── services/               # API communication logic (axiosInstance)
├── utils/
│   ├── axiosInstance.ts    # Base Axios configuration
│   └── validation.ts       # Centralized validation rules
└── pages/                  # Main pages (consuming the hooks)
```
