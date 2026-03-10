import { expect } from '@playwright/test';
import { test } from '../../src/fixtures/fixtures';

test.describe('Product List Pagination', { tag: ['@web', '@pagination'] }, () => {
  test.beforeEach(async ({ homePage }) => {
    await test.step('Navigate to home page', async () => {
      await homePage.open();
    });
  });

  test('Navigate to the next page of products', async ({ homePage }) => {
    await test.step('Click next page button', async () => {
      await homePage.clickNext();
    });

    await test.step('Assert products are listed on next page', async () => {
      const count = await homePage.getProductCount();
      expect(count).toBeGreaterThan(0);
    });
  });

  test('Navigate back to the previous page after going to the next page', async ({ homePage }) => {
    await test.step('Click next page button', async () => {
      await homePage.clickNext();
    });

    await test.step('Click previous page button', async () => {
      await homePage.clickPrevious();
    });

    await test.step('Assert products are listed on previous page', async () => {
      const count = await homePage.getProductCount();
      expect(count).toBeGreaterThan(0);
    });
  });
});
