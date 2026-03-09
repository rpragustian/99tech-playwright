import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginModal extends BasePage {
  private readonly usernameInput = this.locator('#loginusername');
  private readonly passwordInput = this.locator('#loginpassword');
  private readonly submitButton = this.locator('.modal#logInModal .btn-primary');

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
