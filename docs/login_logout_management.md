# Client-Side Login and Logout Management

## Introduction

Login and logout management in Blood4Life is designed to provide a smooth and secure user experience. The system handles authentication for two user types (Donors and Hospitals) with a unified yet distinct flow based on roles.

## Session Management Architecture

The process relies on **HttpOnly Cookies** containing JWTs. The frontend does not manually store tokens in LocalStorage; instead, it relies on the browser to handle cookie storage and transmission.

## Key System Components

### 1. AuthContext - Global State

`AuthContext` is the core of session management. It provides:
- **`userType`**: Tracks if the user is a `bloodDonor`, `hospital`, or `admin`.
- **`isAuthenticated`**: Boolean flag for auth status.
- **`checkAuth`**: Runs on app load to verify if a valid session cookie exists by calling the `/me` endpoint.

### 2. LoginForm

A unified generic login form that allows users to:
- Select their role (Blood Donor or Hospital).
- Enter credentials.
- See real-time validation feedback.

### 3. AuthService

Encapsulates API calls. It uses `axiosInstance` to ensure `withCredentials: true` is set, allowing cookies to be sent and received.

### 4. ProtectedRoute

A higher-order component that checks `isAuthenticated`. If false, it redirects users to `/login`.

## Complete Login Flow

1.  **User Access**: User visits `/login`.
2.  **Input**: User selects "Hospital", enters email/password.
3.  **Submission**:
    *   Frontend calls `authService.login()`.
    *   Credentials are sent via Basic Auth header.
4.  **Backend Verification**:
    *   Backend validates credentials.
    *   Generates JWT.
    *   Sets an **HttpOnly** cookie named `jwt`.
    *   Returns 200 OK.
5.  **State Update**:
    *   `AuthContext` updates `isAuthenticated = true`.
    *   User is redirected to `/dashboard`.

## Complete Logout Flow

1.  **User Action**: User clicks "Logout".
2.  **Frontend Action**: `AuthContext.logout()` is called.
3.  **State Clearing**:
    *   `isAuthenticated` set to `false`.
    *   `userType` set to `null`.
4.  **Hard Redirect**:
    *   `window.location.href = '/login'` is used instead of `navigate`.
    *   This forces a full page reload, ensuring all in-memory state is cleared.

## Security Features

*   **HttpOnly Cookies**: Prevents client-side scripts from accessing the token, mitigating XSS.
*   **CSRF Protection**: Cookies are set with `SameSite=Lax`.
*   **Stateless**: No server-side session storage; validation happens via JWT signature.

## Navigation & Redirection

*   **`/`**: Public Landing Page.
*   **`/dashboard`**: Smart unified route. It checks `userType` and renders either `DashboardBloodDonorPage` or `DashboardHospitalPage`.
*   **Protected Routes**: Wraps generic CRUD pages ensuring only authenticated users can access them.
