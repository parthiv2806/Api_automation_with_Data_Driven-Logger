# API Automation with Data-Driven & Logger

Playwright-based **API automation testing framework** with **Data-Driven** approach, **JSON Schema validation (AJV)**, and **Winston logging**.

## Technologies Used

| Technology | Purpose | Where |
|-----------|---------|-------|
| **Playwright Test** | Test runner + API request client | `tests/`, `utils/apiclients.js` |
| **AJV** (Another JSON Schema Validator) | Response JSON structure/type validation | `utils/schemavalidator.js`, `schemas/` |
| **Winston** | Structured logging (console + file) | `utils/logger.js`, `logs/api.log` |
| **Node.js** | Runtime | `package.json` |
| **GitHub Actions** | CI pipeline | `.github/workflows/playwright.yml` |

## What is Tested

[RESTful-Booker API](https://restful-booker.herokuapp.com) — a demo API for testing:

| Endpoint | Method | Coverage |
|----------|--------|----------|
| `/auth` | POST | Login (valid + 10 invalid cases) |
| `/booking` | POST | Create booking (valid + invalid cases) |
| `/booking/:id` | GET | Get a booking |
| `/booking/:id` | PATCH | Partial update (7 cases) |
| `/booking/:id` | PUT | Full update (valid/incomplete/unauth) |
| `/booking/:id` | DELETE | Delete (success/unauth/nonexistent) |

## Project Structure

```
├── .github/workflows/playwright.yml   # CI pipeline
├── data/                              # TEST DATA (JSON files)
│   ├── users.json                     # Login credentials (valid/invalid)
│   ├── createBooking.json             # Booking payloads (valid/invalid)
│   ├── partialUpdate.json             # PATCH payloads
│   └── put.json                       # PUT payloads
├── fixture/
│   └── apiFixtures.js                 # Custom Playwright fixtures (apiClient, auth, booking)
├── schemas/                           # JSON Schema definitions (AJV)
│   ├── login_schemas.js               # Login success + error schemas
│   ├── createB_schemas.js             # Create booking schema
│   ├── getH_schemas.js                # Get booking schema
│   ├── partialUpdate_schemas.js       # PATCH schema
│   └── put_schemas.js                 # PUT schema
├── services/                          # API call wrappers (one per endpoint)
│   ├── login_service.js
│   ├── Create_booking_servicce.js
│   ├── get_booking_service.js
│   ├── partial_update_booking_service.js
│   ├── put_booking_service.js
│   └── delete_booking_service.js
├── tests/                             # Test spec files
│   ├── 1-login.spec.js
│   ├── 2-createbooking.spec.js
│   ├── 3-Get.spec.js
│   ├── 4-partialupdate.spec.js
│   ├── 5-put.spec.js
│   └── 6-delete.spec.js
├── utils/                             # Reusable helpers
│   ├── apiclients.js                  # API context + get/post/patch/put/delete
│   ├── tokenmanager.js                # Token state (set/get/clear)
│   ├── responsevalidator.js           # Assertion helpers (status/truthy/property/body/text)
│   ├── schemavalidator.js             # AJV schema validation wrapper
│   └── logger.js                      # Winston logger setup
├── playwright.config.js               # Playwright config (workers, reporter)
└── logs/api.log                       # Generated log file
```

## Architecture / Flow

### Request Flow
```
Test spec
   │
   ▼
service layer (e.g. Create_booking_service → POST /booking)
   │
   ▼
utils/apiclients.js  → api context (initApiClient) + HTTP method
   │                     ├── logger.info() for request start
   │                     ├── Cookie: token=<token> auto-attached
   │                     └── logger.info() for response status
   ▼
Response returned to test
```

### Validation Flow (Two-Layer)
```
Layer 1: Structure check
  Validateschema(jsonSchema, body)   # AJV - types, required fields, patterns
                                        └ uses schemas/*.js

Layer 2: Value / status check
  validateStatus()                   # HTTP status code
  validateTruthy()                   # value exists (non-empty)
  validateProperty()                 # field exists in body
  validateBody()                     # object partial match
  validateTextBody()                 # exact text match (for plain-text errors)
```

**Rule of thumb:** JSON responses (200) → schema + validators. Plain-text error responses (400/403/500) → `validateStatus` + `validateTextBody`.

### Token Management
```
auth fixture → login (POST /auth) → response.token
                    │
                    ▼
            tokenmanager.setToken(token)
                    │
                    ▼
apiclients (post/patch/put/del) → headers: { Cookie: token=<getToken()> }
```
Token is stored centrally in `utils/tokenmanager.js` and read by every authenticated request.

### Fixtures (Playwright worker-scoped)
| Fixture | What it does |
|---------|--------------|
| `apiClient` | Initializes the API request context |
| `auth` | Performs valid login, stores token |
| `booking` | Creates a booking, exposes `bookingid` / `body` / `token` |

## Setup & Run

```bash
# 1. Install dependencies
npm ci

# 2. Install Playwright browsers (for HTML report)
npx playwright install --with-deps

# 3. Run all tests
npx playwright test

# 4. Run a single spec file
npx playwright test 1-login
npx playwright test 4-partialupdate

# 5. Open HTML report
npx playwright show-report
```

> **Note:** Since this is API-only testing, no browser launch is strictly required; Chromium project is kept for reporting.

## Validation: JSON Schema vs Response Validator

| Scenario | Tool used |
|----------|-----------|
| Response is JSON object (200) | `Validateschema(...)` + `validateBody(...)` |
| Response is plain text error ("Forbidden") | `validateStatus()` + `validateTextBody()` |
| Checking a field exists | `validateProperty()` |
| Checking a value is not empty | `validateTruthy()` |

### Example — two approaches in one test
```js
// JSON success response:
Validateschema(putBookingSchema, body);   // structure
validateStatus(response, 200);            // status
validateBody(body, { firstname: "Updated" }); // values

// Plain-text error response:
validateStatus(response, 403);            // status
validateTextBody(body, "Forbidden");      // exact text
```

## Logging (Winston)

- **Console** + **file** (`logs/api.log`) transports.
- Format: `timestamp [LEVEL] message`
- Every HTTP call logs:
  ```
  2026-09-05T09:42:34.216Z [INFO] POST request started: https://restful-booker.herokuapp.com/auth
  2026-09-05T09:42:35.672Z [INFO] POST request completed: https://restful-booker.herokuapp.com/auth
  2026-09-05T09:42:35.673Z [INFO] Response status: 200
  ```

## API Behaviors Observed (Important)

These are quirks of the demo API — tests assert the **actual** behavior, not the spec-perfect behavior:

| Method | Input | Status | Body |
|--------|-------|--------|------|
| POST /auth | valid | 200 | `{ "token": "..." }` |
| POST /auth | invalid | 200 | `{ "reason": "Bad credentials" }` |
| POST /booking | valid | 200 | `{ "bookingid": N, "booking": {...} }` |
| POST /booking | missing/invalid fields | 500 | `Internal Server Error` (plain text) |
| PATCH /booking | valid + token | 200 | updated booking object |
| PATCH /booking | no token | 403 | `Forbidden` |
| PUT /booking | full data + token | 200 | updated booking object |
| PUT /booking | incomplete data | 400 | `Bad Request` |
| PUT /booking | no token | 403 | `Forbidden` |
| DELETE /booking | valid + token | 201 | `Created` |
| DELETE /booking | no token | 403 | `Forbidden` |
| DELETE /booking | nonexistent | 405 | `Method Not Allowed` |

> Note: DELETE returning `201 Created` is non-standard (normally 200/204) — but that is what this API actually returns, so the test asserts 201.

## CI (GitHub Actions)

`.github/workflows/playwright.yml` runs on every push/PR to `main`:
1. Checkout code
2. Setup Node (LTS)
3. `npm ci`
4. Install Playwright browsers
5. `npx playwright test`
6. Upload HTML report (retention 30 days)

## Adding a New Endpoint (e.g. Ping)

1. **Data**: add payloads in `data/<name>.json`
2. **Schema**: add JSON schema in `schemas/<name>_schemas.js`
3. **Service**: create `services/<name>_service.js` wrapping the `get/post/patch/put/del` call
4. **Test**: create `tests/N-<name>.spec.js` using schema + validators
   ```js
   import { Validateschema } from "../utils/schemavalidator";
   import { validateStatus } from "../utils/responsevalidator";
   ```