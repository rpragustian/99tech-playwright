import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  private readonly addToCartButton = this.locator('a.btn-success', { hasText: 'Add to cart' });
  private readonly productName = this.locator('h2.name');

  constructor(page: Page) {
    super(page);
  }

  async getProductName(): Promise<string> {
    await this.productName.waitFor({ state: 'visible' });
    return this.productName.innerText();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.addToCartButton.click();
  }
}
