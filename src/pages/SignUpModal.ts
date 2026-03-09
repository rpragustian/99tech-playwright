import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignUpModal extends BasePage {
  private readonly usernameInput = this.locator('#sign-username');
  private readonly passwordInput = this.locator('#sign-password');
  private readonly submitButton = this.locator('.modal#signInModal .btn-primary');

  constructor(page: Page) {
    super(page);
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
