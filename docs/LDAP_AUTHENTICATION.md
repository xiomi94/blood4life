# LDAP Authentication System

## Overview

Blood4Life implements an LDAP (Lightweight Directory Access Protocol) authentication system for administrative access. This system uses an embedded LDAP server for development and testing purposes, allowing secure authentication of admin users.

## Architecture

### Components

1. **Embedded LDAP Server**
   - Library: UnboundID LDAP SDK
   - Port: 8389
   - Base DN: `dc=blood4life,dc=com`

2. **Backend Integration**
   - Spring LDAP for authentication
   - JWT token generation after successful LDAP authentication
   - Dual verification: LDAP + local database

3. **Frontend**
   - Dedicated LDAP login page at `/ldaplogin`
   - React component with form validation
   - Automatic token storage and dashboard redirection

## Authentication Flow

```
┌─────────────┐
│   Browser   │
│  /ldaplogin │
└──────┬──────┘
       │ 1. POST credentials (Basic Auth)
       ↓
┌──────────────────────────────────┐
│   Backend API                    │
│   /api/auth/admin/ldap-login     │
└──────┬───────────────────────────┘
       │ 2. Authenticate against LDAP
       ↓
┌─────────────────┐
│  LDAP Server    │
│  localhost:8389 │
└──────┬──────────┘
       │ 3. Verify credentials
       │    uid=admin
       │    password=admin1234
       ↓
       ├─ ✅ Valid → Continue
       └─ ❌ Invalid → 401 Unauthorized
       │
       │ 4. Check local database
       ↓
┌─────────────────┐
│  MySQL Database │
│  admin table    │
└──────┬──────────┘
       │ 5. Verify email exists
       │    admin@admin.es
       ↓
       ├─ ✅ Found → Continue
       └─ ❌ Not found → 401 Unauthorized
       │
       │ 6. Generate JWT
       ↓
┌──────────────────┐
│   JWT Service    │
└──────┬───────────┘
       │ 7. Return token + cookie
       ↓
┌─────────────┐
│   Browser   │
│  localStorage│
└──────┬──────┘
       │ 8. Store token
       │ 9. Redirect to /dashboard
       ↓
┌─────────────┐
│  Dashboard  │
└─────────────┘
```

## Admin Credentials

### LDAP User
- **Username**: `admin@admin.es`
- **Password**: `admin1234`
- **LDAP DN**: `uid=admin,ou=empleados,dc=blood4life,dc=com`
- **LDAP UID**: `admin`
- **Mail attribute**: `admin@admin.es`

### Database User
The same admin user must exist in the local MySQL database with:
- **Email**: `admin@admin.es`
- **Role**: `admin`

## Configuration

### Backend Configuration (`application.properties`)

```properties
# LDAP Configuration
spring.ldap.urls=ldap://localhost:8389
spring.ldap.base=dc=blood4life,dc=com
spring.ldap.username=cn=admin,dc=blood4life,dc=com
spring.ldap.password=admin

# Embedded LDAP Server
spring.ldap.embedded.port=8389
spring.ldap.embedded.ldif=classpath:users.ldif
spring.ldap.embedded.base-dn=dc=blood4life,dc=com
spring.ldap.embedded.validation.enabled=false
```

### Maven Dependencies (`pom.xml`)

```xml
<!-- LDAP Support -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-ldap</artifactId>
</dependency>

<!-- Embedded LDAP Server -->
<dependency>
  <groupId>com.unboundid</groupId>
  <artifactId>unboundid-ldapsdk</artifactId>
  <version>7.0.1</version>
  <scope>runtime</scope>
</dependency>
```

## API Endpoint

### POST `/api/auth/admin/ldap-login`

**Request Headers:**
```
Authorization: Basic <base64(username:password)>
```

**Success Response (200 OK):**
```json
{
  "status": "OK",
  "message": "LDAP Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

- **401 Unauthorized** - Invalid LDAP credentials
```json
{
  "error": "Invalid credentials (LDAP)"
}
```

- **401 Unauthorized** - User not found in local database
```json
{
  "error": "User not found locally"
}
```

- **400 Bad Request** - Missing Authorization header
```json
{
  "error": "Required request header 'Authorization' is missing"
}
```

## Screenshots

### 1. LDAP Login Page
The dedicated LDAP login interface at `http://localhost:5173/ldaplogin`:

![LDAP Login Page](../screenshots/ldap_login_page.png)

*Features:*
- Clean, modern UI matching the application's design system
- Username field (accepts email format)
- Password field with show/hide toggle
- Login button
- Informational text: "Herramienta de gestión LDAP interna"

### 2. Login Form with Credentials
Form populated with admin credentials:

![LDAP Login Filled](../screenshots/ldap_login_filled.png)

*Credentials shown:*
- Username: `admin@admin.es`
- Password: `••••••••••` (masked)

### 3. Successful Authentication
After successful login, the user is redirected to the admin dashboard with a success toast notification.

## Usage Instructions

### For Administrators

1. **Access the LDAP Login Page**
   - Navigate to: `http://localhost:5173/ldaplogin`

2. **Enter Credentials**
   - Username: `admin@admin.es`
   - Password: `admin1234`

3. **Submit**
   - Click the "Ingresar" button
   - Wait for authentication

4. **Automatic Redirect**
   - Upon success, you'll be automatically redirected to `/dashboard`
   - A JWT token will be stored in your browser's localStorage
   - The token is also set as an HttpOnly cookie for additional security

### For Developers

#### Starting the LDAP Server

The embedded LDAP server starts automatically with the Spring Boot application:

```bash
cd backend
./mvnw spring-boot:run
```

You should see in the logs:
```
Embedded LDAP server started on port 8389
```

