# Validation and User Feedback Strategy

## Introduction

In Blood4Life, data validation and clear feedback are fundamental for:
- **Data Integrity**: Ensuring database data is consistent.
- **User Experience**: Providing immediate, descriptive guidance.
- **Error Reduction**: Preventing invalid submissions.

We implement a **Defense in Depth** strategy with validations on both the frontend (React/TypeScript) and backend (Spring Boot/Java).

## Architecture

1.  **Real-time Frontend Validation**: As the user types.
2.  **Submission Frontend Validation**: Before the request is sent.
3.  **Backend Validation**: Final authoritative check.

## Frontend Validations

### 1. Real-time Validation (`onChange`)

We use a reactive approach where every keystroke triggers validation for that specific field.

*   **Implementation**: `handleInputChange` updates state and immediately calls `validateField`.
*   **Visual Feedback**: Errors are stored in an `errors` state object. If an error exists for a field, the input turns red, and a message appears below it.

### 2. Centralized Logic (`src/utils/validation.ts`)

All validation rules are centralized. This ensures that a rule (like the format of a DNI) is consistent across the entire application (Registration, Profile Edit, etc.).

**Key Validations:**
*   **DNI**: Checks for 8 digits + 1 correct control letter.
*   **CIF**: Checks for 8-10 alphanumeric characters.
*   **Password**: Enforces complexity (uppercase, lowercase, number, length > 8).
*   **Dates**: Ensures birth dates are not in the future and calculates age (must be > 18 for donors).

### 3. Submission Validation (`onSubmit`)

Before calling the API, `validateForm` iterates over all fields. If any field is invalid:
*   Submission acts are blocked.
*   An alert or toast notification is shown.
*   The first invalid field is highlighted.

## Backend Validations

The backend serves as the final gatekeeper.

*   **`@Valid` Annotation**: Spring Boot automatically validates DTOs against constraints.
*   **Custom Logic**: Unique constraints (e.g., "Email already registered") are checked against the database.
*   **Error Responses**: The backend returns standardized HTTP error codes (400 for bad requests, 409 for conflicts) which the frontend catches and displays.

## User Feedback Mechanisms

### Visual Cues
*   **Red Borders**: Indicate invalid fields.
*   **Helper Text**: Explains requirements (e.g., "Password must be 8 chars").
*   **Loading States**: Buttons show "Processing..." and spinners during API calls to prevent double submission.

### Toast Notifications
We use toast messages (floating notifications) for success and error feedback at the global level (e.g., "Profile updated successfully" or "Network error").

## Best Practices

1.  **Never trust the client**: Always validate on the backend.
2.  **Be specific**: "Invalid input" is bad. "Password must contain a number" is good.
3.  **Fail fast**: feedback on the client saves server resources.
