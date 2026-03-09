import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async navigate(path: string = ''): Promise<void> {
    const baseUrl = process.env.BASE_URL ?? '';
    await this.page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded' });
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }
}