#### Testing LDAP Authentication

Using curl:

```bash
# Encode credentials
echo -n "admin@admin.es:admin1234" | base64
# Output: YWRtaW5AYWRtaW4uZXM6YWRtaW4xMjM0

# Make request
curl -X POST http://localhost:8080/api/auth/admin/ldap-login \
  -H "Authorization: Basic YWRtaW5AYWRtaW4uZXM6YWRtaW4xMjM0"
```

Expected response:
```json
{
  "status": "OK",
  "message": "LDAP Login successful",
  "token": "eyJhbG..."
}
```

## Security Considerations

### Production Deployment

⚠️ **Important**: The embedded LDAP server is intended for development only.

For production environments:

1. **Use an external LDAP/Active Directory server**
   - Update `spring.ldap.urls` to point to your production LDAP server
   - Remove the `spring.ldap.embedded.*` properties
   - Remove the `unboundid-ldapsdk` dependency

2. **Secure the connection**
   - Use LDAPS (LDAP over SSL/TLS)
   - Update URL to: `ldaps://your-ldap-server:636`

3. **Update credentials**
   - Change the default admin password
   - Store LDAP bind credentials securely (environment variables, secrets management)

4. **Enable HTTPS**
   - Set `secure=true` in the JWT cookie configuration
   - Deploy behind a reverse proxy with SSL certificates

### Password Security

- LDAP passwords are stored using standard LDAP password hashes
- The embedded server uses plaintext for development convenience
- Production LDAP servers should use strong hashing algorithms (SSHA, bcrypt)

## Troubleshooting

### Common Issues

#### 1. "Connection refused: localhost:8389"

**Cause**: LDAP server failed to start

**Solutions**:
- Check if port 8389 is already in use
- Verify `unboundid-ldapsdk` dependency is present
- Check application logs for LDAP startup errors
- Restart the backend application

#### 2. "Invalid credentials (LDAP)"

**Cause**: Wrong username or password

**Solutions**:
- Verify credentials match `users.ldif`
- Check if LDAP server loaded the LDIF file correctly
- Restart backend if LDIF was recently modified

#### 3. "User not found locally"

**Cause**: Admin user doesn't exist in MySQL database

**Solutions**:
- Run the admin user creation migration
- Verify email in database matches `admin@admin.es`
- Check database connection

#### 4. Token not being saved

**Cause**: Backend not returning token in response

**Solutions**:
- Verify `AuthController.loginAdminLdap` includes token in response JSON
- Check browser console for JavaScript errors
- Clear browser cache and cookies

## File Structure

```
backend/
├── src/main/
│   ├── java/.../
│   │   ├── controllers/
│   │   │   └── AuthController.java       # LDAP login endpoint
│   │   ├── services/
│   │   │   ├── LdapService.java          # LDAP authentication logic
│   │   │   └── JwtService.java           # JWT token generation
│   │   └── config/
│   │       └── SecurityConfig.java       # Security configuration
│   └── resources/
│       ├── application.properties         # LDAP configuration
│       └── users.ldif                     # LDAP user data
└── pom.xml                                # Dependencies

frontend/
└── src/
    ├── pages/
    │   └── LdapLoginPage/
    │       └── LdapLoginPage.tsx          # LDAP login UI
    └── App.tsx                             # Route configuration
```

## Technical Details

### LDAP Directory Structure

```
dc=blood4life,dc=com
├── ou=empleados
│   └── uid=admin
│       ├── cn: Admin User
│       ├── sn: Admin
│       ├── mail: admin@admin.es
│       └── userPassword: admin1234
└── ou=grupos
    └── cn=admins
        └── member: uid=admin,ou=empleados,dc=blood4life,dc=com
```

### Authentication Logic (`LdapService.java`)

```java
public boolean authenticate(String username, String password) {
    try {
        // Extract UID from email if it contains @
        String uid = username.contains("@") 
            ? username.split("@")[0] 
            : username;
        
        // Authenticate using 'uid' attribute
        EqualsFilter filter = new EqualsFilter("uid", uid);
        return ldapTemplate.authenticate("", filter.toString(), password);
    } catch (Exception e) {
        e.printStackTrace();
        return false;
    }
}
```

This implementation:
1. Accepts email format (`admin@admin.es`)
2. Extracts the UID portion (`admin`)
3. Searches LDAP by `uid` attribute
4. Validates the password
5. Returns `true` if authentication succeeds

## Maintenance

### Adding New Admin Users

To add additional LDAP users, edit `users.ldif`:

```ldif
# New admin user
dn: uid=newadmin,ou=empleados,dc=blood4life,dc=com
objectClass: top
objectClass: person
objectClass: organizationalPerson
objectClass: inetOrgPerson
cn: New Admin
sn: Admin
uid: newadmin
userPassword: securepassword123
mail: newadmin@admin.es
```

**Important**: 
1. Restart the backend after modifying `users.ldif`
2. Add the corresponding user to the MySQL `admin` table
3. Ensure the `mail` attribute matches the database email

### Monitoring

Check LDAP server status in application logs:

```
INFO - Embedded LDAP server started on port 8389
INFO - Loaded users.ldif successfully
```

## References

- [Spring LDAP Documentation](https://docs.spring.io/spring-ldap/docs/current/reference/)
- [UnboundID LDAP SDK](https://github.com/pingidentity/ldapsdk)
- [LDAP Overview](https://ldap.com/)
- [JWT.io](https://jwt.io/) - JWT token inspector

## Support

For issues related to LDAP authentication:
1. Check the troubleshooting section above
2. Review application logs for detailed error messages
3. Verify configuration in `application.properties`
4. Ensure both backend and frontend are running on correct ports
