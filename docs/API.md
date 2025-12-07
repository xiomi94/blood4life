# Blood4Life API Documentation

This document outlines the REST API endpoints for the Blood4Life application.

## Base URL
All API endpoints are prefixed with `/api`.

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Tokens are stored in HttpOnly cookies.

### Blood Donor Auth

#### Register Blood Donor
- **URL**: `/api/auth/bloodDonor/register`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `dni` (String)
  - `firstName` (String)
  - `lastName` (String)
  - `gender` (String)
  - `bloodTypeId` (Integer)
  - `email` (String)
  - `phoneNumber` (String, optional)
  - `dateOfBirth` (Date: yyyy-MM-dd, optional)
  - `password` (String)
  - `image` (File, optional)
- **Response**: `201 Created` with `BloodDonorDTO`

#### Login Blood Donor
- **URL**: `/api/auth/bloodDonor/login`
- **Method**: `POST`
- **Headers**: `Authorization: Basic <base64(email:password)>`
- **Response**: `200 OK` with Set-Cookie header (JWT)

### Hospital Auth

#### Register Hospital
- **URL**: `/api/auth/hospital/register`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `cif` (String)
  - `name` (String)
  - `address` (String)
  - `email` (String)
  - `phoneNumber` (String)
  - `password` (String)
  - `image` (File, optional)
- **Response**: `201 Created` with `HospitalDTO`

#### Login Hospital
- **URL**: `/api/auth/hospital/login`
- **Method**: `POST`
- **Headers**: `Authorization: Basic <base64(email:password)>`
- **Response**: `200 OK` with Set-Cookie header (JWT)

### Logout
- **URL**: `/api/auth/logout`
- **Method**: `GET`
- **Response**: Redirects to login page and clears JWT cookie.

## Other Endpoints

*(Note: Based on controller names, detailed method signatures would require further inspection of specific controller files)*

### Blood Donor Operations
- **Controller**: `BloodDonorController`
- **Base Path**: Likely `/api/bloodDonor` (Inferred)

### Hospital Operations
- **Controller**: `HospitalController`
- **Base Path**: Likely `/api/hospital` (Note: `SecurityConfig` permits all on `/api/hospital/**`)

### Dashboard
- **Controller**: `DashboardController`
- **Base Path**: `/api/dashboard` (Permit All)

### Dashboard Graphics
- **Controller**: `DashboardGraphicController`
- **Base Path**: Likely `/api/dashboard/graphics` or similar.
