import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SignUpModal } from '../pages/SignUpModal';
import { LoginModal } from '../pages/LoginModal';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { OrderModal } from '../pages/OrderModal';

type Fixtures = {
  homePage: HomePage;
  signUpModal: SignUpModal;
  loginModal: LoginModal;
  productPage: ProductPage;
  cartPage: CartPage;
  orderModal: OrderModal;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  signUpModal: async ({ page }, use) => {
    await use(new SignUpModal(page));
  },
  loginModal: async ({ page }, use) => {
    await use(new LoginModal(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  orderModal: async ({ page }, use) => {
    await use(new OrderModal(page));
  },
});

export { expect } from '@playwright/test';
