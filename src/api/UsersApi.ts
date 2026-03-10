import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from './BaseApi';

export interface CreateUserPayload {
  name: string;
  job: string;
}

export interface UpdateUserPayload {
  name?: string;
  job?: string;
}

export class UsersApi extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async listUsers(page?: number): Promise<APIResponse> {
    return this.get('/api/users', page ? { page } : undefined);
  }

  async getUser(id: number): Promise<APIResponse> {
    return this.get(`/api/users/${id}`);
  }

  async createUser(data: CreateUserPayload): Promise<APIResponse> {
    return this.post('/api/users', data);
  }

  async updateUser(id: number, data: CreateUserPayload): Promise<APIResponse> {
    return this.put(`/api/users/${id}`, data);
  }

  async partialUpdateUser(id: number, data: UpdateUserPayload): Promise<APIResponse> {
    return this.patch(`/api/users/${id}`, data);
  }

  async deleteUser(id: number): Promise<APIResponse> {
    return this.delete(`/api/users/${id}`);
  }
}
