import { expect } from '@playwright/test';
import { test } from '../../src/fixtures/fixtures';
import { waitForAlertMessage } from '../../src/utils/alertHelper';

test.describe('Sign Up', () => {
  test.beforeEach(async ({ homePage }) => {
    await test.step('Navigate to home page', async () => {
      await homePage.open();
    });
    await test.step('Open sign up modal', async () => {
      await homePage.openSignUpModal();
    });
  });

  test('Successful sign up with unique credentials', async ({ page, signUpModal }) => {
    const username = `testuser_${Date.now()}`;

    await test.step('Fill sign up form with unique username', async () => {
      await signUpModal.fillUsername(username);
      await signUpModal.fillPassword('Test@1234');
    });

    let alertMessage: string;
    await test.step('Submit sign up form', async () => {
      const alertPromise = waitForAlertMessage(page);
      await signUpModal.submit();
      alertMessage = await alertPromise;
    });

    await test.step('Assert sign up success alert is shown', async () => {
      expect(alertMessage!).toContain('Sign up successful.');
    });
  });

  test('Sign up with an already existing username', async ({ page, signUpModal }) => {
    await test.step('Fill sign up form with existing username', async () => {
      await signUpModal.fillUsername('testuser_playwright');
      await signUpModal.fillPassword('Test@1234');
    });

    let alertMessage: string;
    await test.step('Submit sign up form', async () => {
      const alertPromise = waitForAlertMessage(page);
      await signUpModal.submit();
      alertMessage = await alertPromise;
    });

    await test.step('Assert duplicate user alert is shown', async () => {
      expect(alertMessage!).toContain('This user already exist.');
    });
  });

  test('Sign up with empty credentials', async ({ page, signUpModal }) => {
    let alertMessage: string;
    await test.step('Submit sign up form with empty fields', async () => {
      const alertPromise = waitForAlertMessage(page);
      await signUpModal.submit();
      alertMessage = await alertPromise;
    });

    await test.step('Assert validation alert is shown', async () => {
      expect(alertMessage!).toContain('Please fill out Username and Password.');
    });
  });
});
