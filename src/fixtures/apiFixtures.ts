import { test as base } from '@playwright/test';
import { UsersApi } from '../api/UsersApi';
import { AuthApi } from '../api/AuthApi';
import { ResourcesApi } from '../api/ResourcesApi';

type ApiFixtures = {
  usersApi: UsersApi;
  authApi: AuthApi;
  resourcesApi: ResourcesApi;
};

export const test = base.extend<ApiFixtures>({
  usersApi: async ({ request }, use) => {
    await use(new UsersApi(request));
  },
  authApi: async ({ request }, use) => {
    await use(new AuthApi(request));
  },
  resourcesApi: async ({ request }, use) => {
    await use(new ResourcesApi(request));
  },
});

export { expect } from '@playwright/test';
