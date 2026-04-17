import { defineConfig, devices } from '@playwright/test';

const isPreview = process.env.PW_MODE === 'preview';
const isScreenshots = process.env.PW_SCREENSHOTS === '1';
const port = isPreview ? 4321 : 4322;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  timeout: 15_000,

  use: {
    baseURL: `http://localhost:${port}`,
    screenshot: 'only-on-failure',
    video: 'off',
    trace: 'on-first-retry',
  },

  outputDir: 'test-results',

  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'], viewport: { width: 390, height: 844 } },
    },
  ],

  webServer: {
    command: isPreview
      ? 'npm run build && npm run preview -- --port 4321'
      : 'npm run dev -- --port 4322',
    port,
    reuseExistingServer: !process.env.CI,
    timeout: isPreview ? 60_000 : 30_000,
  },

  testIgnore: isScreenshots ? undefined : '**/screenshots.spec.ts',
  ...(isScreenshots && {
    testMatch: 'screenshots.spec.ts',
  }),
});
