import { execSync } from 'child_process';
import { chromium, firefox, webkit } from '@playwright/test';

const browserTypeMap: Record<string, { type: typeof chromium; name: string }> = {
  firefox: { type: firefox, name: 'firefox' },
  webkit: { type: webkit, name: 'webkit' },
  safari: { type: webkit, name: 'webkit' },
  chromium: { type: chromium, name: 'chromium' },
  chrome: { type: chromium, name: 'chromium' },
  edge: { type: chromium, name: 'chromium' },
  msedge: { type: chromium, name: 'chromium' },
};

async function globalSetup(): Promise<void> {
  const browserEnvs = (process.env.BROWSER || 'chrome')
    .toLowerCase()
    .split(',')
    .map(b => b.trim());

  // Deduplicate by resolved browser name (e.g. chrome + chromium both → chromium)
  const seen = new Set<string>();
  for (const browserEnv of browserEnvs) {
    const { type: browserType, name: browserName } = browserTypeMap[browserEnv] ?? browserTypeMap['chrome'];
    if (seen.has(browserName)) continue;
    seen.add(browserName);

    try {
      const browser = await browserType.launch();
      await browser.close();
    } catch {
      console.log(`\n[global-setup] Browser "${browserName}" not found. Installing...\n`);
      execSync(`npx playwright install ${browserName}`, { stdio: 'inherit' });
      console.log(`\n[global-setup] "${browserName}" installed successfully.\n`);
    }
  }
}

export default globalSetup;
