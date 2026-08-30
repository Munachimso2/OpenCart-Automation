# OpenCart Playwright Automation Framework

[![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=flat&logo=playwright&logoColor=white)](https://playwright.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![Playwright Tests](https://github.com/Munachimso2/OpenCart-Automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/Munachimso2/OpenCart-Automation/actions/workflows/playwright.yml)

A Playwright and JavaScript end-to-end automation framework for the OpenCart demo application. This portfolio project demonstrates maintainable Page Objects, cross-browser execution, isolated authenticated scenarios, negative testing, and CI execution for core account and shopping workflows.

## Framework highlights

- **Page Object Model:** page-specific selectors and actions are separated from test intent for login, registration, logout, search, and cart behavior.
- **Cross-browser testing:** login and registration suites are configured for Chromium, Firefox, and WebKit.
- **Independent authentication:** each logout scenario signs in with the dedicated demo account so one server-side logout cannot invalidate another test's session.
- **CI-aware execution:** CI forbids committed `test.only`, retries failures twice, and uses one worker for predictable execution against a shared demo environment.
- **Failure diagnostics:** HTML reporting and trace capture on the first retry support investigation of intermittent failures.
- **Secure configuration:** local values are loaded with `dotenv`; GitHub Actions supplies credentials and test data through encrypted repository secrets.

## Implemented coverage

| Area | Implemented scenarios |
|---|---|
| Login | Successful login, invalid credentials, empty fields, field and navigation checks, session persistence |
| Registration | New-account flow, generated unique email, registered-user login, validation errors, privacy policy, newsletter, placeholders, password masking |
| Logout | Successful logout, browser-back protection, account-page access after logout, immediate re-login |
| Search | Existing and missing products, empty input, special characters, case-insensitive search |
| Cart | Add, remove, update quantity, multiple products, item count, total price, empty-cart state |

Checkout automation is not currently present in the repository and is therefore not listed as completed coverage.

One rate-limit scenario is intentionally skipped because the shared demo environment does not enforce login-attempt limits consistently; the reason is documented beside the test.

## Project structure

```text
├── .github/workflows/playwright.yml
├── tests
│   ├── pageObject
│   │   ├── cartFeaturesPO.js
│   │   ├── loginPO.js
│   │   ├── logoutPO.js
│   │   ├── registerPO.js
│   │   └── searchPO.js
│   └── test-cases
│       ├── cartFeatures.spec.js
│       ├── login.spec.js
│       ├── logout.spec.js
│       ├── register.spec.js
│       └── search.spec.js
└── playwright.config.js
```

## Run locally

### Prerequisites

- Node.js 18 or later
- A dedicated test account for the OpenCart demo

```bash
git clone https://github.com/Munachimso2/OpenCart-Automation.git
cd OpenCart-Automation
npm ci
npx playwright install --with-deps
```

Create a local `.env` file. Do not commit it:

```env
USER_EMAIL=your_test_email@example.com
USER_PASSWORD=your_test_password
PHONE_NUMBER=your_test_phone_number
```

Run all configured projects and view the report:

```bash
npx playwright test
npx playwright show-report
```

Run a single browser project when focused feedback is useful:

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## CI and secret handling

GitHub Actions runs the suite on pushes and pull requests to `main` or `master`. `USER_EMAIL`, `USER_PASSWORD`, and `PHONE_NUMBER` come from encrypted GitHub Actions secrets. The workflow uploads the Playwright HTML report even after test failures, unless the run is cancelled.

## Author

**Affia David Okafor** — QA Automation Engineer
[GitHub](https://github.com/Munachimso2) · [LinkedIn](https://linkedin.com/in/affia-david-okafor-155407189)
