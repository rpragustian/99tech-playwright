import { Page } from '@playwright/test';

/**
 * Waits for either a native browser dialog OR a SweetAlert 1.x popup.
 * Demoblaze uses native alert() for server responses and swal() for
 * client-side validation — swal() does NOT trigger Playwright's dialog event.
 */
export async function waitForAlertMessage(page: Page): Promise<string> {
  return Promise.race([
    page.waitForEvent('dialog', { timeout: 8000 }).then(async (dialog) => {
      const msg = dialog.message();
      await dialog.accept();
      return msg;
    }),
    page.waitForSelector('.sweet-alert', { state: 'visible', timeout: 8000 }).then(async () => {
      const msg = await page.locator('.sweet-alert p').innerText();
      await page.locator('.sweet-alert .confirm').click();
      return msg;
    }),
  ]);
}
