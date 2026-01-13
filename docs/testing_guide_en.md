# 🧪 Testing Guide - Blood4Life Frontend

## 📊 Current Test Suite Status

### Executive Summary
- **Total Tests**: 50 tests passing ✅ | 1 test skipped ⊘
- **Test Files**: 10 files
- **Execution Time**: ~4 seconds
- **Last Updated**: January 12th, 2026

### Code Coverage

| Metric | Coverage | Details |
|--------|----------|---------|
| **Statements** | **54.2%** | 387/714 statements |
| **Branches** | **31.48%** | 165/524 branches |
| **Functions** | **46.15%** | 66/143 functions |
| **Lines** | **57.12%** | 365/639 lines |

---

## 📁 Test Structure

### 1. Unit Tests (Business Logic)
Verify pure validation functions in isolation.

#### **Validations** (`src/utils/__tests__/validation.test.ts`)
- ✅ `validateEmail`: Email format, valid domains
- ✅ `validateDNI`: Spanish format (8 numbers + letter)
- ✅ `validatePassword`: Security (uppercase, lowercase, numbers)
- ✅ `validatePostalCode`: Valid Spanish postal codes

**Coverage**: 100% on validation utilities ⭐

---

### 2. Component Tests (UI & Interaction)

#### **Simple Components**

**ThemeToggle** (`src/components/UI/ThemeToggle/ThemeToggle.test.tsx`)
- ✅ Correct rendering based on current mode
- ✅ Accessibility (aria-labels)
- ✅ Click interaction
- **Coverage**: 81.81% statements

**Button** (`src/components/UI/Button/Button.test.tsx`)
- ✅ Rendering with different variants
- ✅ Navigation props (to, href)
- **Coverage**: 75% statements

**FormField** (`src/components/Forms/FormField/FormField.test.tsx`)
- ✅ Labels and placeholders rendering
- ✅ Error messages
- ✅ Validation states
- **Coverage**: 100% statements ⭐

#### **Authentication Components**

**LoginForm** (`src/components/Forms/LoginForm/LoginForm.test.tsx`)
- ✅ Form validation
- ✅ Service call with credentials
- ✅ Login error handling
- **Coverage**: 76.31% statements

**Header** (`src/tests/Header.test.tsx`)
- ✅ Rendering based on current route
- ✅ Login/register buttons on public pages
- ✅ User avatar when authenticated
- **Coverage**: 44.82% statements

#### **Async Components**

**CampaignList** (`src/components/features/donor/CampaignList/CampaignList.test.tsx`)
- ✅ Loading state
- ✅ Fetched data rendering
- ✅ Network error handling
- **Coverage**: 100% statements ⭐

**UpcomingAppointments** (`src/components/DonorDashboard/UpcomingAppointments.test.tsx`)
- ✅ Rendering with appointments
- ✅ Empty state (no appointments)
- **Coverage**: 100% statements ⭐

---

### 3. Context Tests (Global State)

**AuthContext** (`src/context/AuthContext.test.tsx`)
- ✅ Initialization without user
- ✅ User loading from localStorage
- ✅ Endpoint verification per userType
- ✅ Auth cleanup with invalid token
- ✅ Error when used outside Provider
- **Tests**: 5

**ThemeContext** (`src/context/ThemeContext.test.tsx`)
- ✅ Light theme by default
- ✅ Toggle between light/dark
- ✅ localStorage persistence
- ✅ Loading from localStorage
- ✅ Error when used outside Provider
- **Tests**: 5

**Context Coverage**: 26.04% → **Improved with new tests** 🎯

---

### 4. Integration Tests (Complete Flows)

#### **Authentication Flow** (`src/tests/integration/auth.flow.test.tsx`)
- ✅ Login form rendering
- ✅ Form field interaction
- ✅ Required field validation
- **Purpose**: Verify basic login flow without external dependencies

#### **Administration Flow** (`src/tests/integration/campaign.flow.test.tsx`)
- ✅ Donor listing in Admin Dashboard
- ✅ Donor deletion
- ✅ Loading error handling
- **Purpose**: Verify CRUD management in admin panel
- **Important**: Validates service mocks usage

---

## 🎯 High Coverage Areas (>80%)

| Component | Coverage | Status |
|-----------|----------|--------|
| `src/config.ts` | 100% | ⭐ Excellent |
| `src/components/DonorDashboard` | 100% | ⭐ Excellent |
| `src/components/Forms/FormField` | 100% | ⭐ Excellent |
| `src/components/features/donor/CampaignList` | 100% | ⭐ Excellent |
| `src/hooks` | 87.5% | ✅ Very Good |
| `src/utils` | 84.84% | ✅ Very Good |
| `src/components/UI/ThemeToggle` | 81.81% | ✅ Good |

---

## ⚠️ Areas Requiring Improvement (<50%)

| Component | Coverage | Reason |
|-----------|----------|--------|
| `src/components/UI/Header` | 44.82% | Many uncovered edge cases |
| `src/context` (global) | 26.04% | Complex authentication flows |
| `src/components/Modals/EditProfileModal` | 24.59% | Complex untested component |
| `src/services` | 14.28% | Real APIs make testing difficult |

---

## 🚀 How to Run Tests

### Basic Commands

```bash
# Run all tests (interactive mode)
npm test

# Run all tests once (CI/CD)
npm test -- --run

# View UI interface
npm run test:ui

# Generate coverage report
npm run coverage
```

### Run Specific Tests

```bash
# Specific file
npm test src/utils/__tests__/validation.test.ts

# By pattern
npm test validation

# Integration tests only
npm test src/tests/integration
```

---

## 🔧 Testing Configuration

### Tools Used

- **Framework**: Vitest 4.0.15
- **Testing Library**: @testing-library/react 16.3.0
- **Environment**: JSDOM (browser simulation)
- **Mocks**: Centralized in `vitest.setup.ts`

### Global Mocks (`vitest.setup.ts`)

```typescript
// Window APIs
- window.matchMedia
- window.location (assign, replace, reload, href)

// Libraries
- react-i18next (useTranslation)
- useWebSocket (isConnected, subscribe)
```

---

## 📝 Implemented Best Practices

### ✅ Well-Structured Tests
- Use of `describe` to group related tests
- Descriptive names explaining expected behavior
- Setup/teardown with `beforeEach` and `afterEach`

### ✅ Accessibility Tests
- Search by roles (`getByRole`)
- `aria-label` and `aria-live` verification
- Keyboard navigation tests

### ✅ Effective Mocks
- Centralized mocks for consistency
- Use of `vi.spyOn` to verify calls
- Service mocks when needed

### ✅ Incremental Coverage
- Priority on critical components
- Regression tests for fixed bugs
- Documentation of known edge cases

---

## 🎯 Recommended Next Steps

### High Priority
1. **EditProfileModal**: Critical component without tests (24.59%)
2. **Services**: Create consistent mocks for APIs
3. **Header**: Cover navigation edge cases

### Medium Priority
4. **Context**: Improve complex flow coverage
5. **Integration Tests**: Add more E2E flows
6. **Error Boundaries**: Error handling tests

### Low Priority
7. **Snapshot Tests**: For stable components
8. **Performance Tests**: Large list rendering
9. **A11y Tests**: Complete accessibility audit

---

## 📚 References and Resources

- [Vitest Docs](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/react)
- [Kent C. Dodds - Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Last Updated**: January 12th, 2026  
**Maintainer**: Blood4Life Development Team
