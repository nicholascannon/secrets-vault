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

export function isApiErrorResponse<TCode extends string>(error: unknown, code: TCode): error is ApiErrorResponse<TCode>;
export function isApiErrorResponse(error: unknown): error is ApiErrorResponse<string>;
export function isApiErrorResponse<TCode extends string>(
  error: unknown,
  code?: TCode
): error is ApiErrorResponse<TCode> {
  const isError = typeof error === 'object' && error !== null && 'error' in error && 'meta' in error;
  if (!isError) return false;
  if (code === undefined) return true;
  return (error as ApiErrorResponse<string>).error.code === code;
}
