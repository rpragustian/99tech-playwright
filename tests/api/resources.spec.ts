import { test, expect } from '../../src/fixtures/apiFixtures';

test.describe('Resources API', { tag: ['@api', '@resources'] }, () => {
  test('GET /api/unknown - list all resources', async ({ resourcesApi }) => {
    let response: Awaited<ReturnType<typeof resourcesApi.listResources>>;

    await test.step('Send GET request for resources list', async () => {
      response = await resourcesApi.listResources();
    });

    await test.step('Assert status is 200', async () => {
      expect(response!.status()).toBe(200);
    });

    await test.step('Assert response body has pagination fields', async () => {
      const body = await response!.json();
      expect(body).toHaveProperty('page');
      expect(body).toHaveProperty('per_page');
      expect(body).toHaveProperty('total');
      expect(body).toHaveProperty('total_pages');
    });

    await test.step('Assert response body has data array with resources', async () => {
      const body = await response!.json();
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data.length).toBeGreaterThan(0);
      expect(body.data[0]).toHaveProperty('id');
      expect(body.data[0]).toHaveProperty('name');
      expect(body.data[0]).toHaveProperty('year');
      expect(body.data[0]).toHaveProperty('color');
      expect(body.data[0]).toHaveProperty('pantone_value');
    });
  });

  test('GET /api/unknown - list resources on page 2', async ({ resourcesApi }) => {
    let response: Awaited<ReturnType<typeof resourcesApi.listResources>>;

    await test.step('Send GET request for resources list (page 2)', async () => {
      response = await resourcesApi.listResources(2);
    });

    await test.step('Assert status is 200', async () => {
      expect(response!.status()).toBe(200);
    });

    await test.step('Assert response is page 2', async () => {
      const body = await response!.json();
      expect(body).toHaveProperty('page', 2);
      expect(Array.isArray(body.data)).toBe(true);
    });
  });

  test('GET /api/unknown/:id - get a single resource', async ({ resourcesApi }) => {
    let response: Awaited<ReturnType<typeof resourcesApi.getResource>>;

    await test.step('Send GET request for resource ID 2', async () => {
      response = await resourcesApi.getResource(2);
    });

    await test.step('Assert status is 200', async () => {
      expect(response!.status()).toBe(200);
    });

    await test.step('Assert response body has resource data', async () => {
      const body = await response!.json();
      expect(body.data).toHaveProperty('id', 2);
      expect(body.data).toHaveProperty('name');
      expect(body.data).toHaveProperty('year');
      expect(body.data).toHaveProperty('color');
      expect(body.data).toHaveProperty('pantone_value');
    });
  });

  test('GET /api/unknown/:id - resource not found returns 404', async ({ resourcesApi }) => {
    let response: Awaited<ReturnType<typeof resourcesApi.getResource>>;

    await test.step('Send GET request for non-existent resource ID 999', async () => {
      response = await resourcesApi.getResource(999);
    });

    await test.step('Assert status is 404', async () => {
      expect(response!.status()).toBe(404);
    });

    await test.step('Assert response body is empty object', async () => {
      const body = await response!.json();
      expect(body).toEqual({});
    });
  });
});
