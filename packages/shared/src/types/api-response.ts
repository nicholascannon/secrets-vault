export type ApiResponse<TData, TErrorCode extends string, TErrorDetails = unknown> =
  | {
      // Error response
      success: false;
      data?: TData;
      error: {
        code: TErrorCode;
        message: string;
        details?: TErrorDetails;
      };
      meta: {
        requestId: string;
        timestamp: string;
      };
    }
  | {
      // Success response
      success: true;
      data: TData;
      meta?: {
        requestId: string;
        timestamp: string;
      };
    };

// TODO: finish this refactor
// export type ApiErrorResponse<TErrorCode extends string, TErrorDetails = unknown> = {
//   success: false;
//   error: {
//     code: TErrorCode;
//     message: string;
//     details?: TErrorDetails;
//   };
//   meta: {
//     requestId: string;
//     timestamp: string;
//   };
// };
