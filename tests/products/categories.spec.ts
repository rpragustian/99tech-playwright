import { expect } from '@playwright/test';
import { test } from '../../src/fixtures/fixtures';

test.describe('Product Categories', { tag: ['@web', '@categories'] }, () => {
  test.beforeEach(async ({ homePage }) => {
    await test.step('Navigate to home page', async () => {
      await homePage.open();
    });
  });

  test('Filter products by Phones category', async ({ homePage }) => {
    await test.step('Click Phones category', async () => {
      await homePage.clickCategory('Phones');
    });

    await test.step('Assert products are listed', async () => {
      const count = await homePage.getProductCount();
      expect(count).toBeGreaterThan(0);
    });
  });

  test('Filter products by Laptops category', async ({ homePage }) => {
    await test.step('Click Laptops category', async () => {
      await homePage.clickCategory('Laptops');
    });

    await test.step('Assert products are listed', async () => {
      const count = await homePage.getProductCount();
      expect(count).toBeGreaterThan(0);
    });
  });

  test('Filter products by Monitors category', async ({ homePage }) => {
    await test.step('Click Monitors category', async () => {
      await homePage.clickCategory('Monitors');
    });

    await test.step('Assert products are listed', async () => {
      const count = await homePage.getProductCount();
      expect(count).toBeGreaterThan(0);
    });
  });
});
