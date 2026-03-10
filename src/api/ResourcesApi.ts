import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from './BaseApi';

export class ResourcesApi extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async listResources(page?: number): Promise<APIResponse> {
    return this.get('/api/unknown', page ? { page } : undefined);
  }

  async getResource(id: number): Promise<APIResponse> {
    return this.get(`/api/unknown/${id}`);
  }
}
