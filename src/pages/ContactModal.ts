import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactModal extends BasePage {
  private readonly emailInput = this.locator('#recipient-email');
  private readonly nameInput = this.locator('#recipient-name');
  private readonly messageInput = this.locator('#message-text');
  private readonly sendButton = this.locator("button[onclick='send()']");
  private readonly modal = this.locator('#exampleModal');

  constructor(page: Page) {
    super(page);
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillName(name: string): Promise<void> {
    await this.nameInput.fill(name);
  }

  async fillMessage(message: string): Promise<void> {
    await this.messageInput.fill(message);
  }

  async send(): Promise<void> {
    await this.sendButton.click();
  }
}
