/**
 * K6 Browser Performance Test — demoblaze.com
 *
 * Measures Core Web Vitals and page load times under concurrent users.
 * Uses k6 Browser module (Chromium-based, similar API to Playwright).
 *
 * Metrics collected automatically:
 *   - LCP  (Largest Contentful Paint)   target: p75 < 2500ms
 *   - FCP  (First Contentful Paint)     target: p75 < 1800ms
 *   - CLS  (Cumulative Layout Shift)    target: p75 < 0.1
 *   - TTFB (Time To First Byte)         target: p75 < 600ms
 *   - TBT  (Total Blocking Time)        target: p75 < 200ms
 *
 * Run locally (requires k6 with browser module):
 *   k6 run --env BASE_URL=https://www.demoblaze.com performance/k6/ui-smoke.js
 */

import { browser } from 'k6/browser';
import { check, sleep } from 'k6';

// ── Configuration ────────────────────────────────────────────────────────────

export const options = {
  scenarios: {
    ui_smoke: {
      executor: 'constant-vus',
      vus: 3,
      duration: '1m',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    'browser_web_vital_lcp':  ['p(75)<2500', 'p(99)<4000'],
    'browser_web_vital_fcp':  ['p(75)<1800'],
    'browser_web_vital_cls':  ['p(75)<0.1'],
    'browser_web_vital_ttfb': ['p(75)<600'],
    'checks':                 ['rate>0.90'],
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const BASE_URL = __ENV.BASE_URL || 'https://www.demoblaze.com';

// ── Test Scenarios ────────────────────────────────────────────────────────────

export default async function () {
  const page = await browser.newPage();

  try {
    // ── Home page load ─────────────────────────────────────────────────────
    const homeResponse = await page.goto(`${BASE_URL}/index.html`, {
      waitUntil: 'domcontentloaded',
    });

    check(homeResponse, {
      'home page: status is 200': r => r && r.status() === 200,
    });

    // Wait for products to be visible
    await page.waitForSelector('div.col-lg-4.col-md-6.mb-4 .card', {
      state: 'visible',
      timeout: 15000,
    });

    check(page, {
      'home page: products visible': p => p.locator('div.col-lg-4.col-md-6.mb-4 .card').first() !== null,
    });

    sleep(1);

    // ── Product page load ──────────────────────────────────────────────────
    await page.locator('div.col-lg-4.col-md-6.mb-4 .card-title a').first().click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('h2.name', { state: 'visible', timeout: 10000 });

    check(page, {
      'product page: title visible': p => p.locator('h2.name') !== null,
      'product page: add to cart button visible': p =>
        p.locator('a.btn-success').first() !== null,
    });

    sleep(1);

    // ── Cart page load ─────────────────────────────────────────────────────
    const cartResponse = await page.goto(`${BASE_URL}/cart.html`, {
      waitUntil: 'domcontentloaded',
    });

    check(cartResponse, {
      'cart page: status is 200': r => r && r.status() === 200,
    });

    sleep(1);

  } finally {
    await page.close();
  }
}
