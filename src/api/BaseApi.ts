import { APIRequestContext, APIResponse } from '@playwright/test';

export abstract class BaseApi {
  protected readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor(protected readonly request: APIRequestContext) {
    this.baseUrl = process.env.API_BASE_URL ?? 'https://reqres.in';
    this.headers = {
      'x-api-key': process.env.API_KEY ?? '',
      'Content-Type': 'application/json',
    };
  }

  protected async get(path: string, params?: Record<string, string | number>): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}${path}`, { headers: this.headers, params });
  }

  protected async post(path: string, data: object): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}${path}`, { headers: this.headers, data });
  }

  protected async put(path: string, data: object): Promise<APIResponse> {
    return this.request.put(`${this.baseUrl}${path}`, { headers: this.headers, data });
  }

  protected async patch(path: string, data: object): Promise<APIResponse> {
    return this.request.patch(`${this.baseUrl}${path}`, { headers: this.headers, data });
  }

  protected async delete(path: string): Promise<APIResponse> {
    return this.request.delete(`${this.baseUrl}${path}`, { headers: this.headers });
  }
}
