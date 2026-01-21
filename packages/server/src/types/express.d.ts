import type { ApiResponse } from '@secrets-vault/shared';

declare module 'express' {
  // Override the json method to force the shared ApiResponse type
  interface Response {
    json: <Body extends ApiResponse<unknown, unknown>>(body: Body) => this;
  }
}
