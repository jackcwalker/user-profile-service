# 🧑‍💻 User Profile Service

A simple, observable, and production-grade user profile API built with AWS Lambda, DynamoDB, and the AWS CDK — built as part of a senior engineering coding challenge.

---

## 🚀 Features

- **CRUD-capable** (Create, Retrieve, Update — no Delete by design)
- **AWS CDK** for infrastructure as code
- **DynamoDB** as a flexible NoSQL store
- **AWS Powertools (TypeScript)** for structured logging and tracing
- **Vitest** for both unit and E2E testing
- **ESLint + Prettier** for code quality
- **UUIDs** used as profile IDs

---

## 📦 Setup

### Requirements

- Node.js 18+
- AWS CLI (configured)
- CDK v2
- Docker (for bundling)
- `npm install`

### Install Dependencies

```bash
npm install
```

---

## 🏗️ Deploy

Bootstrap (if not already):

```bash
cdk bootstrap
```

Deploy to AWS:

```bash
cdk deploy
```

---

## 🧪 Running Tests

### All Tests (Unit + E2E)

This command runs both unit and end-to-end tests:

> **Note:** E2E tests do **not** clean up after themselves and will leave test data in the DynamoDB table.

```bash
npm run test
```

Before running E2E tests, ensure:
* Your API is deployed
* The API_URL environment variable is set:

```bash
export API_URL=https://<your-api-url>
```

### Optional: Run Unit and E2E Tests Separately

To run the E2E tests:
```bash
npm run test:e2e
```

To run the unit tests:
```bash
npm run test:unit
```

---

## 📘 API Overview

| Method | Path             | Description             |
| ------ | ---------------- | ----------------------- |
| POST   | `/profiles`      | Create a new profile    |
| GET    | `/profiles/{id}` | Get a single profile    |
| GET    | `/profiles`      | Get all profiles        |
| PUT    | `/profiles/{id}` | Update existing profile |

### 🧠 Route Design Reasoning

- `POST /profiles` generates a UUID server-side for safety and simplicity
- `PUT` used over `PATCH` for clarity and idempotency
- No `DELETE` endpoint: assumed not required for this challenge

---

## 🗃️ DynamoDB Access Patterns

| Operation         | Pattern           | Notes                         |
| ----------------- | ----------------- | ----------------------------- |
| Get profile       | `GetItem` by `id` | Primary key = `id` (UUID)     |
| List all profiles | `Scan`            | Sufficient for small datasets |
| Update profile    | `UpdateItem`      | Partial updates supported     |
| Create profile    | `PutItem`         | UUID is generated on create   |

---

## 🧬 Profile Schema

Each user profile in DynamoDB follows this structure:

```json
{
  "id": "uuid",                  // Auto-generated unique identifier
  "firstName": "Jane",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01"    // ISO 8601 format
}
```

---

## ⚙️ Assumptions & Trade-offs

- **Scalability**: `Scan` is fine for demo scale, but should use GSI/query in real-world
- **Observability**: AWS Powertools provides tracing + structured logs for production-level visibility
- **Validation**: Simple in-handler validation used; for extensibility, consider `zod` or similar
- **Infrastructure**: CDK + Node.js bundling via esbuild; ready for CI/CD
- **Security**: No auth implemented — assumed out of scope
- **E2E Tests**: Do not remove test data from DynamoDB
- **Environment**: You must set the `API_URL` environment variable for E2E tests

### Trade-off: Using DynamoDB (NoSQL) for User Profiles

**✅ Pros:**
- ⚡ **Fast and Scalable**: Handles high traffic and large data sets with low-latency reads/writes.
- 🔧 **Low Maintenance**: No need to manage servers, backups, or indexes manually.
- 💰 **Cost-Effective**: Good for projects with variable or unpredictable load.

**❌ Cons:**
- 🔍 **Limited Queries**: Can't easily search by different fields unless extra indexes are added.
- 🔗 **No Joins**: Harder to link users with other data like roles or permissions.
- 🧱 **Simple Schema**: Good for flat data, but complex relationships require workarounds.

**🧠 Conclusion**
DynamoDB is a good fit here because the system is simple: create, read, and update users by ID.
If the app grows to require richer queries or complex relationships, a SQL database might be a better fit.

---

## 🧹 Code Quality

- ESLint config (v9+) with `@typescript-eslint` and `unused-imports`
- Prettier formatting

---

## 📂 Folder Structure

```

├── src/
│ └── handlers/
│    ├── createProfile/
│    ├── getProfile/
│    ├── getAllProfiles/
│    └── updateProfile/
├── tests/
│ ├── e2e/
│ ├── handlers/
│ ├── mocks/
├── lib/ # CDK stack
├── cdk.out/ # CDK build artifacts

```

---

## ✅ Done

- [x] Functional API
- [x] Observability with Powertools
- [x] Infrastructure-as-code via CDK
- [x] Unit + E2E tests
- [x] Linting + formatting
- [x] Clean repo and structure

---

> Built by Jack Walker
