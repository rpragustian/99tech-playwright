import { expect } from '@playwright/test';
import { test } from '../../src/fixtures/fixtures';
import { waitForAlertMessage } from '../../src/utils/alertHelper';

test.describe('Login', () => {
  test.beforeEach(async ({ homePage }) => {
    await test.step('Navigate to home page', async () => {
      await homePage.open();
    });
  });

  test('Successful login with valid credentials', async ({ page, homePage, signUpModal, loginModal }) => {
    const username = `testlogin_${Date.now()}`;
    const password = 'Test@1234';

    await test.step('Register a new account', async () => {
      await homePage.openSignUpModal();
      await signUpModal.fillUsername(username);
      await signUpModal.fillPassword(password);
      const alertPromise = waitForAlertMessage(page);
      await signUpModal.submit();
      await alertPromise;
    });

    await test.step('Open login modal', async () => {
      await homePage.openLoginModal();
    });

    await test.step('Fill login credentials', async () => {
      await loginModal.fillUsername(username);
      await loginModal.fillPassword(password);
    });

    await test.step('Submit login form', async () => {
      await loginModal.submit();
    });

    await test.step('Assert user is logged in', async () => {
      await expect(async () => {
        expect(await homePage.isLoggedIn()).toBe(true);
      }).toPass({ timeout: 8000 });
    });
  });

  test('Login with wrong password', async ({ page, homePage, signUpModal, loginModal }) => {
    const username = `testlogin_${Date.now()}`;
    const password = 'Test@1234';

    await test.step('Register a new account', async () => {
      await homePage.openSignUpModal();
      await signUpModal.fillUsername(username);
      await signUpModal.fillPassword(password);
      const alertPromise = waitForAlertMessage(page);
      await signUpModal.submit();
      await alertPromise;
    });

    await test.step('Open login modal', async () => {
      await homePage.openLoginModal();
    });

    await test.step('Fill credentials with wrong password', async () => {
      await loginModal.fillUsername(username);
      await loginModal.fillPassword('wrongpassword_xyz');
    });

    let alertMessage: string;
    await test.step('Submit login form', async () => {
      const alertPromise = waitForAlertMessage(page);
      await loginModal.submit();
      alertMessage = await alertPromise;
    });

    await test.step('Assert wrong password alert is shown', async () => {
      expect(alertMessage!).toContain('Wrong password.');
    });
  });

  test('Login with empty credentials', async ({ page, homePage, loginModal }) => {
    await test.step('Open login modal', async () => {
      await homePage.openLoginModal();
    });

    let alertMessage: string;
    await test.step('Submit login form with empty fields', async () => {
      const alertPromise = waitForAlertMessage(page);
      await loginModal.submit();
      alertMessage = await alertPromise;
    });

    await test.step('Assert validation alert is shown', async () => {
      expect(alertMessage!).toContain('Please fill out Username and Password.');
    });
  });
});
