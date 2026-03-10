import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AboutUsModal extends BasePage {
  private readonly modal = this.locator('#videoModal');
  private readonly video = this.locator('#videoModal video');
  private readonly closeButton = this.locator('#videoModal .close');

  constructor(page: Page) {
    super(page);
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  async hasVideo(): Promise<boolean> {
    return this.video.isVisible();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
    await this.modal.waitFor({ state: 'hidden' });
  }
}
