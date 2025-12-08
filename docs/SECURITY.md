# Blood4Life Security Documentation

This document details the security measures and configurations implemented in the Blood4Life application.

## Authentication Strategy

The application uses **JWT (JSON Web Tokens)** for stateless authentication of API requests.

- **Token Storage**: HttpOnly Cookies (`jwt`). This prevents XSS attacks from accessing the token via JavaScript.
- **Token Expiry**: 24 hours (`maxAge(24 * 60 * 60)`).
- **SameSite Policy**: `Lax`.

### Login Flow
1.  Client sends `POST` request to `/api/auth/{type}/login` with Basic Auth headers.
2.  Server verifies credentials (email/password).
3.  Server generates a JWT.
4.  Server responds with `Set-Cookie` header containing the JWT.

### Request Flow
1.  Client makes a request to a protected endpoint (e.g., `/api/user/profile`).
2.  Browser automatically includes the `jwt` cookie.
3.  `JwtAuthFilter` intercepts the request.
4.  Filter validates the JWT signature and expiration.
5.  If valid, the user authentication is set in the Spring Security context.

## Password Security

- **Algorithm**: BCrypt.
- **Implementation**: `BCryptPasswordEncoder` bean in `SecurityConfig`.
- Passwords are never stored in plain text.

## Access Control (Authorization)

Configured in `SecurityConfig.java`:

### Public Endpoints (`permitAll`)
- `/api/auth/**` (Registration and Login)
- `/api/dashboard/**`
- `/api/hospital/**` (Note: This currently permits all actions on hospital endpoints, review if this is intended)
- `/login`, `/images/**` (Web resources)

### Protected Endpoints
- All other `/api/**` endpoints require authentication (`authenticated()`).

## CORS (Cross-Origin Resource Sharing)

- **Allowed Origins**: `http://localhost:5173` (Frontend dev server).
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS.
- **Allow Credentials**: `true` (Required for cookies).

## CSRF (Cross-Site Request Forgery)

- **Status**: Disabled (`csrf.disable()`).
- **Reasoning**: The API is stateless and uses JWTs. While cookies are used, the SameSite attribute provides some protection, but standard CSRF tokens are not currently implemented for the API.

## Recommendations

1.  **Review Hospital Endpoints**: The rule `/api/hospital/**` is set to `permitAll()`. Ensure that sensitive hospital operations (like updating profile or managing appointments) are properly secured.
2.  **HTTPS**: Ensure `secure(true)` is set for cookies in production (currently `secure(false)` for development).
