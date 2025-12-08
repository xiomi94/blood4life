# Blood4Life Architecture

This document describes the high-level architecture of the Blood4Life application.

## Overview

Blood4Life is a web application designed to manage blood donations, connecting donors with hospitals. It is built using a monolithic backend with a decoupled frontend.

## Tech Stack

### Backend
- **Language**: Java
- **Framework**: Spring Boot
- **Build Tool**: Maven
- **Database**: MySQL
- **ORM**: Hibernate / Spring Data JPA
- **Migration**: Flyway
- **Security**: Spring Security (JWT based)

### Frontend
- **Framework**: React
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **HTTP Client**: Axios
- **State Management**: React Context / Hooks
- **Charts**: Chart.js / react-chartjs-2

## Project Structure

```
blood4life/
├── backend/                # Spring Boot Application
│   ├── src/main/java/      # Java Source Code
│   │   └── com/xiojuandawt/blood4life/
│   │       ├── config/     # Configuration (Security, CORS, etc.)
│   │       ├── controllers/# REST Controllers
│   │       ├── dto/        # Data Transfer Objects
│   │       ├── entities/   # JPA Entities
│   │       ├── repositories/# Data Access Layer
│   │       └── services/   # Business Logic
│   └── src/main/resources/ # Resources
│       ├── application.properties # App Config
│       └── db/migration/   # Flyway SQL Scripts
│
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── pages/          # Page Components
│   │   ├── services/       # API Service Calls
│   │   └── context/        # React Context (Auth, etc.)
│   └── package.json        # Dependencies
│
└── docs/                   # Documentation
```

## Key Components

### Authentication Flow
1.  User (Donor/Hospital) submits credentials via Frontend.
2.  Backend validates credentials.
3.  On success, Backend issues a JWT signed with a secret key.
4.  JWT is sent back in an `HttpOnly` cookie.
5.  Subsequent requests include the cookie, which is validated by the `JwtAuthFilter`.

### Database Design
The application uses a relational database (MySQL) to store data about Donors, Hospitals, Appointments, Campaigns, etc. Entities are mapped using JPA annotations.
