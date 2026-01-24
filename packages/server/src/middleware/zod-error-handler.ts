import type { InvalidRequestResponse } from '@secrets-vault/shared/api/errors';
import type { NextFunction, Request, Response } from 'express';
import * as z from 'zod';

// biome-ignore lint/suspicious/noExplicitAny: required to match express error handler type
export const zodErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (!(err instanceof z.ZodError)) return next(err);

  const flattened = z.flattenError(err);
  const details: Partial<Record<string, string[]>> = { ...flattened.fieldErrors };
  if (flattened.formErrors.length > 0) {
    details._form = flattened.formErrors;
  }

  return res.status(400).json<InvalidRequestResponse>({
    success: false,
    error: {
      code: 'INVALID_REQUEST',
      message: 'Invalid request',
      details,
    },
    meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
  });
};
