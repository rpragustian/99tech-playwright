import { expect } from '@playwright/test';
import { test } from '../../src/fixtures/fixtures';
import { waitForAlertMessage } from '../../src/utils/alertHelper';

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ homePage }) => {
    await test.step('Navigate to home page', async () => {
      await homePage.open();
    });
  });

  test('Add product to cart', async ({ page, homePage, productPage, cartPage }) => {
    await test.step('Click on the first product', async () => {
      await homePage.clickFirstProduct();
    });

    await test.step('Add product to cart', async () => {
      const alertPromise = waitForAlertMessage(page);
      await productPage.addToCart();
      const alertMessage = await alertPromise;
      expect(alertMessage).toContain('Product added');
    });

    await test.step('Navigate to cart', async () => {
      await homePage.goToCart();
    });

    await test.step('Assert product is in cart', async () => {
      const itemCount = await cartPage.getItemCount();
      expect(itemCount).toBeGreaterThan(0);
    });
  });

  test('Add multiple products to cart', async ({ page, homePage, productPage, cartPage }) => {
    await test.step('Click on the first product and add to cart', async () => {
      await homePage.clickFirstProduct();
      const alertPromise = waitForAlertMessage(page);
      await productPage.addToCart();
      await alertPromise;
    });

    await test.step('Go back to home page', async () => {
      await homePage.open();
    });

    await test.step('Click on another product and add to cart', async () => {
      const titles = await homePage.getProductTitles();
      await homePage.clickProduct(titles[1]);
      const alertPromise = waitForAlertMessage(page);
      await productPage.addToCart();
      await alertPromise;
    });

    await test.step('Navigate to cart', async () => {
      await homePage.goToCart();
    });

    await test.step('Assert multiple products are in cart', async () => {
      const itemCount = await cartPage.getItemCount();
      expect(itemCount).toBeGreaterThanOrEqual(2);
    });
  });

  test('Remove product from cart', async ({ page, homePage, productPage, cartPage }) => {
    await test.step('Add a product to cart', async () => {
      await homePage.clickFirstProduct();
      const alertPromise = waitForAlertMessage(page);
      await productPage.addToCart();
      await alertPromise;
    });

    await test.step('Navigate to cart', async () => {
      await homePage.goToCart();
    });

    let itemCountBefore: number;
    await test.step('Get initial cart item count', async () => {
      itemCountBefore = await cartPage.getItemCount();
      expect(itemCountBefore).toBeGreaterThan(0);
    });

    await test.step('Delete the first item from cart', async () => {
      await cartPage.deleteFirstItem();
    });

    await test.step('Assert item is removed from cart', async () => {
      const itemCountAfter = await cartPage.getItemCount();
      expect(itemCountAfter).toBe(itemCountBefore! - 1);
    });
  });

  test('Place order with valid data', async ({ page, homePage, productPage, cartPage, orderModal }) => {
    await test.step('Add a product to cart', async () => {
      await homePage.clickFirstProduct();
      const alertPromise = waitForAlertMessage(page);
      await productPage.addToCart();
      await alertPromise;
    });

    await test.step('Navigate to cart', async () => {
      await homePage.goToCart();
    });

    await test.step('Click Place Order', async () => {
      await cartPage.clickPlaceOrder();
    });

    await test.step('Fill order form with valid data', async () => {
      await orderModal.fillForm({
        name: 'John Doe',
        country: 'Indonesia',
        city: 'Jakarta',
        card: '1234567890123456',
        month: 'March',
        year: '2026',
      });
    });

    await test.step('Submit purchase', async () => {
      await orderModal.purchase();
    });

    await test.step('Assert order success and confirm', async () => {
      const message = await orderModal.getSuccessMessageAndConfirm();
      expect(message.toLowerCase()).toContain('thank you');
    });
  });

  test('Total amount increases after adding a product', async ({ page, homePage, productPage, cartPage }) => {
    await test.step('Navigate to cart and check initial total is zero', async () => {
      await homePage.goToCart();
      const initialTotal = await cartPage.getTotal();
      expect(initialTotal).toBe(0);
    });

    await test.step('Go back to home and add a product', async () => {
      await homePage.open();
      await homePage.clickFirstProduct();
      const alertPromise = waitForAlertMessage(page);
      await productPage.addToCart();
      await alertPromise;
    });

    await test.step('Navigate to cart', async () => {
      await homePage.goToCart();
    });

    await test.step('Assert total is greater than zero', async () => {
      const total = await cartPage.getTotal();
      expect(total).toBeGreaterThan(0);
    });
  });

  test('Total amount decreases after removing a product', async ({ page, homePage, productPage, cartPage }) => {
    await test.step('Add a product to cart', async () => {
      await homePage.clickFirstProduct();
      const alertPromise = waitForAlertMessage(page);
      await productPage.addToCart();
      await alertPromise;
    });

    await test.step('Navigate to cart and record total', async () => {
      await homePage.goToCart();
    });

    let totalBefore: number;
    await test.step('Get total before deletion', async () => {
      totalBefore = await cartPage.getTotal();
      expect(totalBefore).toBeGreaterThan(0);
    });

    await test.step('Remove the product from cart', async () => {
      await cartPage.deleteFirstItem();
    });

    await test.step('Assert total is reduced to zero', async () => {
      const totalAfter = await cartPage.getTotal();
      expect(totalAfter).toBeLessThan(totalBefore!);
    });
  });

  test('Total amount in success message matches cart total', async ({ page, homePage, productPage, cartPage, orderModal }) => {
    await test.step('Add a product to cart', async () => {
      await homePage.clickFirstProduct();
      const alertPromise = waitForAlertMessage(page);
      await productPage.addToCart();
      await alertPromise;
    });

    await test.step('Navigate to cart', async () => {
      await homePage.goToCart();
    });

    let cartTotal: number;
    await test.step('Record cart total', async () => {
      cartTotal = await cartPage.getTotal();
      expect(cartTotal).toBeGreaterThan(0);
    });

    await test.step('Click Place Order', async () => {
      await cartPage.clickPlaceOrder();
    });

    await test.step('Fill order form', async () => {
      await orderModal.fillForm({
        name: 'Jane Doe',
        country: 'Indonesia',
        city: 'Bandung',
        card: '9876543210987654',
        month: 'March',
        year: '2026',
      });
    });

    await test.step('Submit purchase', async () => {
      await orderModal.purchase();
    });

    await test.step('Assert success amount matches cart total', async () => {
      const { title, amount } = await orderModal.getSuccessDetailsAndConfirm();
      expect(title.toLowerCase()).toContain('thank you');
      expect(amount).toBe(cartTotal!);
    });
  });

  test('Logged in user can place order with a different name', async ({ page, homePage, signUpModal, loginModal, productPage, cartPage, orderModal }) => {
    const username = `testorder_${Date.now()}`;
    const password = 'Test@1234';

    await test.step('Register and login', async () => {
      await homePage.openSignUpModal();
      await signUpModal.fillUsername(username);
      await signUpModal.fillPassword(password);
      const signupAlert = waitForAlertMessage(page);
      await signUpModal.submit();
      await signupAlert;

      await homePage.openLoginModal();
      await loginModal.fillUsername(username);
      await loginModal.fillPassword(password);
      await loginModal.submit();
      await expect(async () => {
        expect(await homePage.isLoggedIn()).toBe(true);
      }).toPass({ timeout: 8000 });
    });

    await test.step('Add a product to cart', async () => {
      await homePage.clickFirstProduct();
      const alertPromise = waitForAlertMessage(page);
      await productPage.addToCart();
      await alertPromise;
    });

    await test.step('Navigate to cart', async () => {
      await homePage.goToCart();
    });

    await test.step('Click Place Order', async () => {
      await cartPage.clickPlaceOrder();
    });

    await test.step('Fill order with a different name than the login username', async () => {
      await orderModal.fillForm({
        name: 'Different Person',
        country: 'Indonesia',
        city: 'Surabaya',
        card: '1111222233334444',
        month: 'April',
        year: '2027',
      });
    });

    await test.step('Submit purchase', async () => {
      await orderModal.purchase();
    });

    await test.step('Assert order succeeds with the different name', async () => {
      const message = await orderModal.getSuccessMessageAndConfirm();
      expect(message.toLowerCase()).toContain('thank you');
    });
  });

  test('Place order with empty data', async ({ page, homePage, productPage, cartPage, orderModal }) => {
    await test.step('Add a product to cart', async () => {
      await homePage.clickFirstProduct();
      const alertPromise = waitForAlertMessage(page);
      await productPage.addToCart();
      await alertPromise;
    });

    await test.step('Navigate to cart', async () => {
      await homePage.goToCart();
    });

    await test.step('Click Place Order', async () => {
      await cartPage.clickPlaceOrder();
    });

    let alertMessage: string;
    await test.step('Submit order form with all fields empty', async () => {
      const alertPromise = waitForAlertMessage(page);
      await orderModal.purchase();
      alertMessage = await alertPromise;
    });

    await test.step('Assert validation alert is shown', async () => {
      expect(alertMessage!).toContain('Please fill out Name and Creditcard.');
    });
  });
});
