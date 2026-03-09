import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  private readonly signUpLink = this.locator('a#signin2');
  private readonly loginLink = this.locator('a#login2');
  private readonly loggedInUsername = this.locator('#nameofuser');
  private readonly cartLink = this.locator('a#cartur');

  private readonly categoryPhones = this.locator("a[onclick=\"byCat('phone')\"]");
  private readonly categoryLaptops = this.locator("a[onclick=\"byCat('notebook')\"]");
  private readonly categoryMonitors = this.locator("a[onclick=\"byCat('monitor')\"]");

  private readonly nextButton = this.locator('button#next2');
  private readonly prevButton = this.locator('button#prev2');
  private readonly productCards = this.locator('div.col-lg-4.col-md-6.mb-4 .card');

  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.navigate('/index.html');
    await this.productCards.first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async openSignUpModal(): Promise<void> {
    await this.signUpLink.click();
    await this.locator('#signInModal.show').waitFor({ state: 'visible' });
  }

  async openLoginModal(): Promise<void> {
    await this.loginLink.click();
    await this.locator('#logInModal.show').waitFor({ state: 'visible' });
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
    await this.page.waitForURL('**/cart.html');
  }

  async clickProduct(name: string): Promise<void> {
    await this.locator(`div.col-lg-4.col-md-6.mb-4 .card-title a`).filter({ hasText: name }).first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickFirstProduct(): Promise<string> {
    const firstProductTitle = this.locator('div.col-lg-4.col-md-6.mb-4 .card-title a').first();
    await firstProductTitle.waitFor({ state: 'visible' });
    const name = await firstProductTitle.innerText();
    await firstProductTitle.click();
    await this.page.waitForLoadState('domcontentloaded');
    return name;
  }

  async clickCategory(category: 'Phones' | 'Laptops' | 'Monitors'): Promise<void> {
    const map = {
      Phones: this.categoryPhones,
      Laptops: this.categoryLaptops,
      Monitors: this.categoryMonitors,
    };
    await map[category].click();
    await this.page.waitForTimeout(1500);
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
    await this.page.waitForTimeout(1500);
  }

  async clickPrevious(): Promise<void> {
    await this.prevButton.click();
    await this.page.waitForTimeout(1500);
  }

  async getProductCount(): Promise<number> {
    await this.productCards.first().waitFor({ state: 'visible' });
    return this.productCards.count();
  }

  async getProductTitles(): Promise<string[]> {
    await this.productCards.first().waitFor({ state: 'visible' });
    return this.locator('div.col-lg-4.col-md-6.mb-4 .card-title a').allInnerTexts();
  }

  async isLoggedIn(): Promise<boolean> {
    return this.loggedInUsername.isVisible();
  }

  async getLoggedInUsername(): Promise<string> {
    return this.loggedInUsername.innerText();
  }
}
