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
