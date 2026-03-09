import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
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
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-html', open: 'never' }],
  ],
});
