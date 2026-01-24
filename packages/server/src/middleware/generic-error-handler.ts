import type {
  InternalServerErrorResponse,
  InvalidRequestBodyResponse,
  RequestBodyTooLargeResponse,
  UnauthorizedResponse,
} from '@secrets-vault/shared/api/errors';
import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../lib/errors.js';
import { LOGGER } from '../lib/logger.js';

// biome-ignore lint/suspicious/noExplicitAny: required to match express error handler type
export const genericErrorHandler = (error: any, req: Request, res: Response, _next: NextFunction) => {
  // We don't care about logging unauthorized errors
  if (error instanceof UnauthorizedError) {
    return res.status(401).json<UnauthorizedResponse>({
      error: {
        code: 'UNAUTHORIZED',
        message: error.message,
      },
      meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
    });
  }

  if (typeof error === 'object') {
    error.requestId = req.requestId;
    LOGGER.error('Error', error);
  } else {
    LOGGER.error('Error', { error, requestId: req.requestId });
  }

  if ('type' in error && error.type === 'entity.parse.failed') {
    return res.status(400).json<InvalidRequestBodyResponse>({
      error: {
        code: 'INVALID_REQUEST_BODY',
        message: 'Invalid request body',
      },
      meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
    });
  }
  if ('type' in error && error.type === 'entity.too.large') {
    return res.status(413).json<RequestBodyTooLargeResponse>({
      error: {
        code: 'REQUEST_BODY_TOO_LARGE',
        message: 'Request body too large',
      },
      meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
    });
  }

  return res.status(500).json<InternalServerErrorResponse>({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
    },
    meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
  });
};
