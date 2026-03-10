import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from './BaseApi';

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  email: string;
  password?: string;
}

export class AuthApi extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async login(data: LoginPayload): Promise<APIResponse> {
    return this.post('/api/login', data);
  }

  async register(data: RegisterPayload): Promise<APIResponse> {
    return this.post('/api/register', data);
  }
}
