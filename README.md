# Storefront API

A RESTful JSON API for an online storefront, built with Node.js, Express, TypeScript, and PostgreSQL.

---

## Environment Variables

Create a `.env` file in the project root with the following values (see `.env.example`):

```
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_DB=storefront_dev
POSTGRES_TEST_DB=storefront_test
POSTGRES_USER=storefront_user
POSTGRES_PASSWORD=yourpassword123
ENV=dev
BCRYPT_PASSWORD=your-secret-bcrypt-pepper
SALT_ROUNDS=10
TOKEN_SECRET=your-jwt-secret-key
```

> **Note for reviewers:** Add your credentials in `.env`. The file is excluded from git via `.gitignore`.

---

## Ports

| Service    | Port  |
|------------|-------|
| Express API | 3000 |
| PostgreSQL  | 5432 |

---

## Database Setup

### 1. Install PostgreSQL

Ensure PostgreSQL is installed and running locally, or use the provided `docker-compose.yml`.

### 2. Create Databases and User

Connect to PostgreSQL as a superuser and run:

```sql
CREATE USER storefront_user WITH PASSWORD 'yourpassword123';
CREATE DATABASE storefront_dev;
CREATE DATABASE storefront_test;
GRANT ALL PRIVILEGES ON DATABASE storefront_dev TO storefront_user;
GRANT ALL PRIVILEGES ON DATABASE storefront_test TO storefront_user;
```

### 3. Run Migrations

```bash
db-migrate up
```

To rollback:

```bash
db-migrate down
```

To reset all:

```bash
db-migrate reset
```

---

## Package Installation

```bash
yarn
```

---

## Running the Server

### Development (with file watcher):

```bash
yarn watch
```

### Production:

```bash
yarn build
yarn start
```

---

## Running Tests

Tests run against the **test database** (`storefront_test`). Set `ENV=test` in your `.env` before testing, or:

```bash
ENV=test yarn test
```

This compiles TypeScript to `dist/` and runs all Jasmine specs.

---

## Project Structure

```
storefront/
├── migrations/
│   ├── sqls/                     # SQL up/down migration files
│   └── *.js                      # db-migrate JS files
├── spec/
│   └── support/jasmine.json
├── src/
│   ├── handlers/                 # Express route handlers
│   │   ├── users.ts
│   │   ├── products.ts
│   │   └── orders.ts
│   ├── middleware/
│   │   └── auth.ts               # JWT verification middleware
│   ├── models/                   # Database model classes
│   │   ├── user.ts
│   │   ├── product.ts
│   │   └── order.ts
│   ├── tests/
│   │   ├── models/               # Unit tests for models
│   │   └── endpoints/            # Integration tests for endpoints
│   ├── database.ts               # PostgreSQL connection pool
│   └── server.ts                 # Express app entry point
├── .env.example
├── .gitignore
├── database.json                 # db-migrate config
├── package.json
├── REQUIREMENTS.md
└── tsconfig.json
```

---

## Authentication

Protected routes require a JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are returned when you `POST /users` (register) or `POST /users/authenticate` (login).
