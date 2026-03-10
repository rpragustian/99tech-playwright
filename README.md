# Playwright E2E Automation Framework

A modular end-to-end test automation framework built with **Playwright** and **TypeScript**, covering both **UI** (demoblaze.com) and **API** (reqres.in) testing — without Gherkin/Cucumber.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev) | Browser automation & API testing |
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
├── .github/workflows/    # GitHub Actions CI/CD
├── global-setup.ts       # Auto-installs missing browser before tests run
├── playwright.config.ts  # Playwright configuration
└── .env.example          # Environment variable template
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

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

The workflow at `.github/workflows/playwright.yml` runs on push/PR to `main` or `develop`, and supports manual dispatch.

**Jobs:**
- `api-tests` — runs all API tests (no browser required)
- `web-tests` — matrix run across `chromium` and `firefox`

**Manual dispatch inputs:**

| Input | Options | Default |
|-------|---------|---------|
| `test_scope` | `all`, `api`, `web` | `all` |
| `browser` | `chromium`, `firefox`, `webkit` | `chromium` |
| `tag` | any tag string | _(all)_ |

**Required GitHub Secrets** (stored under the `dev` environment):

| Secret | Description |
|--------|-------------|
| `BASE_URL` | UI test base URL |
| `API_BASE_URL` | API base URL |
| `API_KEY` | reqres.in API key |
| `TEST_USERNAME` | Test account username |
| `TEST_PASSWORD` | Test account password |

HTML reports are uploaded as artifacts and retained for 7 days.
