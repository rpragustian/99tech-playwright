import { test, expect } from '../../src/fixtures/apiFixtures';

test.describe('Users API', { tag: ['@api', '@users'] }, () => {
  test('GET /api/users - list users on page 1', async ({ usersApi }) => {
    let response: Awaited<ReturnType<typeof usersApi.listUsers>>;

    await test.step('Send GET request for users list (page 1)', async () => {
      response = await usersApi.listUsers(1);
    });

    await test.step('Assert status is 200', async () => {
      expect(response!.status()).toBe(200);
    });

    await test.step('Assert response body has pagination fields', async () => {
      const body = await response!.json();
      expect(body).toHaveProperty('page', 1);
      expect(body).toHaveProperty('per_page');
      expect(body).toHaveProperty('total');
      expect(body).toHaveProperty('total_pages');
    });

    await test.step('Assert response body has data array with users', async () => {
      const body = await response!.json();
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data.length).toBeGreaterThan(0);
      expect(body.data[0]).toHaveProperty('id');
      expect(body.data[0]).toHaveProperty('email');
      expect(body.data[0]).toHaveProperty('first_name');
      expect(body.data[0]).toHaveProperty('last_name');
    });
  });

  test('GET /api/users/:id - get a single user', async ({ usersApi }) => {
    let response: Awaited<ReturnType<typeof usersApi.getUser>>;

    await test.step('Send GET request for user ID 2', async () => {
      response = await usersApi.getUser(2);
    });

    await test.step('Assert status is 200', async () => {
      expect(response!.status()).toBe(200);
    });

    await test.step('Assert response body has user data', async () => {
      const body = await response!.json();
      expect(body.data).toHaveProperty('id', 2);
      expect(body.data).toHaveProperty('email');
      expect(body.data).toHaveProperty('first_name');
      expect(body.data).toHaveProperty('last_name');
      expect(body.data).toHaveProperty('avatar');
    });
  });

  test('GET /api/users/:id - user not found returns 404', async ({ usersApi }) => {
    let response: Awaited<ReturnType<typeof usersApi.getUser>>;

    await test.step('Send GET request for non-existent user ID 999', async () => {
      response = await usersApi.getUser(999);
    });

    await test.step('Assert status is 404', async () => {
      expect(response!.status()).toBe(404);
    });

    await test.step('Assert response body is empty object', async () => {
      const body = await response!.json();
      expect(body).toEqual({});
    });
  });

  test('POST /api/users - create a new user', async ({ usersApi }) => {
    const payload = { name: 'morpheus', job: 'leader' };
    let response: Awaited<ReturnType<typeof usersApi.createUser>>;

    await test.step('Send POST request to create user', async () => {
      response = await usersApi.createUser(payload);
    });

    await test.step('Assert status is 201', async () => {
      expect(response!.status()).toBe(201);
    });

    await test.step('Assert response body has created user data', async () => {
      const body = await response!.json();
      expect(body).toHaveProperty('name', payload.name);
      expect(body).toHaveProperty('job', payload.job);
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('createdAt');
    });
  });

  test('PUT /api/users/:id - update a user', async ({ usersApi }) => {
    const payload = { name: 'morpheus', job: 'zion resident' };
    let response: Awaited<ReturnType<typeof usersApi.updateUser>>;

    await test.step('Send PUT request to update user ID 2', async () => {
      response = await usersApi.updateUser(2, payload);
    });

    await test.step('Assert status is 200', async () => {
      expect(response!.status()).toBe(200);
    });

    await test.step('Assert response body has updated data', async () => {
      const body = await response!.json();
      expect(body).toHaveProperty('name', payload.name);
      expect(body).toHaveProperty('job', payload.job);
      expect(body).toHaveProperty('updatedAt');
    });
  });

  test('PATCH /api/users/:id - partially update a user', async ({ usersApi }) => {
    const payload = { job: 'warrior' };
    let response: Awaited<ReturnType<typeof usersApi.partialUpdateUser>>;

    await test.step('Send PATCH request to partially update user ID 2', async () => {
      response = await usersApi.partialUpdateUser(2, payload);
    });

    await test.step('Assert status is 200', async () => {
      expect(response!.status()).toBe(200);
    });

    await test.step('Assert response body reflects the partial update', async () => {
      const body = await response!.json();
      expect(body).toHaveProperty('job', payload.job);
      expect(body).toHaveProperty('updatedAt');
    });
  });

  test('DELETE /api/users/:id - delete a user', async ({ usersApi }) => {
    let response: Awaited<ReturnType<typeof usersApi.deleteUser>>;

    await test.step('Send DELETE request for user ID 2', async () => {
      response = await usersApi.deleteUser(2);
    });

    await test.step('Assert status is 204 (no content)', async () => {
      expect(response!.status()).toBe(204);
    });
  });
});
