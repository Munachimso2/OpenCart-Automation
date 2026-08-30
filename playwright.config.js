// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env'), quiet: true });


/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
export default defineConfig({
  testDir: './tests',
  timeout: 45000,
  expect: { timeout: 10000 },
  /* Run tests in files in parallel */
  // fullyParallel: true,
  fullyParallel: false, // This is to run tests in serial because of the registration flow test that needs to be run in order. You can set it to true if you want to run tests in parallel but make sure to remove the serial keyword from the describe block in register.spec.js
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    navigationTimeout: 45000,
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
        testMatch: [
            '**/login.spec.js',
            '**/register.spec.js',
        ]
    },
    {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
        testMatch: [
            '**/login.spec.js',
            '**/register.spec.js',
        ]
    },
    {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] },
        testMatch: [
            '**/login.spec.js',
            '**/register.spec.js',
        ]
    },
    {
        name: 'logged-in',
        use: {
            ...devices['Desktop Chrome']
        },
        testMatch: [
            '**/logout.spec.js'
        ]
    },
    {
        name: 'shopping',
        use: {
            ...devices['Desktop Chrome']
        },
        testMatch: [
            '**/cartFeatures.spec.js',
            '**/search.spec.js'
        ]
    }
],
});
