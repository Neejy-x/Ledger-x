# LedgerX - Financial Transaction Management System

[![Node.js](https://img.shields.io/badge/Node.js-18.x+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2.1-blue.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-6.x+-red.svg)](https://redis.io/)
[![Sequelize](https://img.shields.io/badge/Sequelize-6.37.7-orange.svg)](https://sequelize.org/)

**LedgerX** is a robust, production-ready financial transaction management system built with Node.js and Express. It provides secure account management, transaction processing with double-entry ledger accounting, multi-currency support, and comprehensive audit logging capabilities.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Security Features](#security-features)
- [Project Structure](#project-structure)
- [Error Handling](#error-handling)
- [Logging](#logging)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Functionality
- **User Authentication & Authorization**
  - Secure JWT-based authentication with access and refresh tokens
  - Token rotation for enhanced security
  - Role-based access control (User/Admin)
  - Account suspension after failed authentication attempts

- **Account Management**
  - Multi-currency account support (USD, NGN, GBP)
  - Account creation and management
  - Account status management (active/frozen)
  - Cached balance queries for performance

- **Transaction Processing**
  - Secure money transfers between accounts
  - Idempotency key support to prevent duplicate transactions
  - Double-entry ledger accounting system
  - Real-time balance updates
  - Transaction status tracking (pending, committed, reversed)
  - Transaction PIN verification

- **Admin Dashboard**
  - User management (view, update roles, suspend accounts)
  - Account management across the platform
  - Comprehensive audit log viewing
  - Transaction oversight

- **Security & Compliance**
  - Comprehensive audit logging
  - Bcrypt password/pin hashing (12 rounds)
  - Transaction PIN with attempt limiting
  - Request validation using Zod schemas
  - Redis-based idempotency management
  - Redis-based rate limiting (general + strict auth limits)

## 🛠 Tech Stack

- **Runtime:** Node.js 18.x+
- **Framework:** Express.js 5.2.1
- **Database:** PostgreSQL 14+
- **ORM:** Sequelize 6.37.7
- **Cache/Session Store/Rate Limiting:** Redis 6.x+ (caching, idempotency, rate limiting)
- **Authentication:** JSON Web Tokens (JWT)
- **Validation:** Zod 4.3.5
- **Logging:** Winston 3.19.0
- **Password Hashing:** Bcrypt 6.0.0

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **npm** (v9.x or higher) or **yarn**
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Redis** (v6.x or higher) - [Download](https://redis.io/download/)
- **Git** - [Download](https://git-scm.com/downloads)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ledgerx
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration (see [Configuration](#configuration) section).

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=2102
NODE_ENV=development

# Database Configuration
DB_USERNAME=your_postgres_username
DB_PASSWORD=your_postgres_password
DB=ledgerx_db
DB_HOST=localhost
DB_PORT=5432

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=12575
REDIS_PASSWORD=your_redis_password

# JWT Configuration
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_min_32_chars
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_min_32_chars

# Token Expiration (Optional - defaults provided)
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

### Security Best Practices

- **Never commit `.env` files to version control**
- Use strong, randomly generated secrets for JWT tokens (minimum 32 characters)
- Use different secrets for access and refresh tokens
- In production, use environment-specific Redis credentials
- Rotate secrets regularly

## 🗄 Database Setup

### 1. Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ledgerx_db;

# Exit psql
\q
```

### 2. Run Migrations

```bash
# Install Sequelize CLI globally (if not already installed)
npm install -g sequelize-cli

# Run migrations
npx sequelize-cli db:migrate
```

### 3. Verify Database Setup

The migrations will create the following tables:
- `Users` - User accounts and authentication
- `Accounts` - Financial accounts
- `Transactions` - Transaction records
- `Ledger_entries` - Double-entry ledger records
- `Audit_logs` - Audit trail
- `Refresh_tokens` - Refresh token storage

### 4. (Optional) Seed Initial Data

If you have seeders configured:

```bash
npx sequelize-cli db:seed:all
```

## ▶️ Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:2102` (or your configured PORT).

### Production Mode

```bash
# Build the application (if needed)
npm run build

# Start the server
node src/app.js
```

### Using Process Managers

For production environments, consider using PM2:

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start src/app.js --name ledgerx

# Monitor
pm2 monit

# View logs
pm2 logs ledgerx
```

## 📚 API Documentation

### Base URL

```
http://localhost:2102
```

### Authentication

Most endpoints require authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### API Endpoints

#### Authentication Endpoints

##### 1. User Registration

**POST** `/api/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "securepassword123",
  "pin": "1234"
}
```

**Response (200 OK):**
```json
{
  "status": "Successful",
  "user": {
    "id": "uuid",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "status": "active"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation Rules:**
- `first_name`: Required, non-empty string
- `last_name`: Required, non-empty string
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters
- `pin`: Required, exactly 4 digits

##### 2. User Login

**POST** `/api/auth/login`

Authenticate and receive access tokens.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "status": "Successful",
  "user": {
    "id": "uuid",
    "full_name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

##### 3. Refresh Access Token

**POST** `/api/auth/refresh`

Get a new access token using a valid refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "status": "Successful",
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

##### 4. User Logout

**POST** `/api/auth/logout`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "status": "Successful",
  "message": "Logged out successfully"
}
```

---

#### Account Management Endpoints

##### 5. Create Account

**POST** `/api/accounts`

Create a new account for the authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "currency": "usd"
}
```

**Valid Currencies:** `usd`, `ngn`, `gbp`

**Response (200 OK):**
```json
{
  "status": "Successful",
  "details": {
    "name": "John Doe",
    "account": "uuid",
    "balance": "0.00",
    "currency": "usd"
  }
}
```

##### 6. Get All Accounts

**GET** `/api/accounts`

Retrieve all accounts for the authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "status": "Successful",
  "user": {
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  "accounts": [
    {
      "id": "uuid",
      "balance": "1000.00",
      "currency": "usd",
      "status": "active"
    }
  ]
}
```

##### 7. Get Account by ID

**GET** `/api/accounts/:accountId`

Retrieve a specific account by ID.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "status": "Successful",
  "Owner": {
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  "account": {
    "id": "uuid",
    "balance": "1000.00",
    "currency": "usd",
    "status": "active"
  }
}
```

##### 8. Get Account Balance (Cached)

**GET** `/api/accounts/:accountId/balance`

Get the current balance of an account (cached for performance).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "status": "Successful",
  "balance": {
    "accountId": "uuid",
    "balance": "1000.00",
    "currency": "usd"
  }
}
```

##### 9. Close Account

**PATCH** `/api/accounts/:accountId/close`

Close/freeze an account.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "status": "Successful",
  "user": {
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  "closed_account": {
    "accountId": "uuid",
    "status": "frozen"
  }
}
```

---

#### Transaction Endpoints

##### 10. Execute Transaction

**POST** `/transactions`

Transfer money between accounts.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "sourceAccountId": "uuid",
  "destinationAccountId": "uuid",
  "amount": "100.50",
  "idempotencyKey": "uuid",
  "transactionPin": "1234"
}
```

**Response (200 OK):**
```json
{
  "status": "Successful",
  "response": {
    "result": {
      "transactionId": "uuid",
      "status": "committed"
    },
    "amount": "100.50",
    "from": "John Doe",
    "to": "Jane Smith"
  }
}
```

**Important Notes:**
- `idempotencyKey` must be unique per transaction (use UUID)
- `amount` must be a positive decimal number (max 2 decimal places)
- `transactionPin` must be exactly 4 digits
- Transactions are idempotent - same `idempotencyKey` returns same result
- Account balance must be sufficient
- Both accounts must be active
- Both accounts must have the same currency

##### 11. Get Transaction History

**GET** `/transactions?page=1&limit=10`

Retrieve transaction history for the authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200 OK):**
```json
{
  "status": "Successful",
  "transactions": [
    {
      "id": "uuid",
      "amount": "100.50",
      "status": "committed",
      "date": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "totalPages": 5,
    "totalTransactions": 47,
    "page": 1,
    "limit": 10
  }
}
```

##### 12. Get Transaction by ID

**GET** `/transactions/:transactionId`

Retrieve a specific transaction by ID.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "status": "Successful",
  "transaction": {
    "id": "uuid",
    "amount": "100.50",
    "sender": "uuid",
    "receiver": "uuid"
  }
}
```

---

#### Admin Endpoints

All admin endpoints require admin role.

##### 13. Get All Users

**GET** `/admin/users?page=1&limit=20`

Retrieve all users in the system (admin only).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response (200 OK):**
```json
{
  "status": "Successful",
  "users": [
    {
      "id": "uuid",
      "full_name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "status": "active"
    }
  ],
  "meta": {
    "totalPages": 3,
    "totalUsers": 45,
    "page": 1,
    "limit": 20
  }
}
```

##### 14. Get User by ID

**GET** `/admin/users/:userId`

Retrieve a specific user by ID (admin only).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

##### 15. Update User Role

**PATCH** `/admin/users/:userId/role`

Update a user's role (admin only).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Request Body:**
```json
{
  "role": "admin"
}
```

**Valid Roles:** `user`, `admin`

##### 16. Update User Status

**PATCH** `/admin/users/:userId/status`

Update a user's status (admin only).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Request Body:**
```json
{
  "status": "suspended"
}
```

**Valid Statuses:** `active`, `suspended`

##### 17. Get All Accounts (Admin)

**GET** `/admin/accounts?page=1&limit=10`

Retrieve all accounts in the system (admin only).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

##### 18. Update Account Status (Admin)

**PATCH** `/admin/accounts/:accountId/status`

Update an account's status (admin only).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Request Body:**
```json
{
  "status": "frozen"
}
```

**Valid Statuses:** `active`, `frozen`

##### 19. Get Audit Logs

**GET** `/admin/audit-logs?page=1&limit=10`

Retrieve audit logs for compliance and monitoring (admin only).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response (200 OK):**
```json
{
  "status": "Successful",
  "logs": [
    {
      "id": "uuid",
      "actorId": "uuid",
      "action": "TRANSACTION_CREATED",
      "metadata": {
        "transactionId": "uuid",
        "status": "pending",
        "amount": "100.50"
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "metadata": {
    "totalLogs": 1250,
    "totalPages": 125,
    "page": 1,
    "limit": 10
  }
}
```

---

#### Health Check

##### 20. Health Check

**GET** `/admin/health`

Check API health status.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🏗 Architecture

### System Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ HTTP/HTTPS
       │
┌──────▼─────────────────────────────────────┐
│         Express.js Application            │
│  ┌─────────────────────────────────────┐  │
│  │      Route Handlers                 │  │
│  │  ┌───────────────────────────────┐  │  │
│  │  │   Controllers                 │  │  │
│  │  │  ┌─────────────────────────┐  │  │  │
│  │  │  │   Services              │  │  │  │
│  │  │  └─────────────────────────┘  │  │  │
│  │  └───────────────────────────────┘  │  │
│  └─────────────────────────────────────┘  │
└──────┬─────────────────────────────────────┘
       │
       ├─────────────────┬──────────────────┐
       │                 │                  │
┌──────▼──────┐  ┌──────▼──────┐  ┌───────▼───────┐
│ PostgreSQL  │  │    Redis    │  │    Winston    │
│  Database   │  │    Cache    │  │    Logging    │
└─────────────┘  └─────────────┘  └───────────────┘
```

### Database Schema

- **Users**: User accounts, authentication credentials, roles
- **Accounts**: Financial accounts linked to users with currency support
- **Transactions**: Transaction records with idempotency keys
- **Ledger_entries**: Double-entry accounting ledger records
- **Audit_logs**: Comprehensive audit trail
- **Refresh_tokens**: Refresh token storage for session management

### Data Flow

1. **Authentication Flow:**
   - Rate limit checked (Redis) → User provides credentials → JWT tokens generated → Tokens stored in cookies/headers

2. **Transaction Flow:**
   - Rate limit checked (Redis) → Request validated → Idempotency checked (Redis) → Transaction PIN verified
   - Database transaction started → Accounts locked → Balances updated
   - Ledger entries created → Transaction committed → Cache invalidated

3. **Account Balance Retrieval:**
   - Rate limit checked (Redis) → Check Redis cache → If miss, query database → Cache result → Return

## 🔒 Security Features

### Authentication & Authorization
- **JWT-based authentication** with access and refresh token pattern
- **Token rotation** on refresh for enhanced security
- **Role-based access control** (RBAC) for admin operations
- **Account suspension** after multiple failed authentication attempts

### Password Security
- **Bcrypt hashing** with 12 salt rounds
- **Password length validation** (minimum 8 characters for password)
- **Transaction PIN** separate from login password (4 digits)
- **PIN attempt limiting** (3 attempts before account suspension)

### Transaction Security
- **Idempotency keys** prevent duplicate transactions
- **Transaction PIN verification** required for all transfers
- **Database-level locking** prevents race conditions
- **Atomic transactions** ensure data consistency
- **Currency validation** prevents cross-currency transfers

### Data Protection
- **Input validation** using Zod schemas
- **SQL injection prevention** via Sequelize ORM
- **Audit logging** for compliance and debugging
- **Sensitive data exclusion** in default model scopes

### Rate Limiting & DDoS Protection
- **Redis-based rate limiting** for all endpoints (100 requests per 15 minutes)
- **Strict authentication rate limiting** (5 attempts per 15 minutes for login/signup)
- **Distributed rate limiting** using Redis store for multi-instance deployments
- **Standard rate limit headers** (RFC draft-7 compliant)

### Best Practices
- Environment variables for sensitive configuration
- Error messages don't leak sensitive information
- Comprehensive logging without exposing credentials
- HTTPS recommended for production

## 📁 Project Structure

```
ledgerx/
├── src/
│   ├── app.js                      # Application entry point
│   ├── config/
│   │   ├── redisClient.config.js   # Redis client configuration
│   │   └── sequelize.db.js         # Sequelize database connection
│   ├── controllers/                # Request handlers
│   │   ├── account.controller.js
│   │   ├── admin.controller.js
│   │   ├── auth.controller.js
│   │   ├── balance.controller.js
│   │   ├── health.controllers.js
│   │   └── transaction.controller.js
│   ├── database/
│   │   ├── config.js               # Database configuration
│   │   ├── migrations/             # Database migrations
│   │   └── models/                 # Sequelize models
│   │       ├── account.js
│   │       ├── audit_log.js
│   │       ├── index.js
│   │       ├── ledger_entry.js
│   │       ├── refresh_token.js
│   │       ├── transaction.js
│   │       └── user.js
│   ├── middlewares/                # Express middlewares
│   │   ├── auth.middleware.js      # JWT authentication
│   │   ├── error.middleware.js     # Error handling & logging
│   │   ├── notFound.middleware.js  # 404 handler
│   │   └── validator.middleware.js # Request validation
│   ├── routes/                     # API routes
│   │   ├── account.routes.js
│   │   ├── admin.routes.js
│   │   ├── auth.routes.js
│   │   ├── health.routes.js
│   │   └── transaction.routes.js
│   ├── service/                    # Business logic layer
│   │   ├── account.service.js
│   │   ├── admin.service.js
│   │   ├── auth.service.js
│   │   ├── balance.service.js
│   │   └── transactions.service.js
│   ├── validators/                 # Zod validation schemas
│   │   ├── account.validator.js
│   │   ├── admin.validator.js
│   │   ├── auth.validator.js
│   │   └── transaction.validator.js
│   └── logs/                       # Application logs
│       ├── app.log
│       ├── exceptions.log
│       └── rejections.log
├── .env                            # Environment variables (not in repo)
├── .gitignore
├── .sequelizerc                    # Sequelize configuration
├── package.json
└── README.md
```

## ⚠️ Error Handling

The application uses a centralized error handling middleware that:

- Catches and formats all errors consistently
- Logs errors using Winston logger
- Returns appropriate HTTP status codes
- Provides user-friendly error messages
- Handles validation errors from Zod
- Separates client errors (4xx) from server errors (5xx)

### Common Error Responses

**400 Bad Request:**
```json
{
  "status": "error",
  "message": "Validation error",
  "errors": {
    "email": {
      "message": "Invalid email address"
    }
  }
}
```

**401 Unauthorized:**
```json
{
  "status": "error",
  "message": "Unauthorized: no token provided"
}
```

**403 Forbidden:**
```json
{
  "status": "error",
  "message": "Forbidden: Invalid or Expired token"
}
```

**404 Not Found:**
```json
{
  "status": "error",
  "message": "Route not found"
}
```

**500 Internal Server Error:**
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

## 📝 Logging

The application uses Winston for comprehensive logging:

- **File Logging**: All logs written to `src/logs/app.log`
- **Console Logging**: Formatted output for development
- **Exception Handling**: Uncaught exceptions logged to `src/logs/exceptions.log`
- **Rejection Handling**: Unhandled promise rejections logged to `src/logs/rejections.log`

Log levels include:
- `error`: Error events that might still allow the app to continue
- `warn`: Warning messages
- `info`: Informational messages (default level)
- `debug`: Debug messages (development only)

## 🧪 Testing

*Note: Test suite implementation recommended for production use.*

Recommended test coverage:
- Unit tests for services and utilities
- Integration tests for API endpoints
- Database transaction tests
- Security and authentication tests
- Idempotency tests

## 🚢 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong, randomly generated JWT secrets
- [ ] Configure production PostgreSQL database
- [ ] Set up Redis cluster for high availability
- [ ] Configure HTTPS/TLS certificates
- [ ] Set up process manager (PM2, systemd, etc.)
- [ ] Configure reverse proxy (Nginx, Apache)
- [ ] Set up monitoring and alerting
- [ ] Configure log rotation
- [ ] Set up database backups
- [x] Rate limiting enabled (Redis-based, configurable limits)
- [ ] Configure CORS appropriately
- [ ] Review and update security headers

### Docker Deployment (Optional)

Example Dockerfile structure:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 2102
CMD ["node", "src/app.js"]
```

### Environment-Specific Configuration

Ensure environment variables are properly configured for:
- Development
- Staging
- Production

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow existing code patterns
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure all validations are in place
- Write tests for new features

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Your Name**

- GitHub: [@neejy-x](https://github.com/neejy-x)
- Email: dearneejy@gmail.com

## 🙏 Acknowledgments

- Express.js community
- Sequelize ORM documentation
- Redis documentation
- All contributors and maintainers

## 📞 Support

For support, email dearneejy@gmail.com or create an issue in the repository.

---

**Built with ❤️ for secure and reliable financial transaction management**
