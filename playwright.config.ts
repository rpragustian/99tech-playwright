import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const getBrowserConfig = () => {
  const browserName = (process.env.BROWSER || 'chrome').toLowerCase();
  switch (browserName) {
    case 'firefox':
      return { name: 'firefox', use: { ...devices['Desktop Firefox'] } };
    case 'webkit':
    case 'safari':
      return { name: 'webkit', use: { ...devices['Desktop Safari'] } };
    case 'chromium':
      return { name: 'chromium', use: { ...devices['Desktop Chrome'] } };
    case 'edge':
    case 'msedge':
      return { name: 'Microsoft Edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } };
    case 'chrome':
    default:
      return { name: 'Google Chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } };
  }
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
    getBrowserConfig(),
  ],
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-html', open: 'never' }],
  ],
});
