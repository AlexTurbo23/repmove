🚀 Overview

This repository contains a modular, scalable automation framework built on Playwright + TypeScript, using the Page Object Model (POM) and OOP principles.

The framework supports:

✅ UI & API test execution

✅ Configurable environments via .env or environment variables

✅ Built-in HTML reports

✅ Parameterized & data-driven test scenarios

🧰 Tech Stack
Layer Technology
Language TypeScript
Test Runner Playwright
Design Pattern Page Object Model (POM)
Reporting Playwright HTML Reporter
Version Control Git / GitHub
CI-ready Compatible with GitHub Actions / Jenkins
⚙️ Setup Instructions

1. Prerequisites

Node.js 18+ (check via node -v)

Internet access (for browser installation)

2. Installation

# Clone the repository

git clone https://github.com/your-org/repmove.git
cd repmove

# Install dependencies

npm ci

# Install Playwright browsers (first time only)

npx playwright install

3. Environment Configuration

The framework uses environment variables and a config file.

You can define:

BASE_URL=https://dev-repmove-enterprise.web.app/
TEST_EMAIL=test@example.com
TEST_PASSWORD=Qwerty123!

Alternatively, you can export them in PowerShell:

$env:BASE_URL = "https://staging.repmove.app/"

Or use the default values defined in playwright.config.ts.

4. Project Structure
   📦 repmove-e2e/
   ├── 📁 pages/ # Page Object classes (AuthPage, RegistrationPage, etc.)
   ├── 📁 tests/ # Test suites (auth.spec.ts, reg.spec.ts, etc.)
   ├── 📁 utils/ # Helpers, test data, and credentials
   │ ├── credentials.ts
   ├── 📁 reports/ # HTML reports (auto-generated)
   ├── playwright.config.ts # Global test config
   ├── package.json
   └── README.md

🧩 Running the Tests
All tests
npx playwright test

Single test file
npx playwright test tests/auth.spec.ts

Run specific test by title
npx playwright test -g "User successfully logged in"

Run tests in headed (visible browser) mode
npm run test:headed

Run in UI mode
npm run test:ui

View last report
npm run report

🧱 Example Tests

auth.spec.ts

test('User successfully logged in; redirected to main page.', async ({ page }) => {
const auth = new AuthPage(page);
await auth.open('/');
await auth.login(credentials.email, credentials.password);
await auth.verifyLogoutBtn();
});

reg.spec.ts

test('User cannot register with existing email.', async ({ page }) => {
const reg = new RegistrationPage(page);
await reg.open('/');
await reg.fillCredentials('John', 'Doe', 'Acme Corp', 'test.exist@gmail.com', 'Qwerty123!');
await reg.submit();
await reg.verifyToastMessage('Email already registered');
});

🧩 Key Features

✅ Page Object Model (OOP-based)

✅ Configurable via environment

✅ Multi-browser support (Chromium, Firefox, WebKit)

✅ HTML + JSON reports

✅ Retry logic for unstable tests

✅ Reusable utility methods

🔍 Debugging & Reporting

To record video, screenshots, and logs:

npx playwright test --trace on

To open report:

npx playwright show-report

Artifacts (screenshots, traces) are saved automatically in /test-results.

🧠 Troubleshooting
Issue Solution
Tests fail with browser not found Run npx playwright install
ENV not applied Use $env:BASE_URL = "..." or update .env
Timeout exceeded Check your baseURL and network connection
Flaky tests Use retries (--retries=2) or waitForLoadState()
