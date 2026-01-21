/** biome-ignore-all lint/suspicious/noExplicitAny: because */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as z from 'zod';
import { zodErrorHandler } from '../zod-error-handler.js';

describe('zodErrorHandler middleware', () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      requestId: 'test-request-id',
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
  });

  it('should handle ZodError and respond with 400 and issues', () => {
    const zodError = new z.ZodError([
      {
        code: 'invalid_type',
        input: 123,
        path: ['foo'],
        message: 'Required',
        expected: 'string',
      },
    ]);

    zodErrorHandler(zodError, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: 'INVALID_REQUEST',
          message: 'Invalid request',
          details: expect.any(Object),
        }),
        meta: expect.objectContaining({
          requestId: 'test-request-id',
          timestamp: expect.any(String),
        }),
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if error is not a ZodError', () => {
    const error = new Error('Some other error');

    zodErrorHandler(error, req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
