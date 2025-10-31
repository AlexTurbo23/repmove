import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [['html', { open: 'never' }], ['list']],

  outputDir: 'test-results',

  timeout: 120000,

  use: {
    baseURL: process.env.BASE_URL || 'http://dev-repmove-enterprise.web.app/',
    // чтобы точно увидеть файлы в test-results:
    trace: 'on', // или 'retain-on-failure' / 'on-first-retry'
    screenshot: 'on', // или 'only-on-failure'
    video: 'on', // или 'retain-on-failure'
    viewport: null,
    launchOptions: { args: ['--start-maximized'] },
    actionTimeout: 10000,
    navigationTimeout: 60000,
  },

  expect: { timeout: 10000 },

  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        viewport: null,
        launchOptions: { args: ['--start-maximized'] },
      },
    },
  ],
});
