import type { ApiResponse } from '../types/api-response.js';

export type TooManyRequestsResponse = ApiResponse<never, 'TOO_MANY_REQUESTS'>;

export type NotFoundResponse = ApiResponse<
  never,
  'NOT_FOUND',
  {
    path: string;
    method: string;
  }
>;

export type InvalidRequestBodyResponse = ApiResponse<never, 'INVALID_REQUEST_BODY'>;

export type RequestBodyTooLargeResponse = ApiResponse<never, 'REQUEST_BODY_TOO_LARGE'>;

export type InternalServerErrorResponse = ApiResponse<never, 'INTERNAL_SERVER_ERROR'>;

export type InvalidRequestResponse = ApiResponse<never, 'INVALID_REQUEST', Partial<Record<string, string[]>>>;

export type RequestTimeoutResponse = ApiResponse<
  never,
  'REQUEST_TIMEOUT',
  {
    path: string;
    method: string;
  }
>;
