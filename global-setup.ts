import { execSync } from 'child_process';
import { chromium, firefox, webkit } from '@playwright/test';

async function globalSetup(): Promise<void> {
  const browserEnv = (process.env.BROWSER || 'chrome').toLowerCase();

  const browserTypeMap: Record<string, { type: typeof chromium; name: string }> = {
    firefox: { type: firefox, name: 'firefox' },
    webkit: { type: webkit, name: 'webkit' },
    safari: { type: webkit, name: 'webkit' },
    chromium: { type: chromium, name: 'chromium' },
    chrome: { type: chromium, name: 'chromium' },
    edge: { type: chromium, name: 'chromium' },
    msedge: { type: chromium, name: 'chromium' },
  };

  const { type: browserType, name: browserName } = browserTypeMap[browserEnv] ?? browserTypeMap['chrome'];

  try {
    const browser = await browserType.launch();
    await browser.close();
  } catch {
    console.log(`\n[global-setup] Browser "${browserName}" not found. Installing...\n`);
    execSync(`npx playwright install ${browserName}`, { stdio: 'inherit' });
    console.log(`\n[global-setup] "${browserName}" installed successfully.\n`);
  }
}

export default globalSetup;
