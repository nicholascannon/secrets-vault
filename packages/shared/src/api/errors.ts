import type { ApiErrorResponse } from '../types/api-response.js';

export type TooManyRequestsResponse = ApiErrorResponse<'TOO_MANY_REQUESTS'>;

export type NotFoundResponse = ApiErrorResponse<
  'NOT_FOUND',
  {
    path: string;
    method: string;
  }
>;

export type InvalidRequestBodyResponse = ApiErrorResponse<'INVALID_REQUEST_BODY'>;

export type RequestBodyTooLargeResponse = ApiErrorResponse<'REQUEST_BODY_TOO_LARGE'>;

export type InternalServerErrorResponse = ApiErrorResponse<'INTERNAL_SERVER_ERROR'>;

export type InvalidRequestResponse = ApiErrorResponse<'INVALID_REQUEST', Partial<Record<string, string[]>>>;

export type RequestTimeoutResponse = ApiErrorResponse<
  'REQUEST_TIMEOUT',
  {
    path: string;
    method: string;
  }
>;

export type UnauthorizedResponse = ApiErrorResponse<'UNAUTHORIZED'>;

export type ApiError =
  | TooManyRequestsResponse
  | NotFoundResponse
  | InvalidRequestBodyResponse
  | RequestBodyTooLargeResponse
  | InternalServerErrorResponse
  | InvalidRequestResponse
  | RequestTimeoutResponse
  | UnauthorizedResponse;
