import { test, expect } from '../../src/fixtures/apiFixtures';

test.describe('Auth API', { tag: ['@api', '@auth'] }, () => {
  test('POST /api/login - successful login', async ({ authApi }) => {
    let response: Awaited<ReturnType<typeof authApi.login>>;

    await test.step('Send POST login request with valid credentials', async () => {
      response = await authApi.login({
        email: 'eve.holt@reqres.in',
        password: 'cityslicka',
      });
    });

    await test.step('Assert status is 200', async () => {
      expect(response!.status()).toBe(200);
    });

    await test.step('Assert response body has token', async () => {
      const body = await response!.json();
      expect(body).toHaveProperty('token');
      expect(typeof body.token).toBe('string');
      expect(body.token.length).toBeGreaterThan(0);
    });
  });

  test('POST /api/login - missing password returns 400', async ({ authApi }) => {
    let response: Awaited<ReturnType<typeof authApi.login>>;

    await test.step('Send POST login request without password', async () => {
      response = await authApi.login({
        email: 'peter@klaven.com',
      });
    });

    await test.step('Assert status is 400', async () => {
      expect(response!.status()).toBe(400);
    });

    await test.step('Assert response body has error message', async () => {
      const body = await response!.json();
      expect(body).toHaveProperty('error', 'Missing password');
    });
  });

  test('POST /api/register - successful registration', async ({ authApi }) => {
    let response: Awaited<ReturnType<typeof authApi.register>>;

    await test.step('Send POST register request with valid credentials', async () => {
      response = await authApi.register({
        email: 'eve.holt@reqres.in',
        password: 'pistol',
      });
    });

    await test.step('Assert status is 200', async () => {
      expect(response!.status()).toBe(200);
    });

    await test.step('Assert response body has id and token', async () => {
      const body = await response!.json();
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('token');
      expect(typeof body.token).toBe('string');
    });
  });

  test('POST /api/register - missing password returns 400', async ({ authApi }) => {
    let response: Awaited<ReturnType<typeof authApi.register>>;

    await test.step('Send POST register request without password', async () => {
      response = await authApi.register({
        email: 'sydney@fife',
      });
    });

    await test.step('Assert status is 400', async () => {
      expect(response!.status()).toBe(400);
    });

    await test.step('Assert response body has error message', async () => {
      const body = await response!.json();
      expect(body).toHaveProperty('error', 'Missing password');
    });
  });
});
