# Playwright E2E Automation Framework

A modular end-to-end test automation framework built with **Playwright** and **TypeScript**, covering both **UI** (demoblaze.com) and **API** (reqres.in) testing.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev) | Browser automation & API testing |
| [k6](https://k6.io) | Performance & load testing |
| TypeScript | Type-safe test code |
| dotenv | Environment variable management |
| GitHub Actions | CI/CD pipeline |

---

## Project Structure

```
├── src/
│   ├── api/              # API client modules (BaseApi, UsersApi, AuthApi, ResourcesApi)
│   ├── fixtures/         # Custom Playwright fixtures for UI and API tests
│   ├── pages/            # Page Object Model classes for UI tests
│   └── utils/            # Shared utilities (e.g. alert handler)
├── tests/
│   ├── api/              # API test suites (users, auth, resources)
│   ├── auth/             # UI auth tests (login, signup)
│   ├── cart/             # UI cart & order tests
│   ├── navigation/       # UI navigation tests (contact, about us)
│   └── products/         # UI product tests (categories, pagination)
├── performance/
│   └── k6/
│       ├── api-load.js   # k6 API load test (reqres.in)
│       └── ui-smoke.js   # k6 Browser performance test (demoblaze.com)
├── .github/
│   └── workflows/
│       ├── playwright.yml    # CI/CD for Playwright tests (API + Web)
│       └── performance.yml   # CI/CD for k6 performance tests (manual only)
├── global-setup.ts       # Auto-installs missing browser before tests run
├── playwright.config.ts  # Playwright configuration
└── .env.example          # Environment variable template
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- [k6](https://k6.io/docs/get-started/installation/) (for performance tests only)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd 99tech-playwright

# Install dependencies
npm install

# Copy environment template and fill in values
cp .env.example .env
```

### Environment Variables

Edit `.env` with your values:

```env
# UI Testing (demoblaze.com)
BASE_URL=https://www.demoblaze.com
BROWSER=chrome                    # chrome | firefox | chromium | webkit | edge
HEADED=false                      # true to see the browser
WORKERS=1
TIMEOUT=30000
RETRIES=0

# API Testing (reqres.in)
API_BASE_URL=https://reqres.in
API_KEY=your_reqres_api_key       # Get free key at app.reqres.in/api-keys

# Test credentials (pre-registered on demoblaze.com)
TEST_USERNAME=your_username
TEST_PASSWORD=your_password
```

---

## Running Tests

### All tests
```bash
npm test
```

### UI tests only
```bash
npm test -- tests/auth tests/cart tests/products tests/navigation
```

### API tests only
```bash
npx playwright test --project=api
```

### Run on a specific browser
```bash
BROWSER=firefox npm test
BROWSER=chromium npm test
```

### Filter by tag
```bash
npx playwright test --grep "@login"
npx playwright test --grep "@cart"
npx playwright test --grep "@api"
```

### Headed mode (visible browser)
```bash
npm run test:headed
```

### Interactive UI mode
```bash
npm run test:ui
```

### HTML report
```bash
npm run test:report
# Open reports/playwright-html/index.html
```

---

## Performance Testing (k6)

Performance tests live in `performance/k6/` and use [k6](https://k6.io) — a separate tool from Playwright focused on load and performance metrics.

### Install k6

```bash
# macOS
brew install k6
```

### Run performance tests

```bash
# API load test (reqres.in)
npm run perf:api

# UI browser performance test (demoblaze.com) — requires k6 with browser module
npm run perf:ui
```

### What each script tests

**`api-load.js`** — Sends requests across 6 endpoint groups under configurable load:

| Group | Endpoint |
|-------|----------|
| Users — list | GET /api/users |
| Users — get by ID | GET /api/users/2 |
| Users — not found | GET /api/users/999 |
| Users — create | POST /api/users |
| Auth — login (valid) | POST /api/login |
| Auth — login (missing password) | POST /api/login |

Default: **1 VU, 30s** (~18 requests/run). Override via env vars:
```bash
k6 run -e VUS=5 -e DURATION=2m performance/k6/api-load.js
```

**`ui-smoke.js`** — Opens the demoblaze.com home, product, and cart pages with 3 concurrent virtual users and automatically collects **Core Web Vitals**:

| Metric | Threshold |
|--------|-----------|
| LCP (Largest Contentful Paint) | p75 < 2500ms |
| FCP (First Contentful Paint) | p75 < 1800ms |
| CLS (Cumulative Layout Shift) | p75 < 0.1 |
| TTFB (Time To First Byte) | p75 < 600ms |

> **Note:** reqres.in free tier allows **250 requests/day**. The default 1 VU / 30s config uses ~18 requests per run. For higher load, upgrade your reqres.in plan.

---

## Test Tags

Tags are applied at the `describe` level and can be combined with `--grep`.

| Tag | Scope |
|-----|-------|
| `@web` | All UI tests |
| `@api` | All API tests |
| `@login` | Login & logout |
| `@signup` | Sign up |
| `@cart` | Shopping cart & orders |
| `@categories` | Product category filter |
| `@pagination` | Product pagination |
| `@navigation` | Contact & About Us |
| `@users` | Users API |
| `@auth` | Auth API |
| `@resources` | Resources API |

```bash
# Run multiple tags
npx playwright test --grep "@login|@signup"

# Run all web tests on firefox
BROWSER=firefox npx playwright test --grep "@web"
```

---

## Core Concepts

### Page Object Model (UI)
Each UI component has its own class under `src/pages/`. All page objects extend `BasePage`, which provides common navigation and locator helpers. Tests never interact with raw selectors — everything goes through the page object.

### API Modules
Each API resource has its own class under `src/api/`. All API classes extend `BaseApi`, which handles the base URL, authentication header (`x-api-key`), and HTTP methods. Tests call typed methods that return Playwright's `APIResponse`.

### Fixtures
Custom fixtures in `src/fixtures/` inject page objects and API clients directly into test functions via Playwright's `extend()` mechanism — no manual instantiation needed in tests.

### Alert Handling (UI)
demoblaze.com uses both native `window.alert()` and SweetAlert popups. The `alertHelper` utility handles both by racing a native dialog listener against a SweetAlert DOM selector.

### Auto Browser Install
`global-setup.ts` checks if the configured browser is available before the test run. If not, it installs it automatically via `npx playwright install`.

---

## CI/CD (GitHub Actions)

Performance tests have a **dedicated workflow** separate from Playwright tests to allow independent triggering, scoping, and configuration.

---

### `playwright.yml` — Playwright Tests

Runs automatically on push/PR to `main` or `develop`, and supports manual dispatch.

**Jobs:**
- `api-tests` — runs all Playwright API tests (no browser required)
- `web-tests` — matrix run across `chromium` and `firefox`

**Manual dispatch inputs:**

| Input | Options | Default |
|-------|---------|---------|
| `test_scope` | `all`, `api`, `web` | `all` |
| `browser` | `chromium`, `firefox`, `webkit` | `chromium` |
| `tag` | any tag string | _(all)_ |

HTML reports are uploaded as artifacts and retained for 7 days.

---

### `performance.yml` — Performance Tests (k6)

**Manual trigger only** — never runs automatically on push/PR.

**Jobs:**
- `api-load-test` — k6 API load test against reqres.in
- `ui-smoke-test` — k6 Browser test measuring Core Web Vitals on demoblaze.com

**Manual dispatch inputs:**

| Input | Options | Default | Description |
|-------|---------|---------|-------------|
| `test_scope` | `all`, `api`, `ui` | `all` | Which k6 test to run |
| `vus` | any number | `1` | Number of virtual users (API test only) |
| `duration` | e.g. `30s`, `1m` | `30s` | Test duration (API test only) |

k6 summary JSON files are uploaded as artifacts and retained for 7 days.

---

### Required GitHub Secrets

Stored under the `dev` environment, shared by both workflows:

| Secret | Used by | Description |
|--------|---------|-------------|
| `BASE_URL` | Playwright web, k6 UI | UI test base URL |
| `API_BASE_URL` | Playwright API, k6 API | API base URL |
| `API_KEY` | Playwright API, k6 API | reqres.in API key |
| `TEST_USERNAME` | Playwright web | Test account username |
| `TEST_PASSWORD` | Playwright web | Test account password |
