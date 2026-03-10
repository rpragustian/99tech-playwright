import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly cartRows = this.locator('#tbodyid tr');
  private readonly totalAmount = this.locator('#totalp');
  private readonly placeOrderButton = this.locator('button.btn-success');

  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.navigate('/cart.html');
  }

  async getItemCount(): Promise<number> {
    await this.page.waitForTimeout(1500);
    return this.cartRows.count();
  }

  async getItemNames(): Promise<string[]> {
    await this.page.waitForTimeout(1500);
    return this.locator('#tbodyid tr td:nth-child(2)').allInnerTexts();
  }

  async getTotal(): Promise<number> {
    await this.page.waitForTimeout(1500);
    const text = await this.totalAmount.innerText();
    return parseFloat(text) || 0;
  }

  async deleteItem(name: string): Promise<void> {
    const row = this.cartRows.filter({ hasText: name });
    await row.locator('a', { hasText: 'Delete' }).click();
    await this.page.waitForTimeout(1500);
  }

  async deleteFirstItem(): Promise<void> {
    await this.page.waitForTimeout(1500);
    await this.cartRows.first().locator('a', { hasText: 'Delete' }).click();
    await this.page.waitForTimeout(1500);
  }

  async clickPlaceOrder(): Promise<void> {
    await this.placeOrderButton.click();
    await this.locator('#orderModal.show').waitFor({ state: 'visible' });
  }
}
