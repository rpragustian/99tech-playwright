import { expect } from '@playwright/test';
import { test } from '../../src/fixtures/fixtures';
import { waitForAlertMessage } from '../../src/utils/alertHelper';

test.describe('Navigation Menu', { tag: ['@web', '@navigation'] }, () => {
  test.beforeEach(async ({ homePage }) => {
    await test.step('Navigate to home page', async () => {
      await homePage.open();
    });
  });

  test('Contact modal opens and can submit a message', async ({ page, homePage, contactModal }) => {
    await test.step('Click Contact menu item', async () => {
      await homePage.openContact();
    });

    await test.step('Assert contact modal is visible', async () => {
      expect(await contactModal.isVisible()).toBe(true);
    });

    await test.step('Fill in contact form', async () => {
      await contactModal.fillEmail('test@example.com');
      await contactModal.fillName('Test User');
      await contactModal.fillMessage('This is a test message from Playwright automation.');
    });

    let alertMessage: string;
    await test.step('Send contact message', async () => {
      const alertPromise = waitForAlertMessage(page);
      await contactModal.send();
      alertMessage = await alertPromise;
    });

    await test.step('Assert success alert is shown', async () => {
      expect(alertMessage!).toContain('Thanks for the message!!');
    });
  });

  test('About Us modal opens and shows video', async ({ homePage, aboutUsModal }) => {
    await test.step('Click About Us menu item', async () => {
      await homePage.openAboutUs();
    });

    await test.step('Assert About Us modal is visible', async () => {
      expect(await aboutUsModal.isVisible()).toBe(true);
    });

    await test.step('Assert video is present in modal', async () => {
      expect(await aboutUsModal.hasVideo()).toBe(true);
    });

    await test.step('Close About Us modal', async () => {
      await aboutUsModal.close();
      expect(await aboutUsModal.isVisible()).toBe(false);
    });
  });
});
