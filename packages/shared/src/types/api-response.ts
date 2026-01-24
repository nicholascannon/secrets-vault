export type ApiResponse<TData> = {
  data: TData;
  meta?: {
    requestId: string;
    timestamp: string;
  };
};

export type ApiErrorResponse<TErrorCode extends string, TErrorDetails = unknown> = {
  error: {
    code: TErrorCode;
    message: string;
    details?: TErrorDetails;
  };
  meta: {
    requestId: string;
    timestamp: string;
  };
};

export function isApiResponse(response: unknown): response is ApiResponse<unknown> {
  return typeof response === 'object' && response !== null && 'data' in response && 'meta' in response;
}

export function isApiErrorResponse(error: unknown): error is ApiErrorResponse<string> {
  return typeof error === 'object' && error !== null && 'error' in error && 'meta' in error;
}
