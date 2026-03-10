import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface OrderData {
  name?: string;
  country?: string;
  city?: string;
  card?: string;
  month?: string;
  year?: string;
}

export class OrderModal extends BasePage {
  private readonly nameInput = this.locator('#name');
  private readonly countryInput = this.locator('#country');
  private readonly cityInput = this.locator('#city');
  private readonly cardInput = this.locator('#card');
  private readonly monthInput = this.locator('#month');
  private readonly yearInput = this.locator('#year');
  private readonly purchaseButton = this.locator("button[onclick='purchaseOrder()']");
  private readonly successTitle = this.locator('.sweet-alert h2');
  private readonly successBody = this.locator('.sweet-alert p');
  private readonly successConfirmButton = this.locator('.sweet-alert .confirm');

  constructor(page: Page) {
    super(page);
  }

  async fillForm(data: OrderData): Promise<void> {
    if (data.name) await this.nameInput.fill(data.name);
    if (data.country) await this.countryInput.fill(data.country);
    if (data.city) await this.cityInput.fill(data.city);
    if (data.card) await this.cardInput.fill(data.card);
    if (data.month) await this.monthInput.fill(data.month);
    if (data.year) await this.yearInput.fill(data.year);
  }

  async purchase(): Promise<void> {
    await this.purchaseButton.click();
  }

  async getSuccessMessageAndConfirm(): Promise<string> {
    await this.successTitle.waitFor({ state: 'visible', timeout: 8000 });
    const message = await this.successTitle.innerText();
    await this.successConfirmButton.click({ force: true });
    return message;
  }

  async getSuccessDetailsAndConfirm(): Promise<{ title: string; amount: number }> {
    await this.successTitle.waitFor({ state: 'visible', timeout: 8000 });
    const title = await this.successTitle.innerText();
    const bodyText = await this.successBody.innerText();
    // Body format: "Id: 123\nAmount: 299 USD\nCard Number: ...\nName: ...\nDate: ..."
    const amountMatch = bodyText.match(/Amount:\s*([\d.]+)/i);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
    await this.successConfirmButton.click({ force: true });
    return { title, amount };
  }
}
