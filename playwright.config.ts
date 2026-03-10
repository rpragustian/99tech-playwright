import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const getBrowserConfigs = () => {
  const browserNames = (process.env.BROWSER || 'chrome').toLowerCase().split(',').map(b => b.trim());
  return browserNames.map(browserName => {
    switch (browserName) {
      case 'firefox':
        return { name: 'firefox', testIgnore: '**/tests/api/**', use: { ...devices['Desktop Firefox'] } };
      case 'webkit':
      case 'safari':
        return { name: 'webkit', testIgnore: '**/tests/api/**', use: { ...devices['Desktop Safari'] } };
      case 'chromium':
        return { name: 'chromium', testIgnore: '**/tests/api/**', use: { ...devices['Desktop Chrome'] } };
      case 'edge':
      case 'msedge':
        return { name: 'Microsoft Edge', testIgnore: '**/tests/api/**', use: { ...devices['Desktop Edge'], channel: 'msedge' } };
      case 'chrome':
      default:
        return { name: 'Google Chrome', testIgnore: '**/tests/api/**', use: { ...devices['Desktop Chrome'], channel: 'chrome' } };
    }
  });
};

export default defineConfig({
  globalSetup: './global-setup.ts',
  testDir: './tests',
  timeout: parseInt(process.env.TIMEOUT ?? '30000'),
  retries: parseInt(process.env.RETRIES ?? '0'),
  workers: parseInt(process.env.WORKERS ?? '1'),
  use: {
    baseURL: process.env.BASE_URL,
    headless: process.env.HEADED !== 'true',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    ...getBrowserConfigs(),
    {
      name: 'api',
      testMatch: '**/tests/api/**/*.spec.ts',
    },
  ],
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-html', open: 'never' }],
  ],
});
