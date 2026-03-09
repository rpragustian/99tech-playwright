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
