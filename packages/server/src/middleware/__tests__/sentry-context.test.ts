/** biome-ignore-all lint/suspicious/noExplicitAny: testing */

import * as Sentry from '@sentry/node';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sentryContextMiddleware } from '../sentry-context.js';

vi.mock('@sentry/node', () => ({
  setContext: vi.fn(),
}));

describe('sentryContextMiddleware', () => {
  const mockNext = vi.fn();

  beforeEach(() => {
    mockNext.mockClear();
    vi.mocked(Sentry.setContext).mockClear();
  });

  it('should call next and set Sentry context with request data', () => {
    const req: any = {
      method: 'GET',
      url: '/test',
      headers: { 'content-type': 'application/json' },
      query: { foo: 'bar' },
      requestId: 'test-request-id',
    };
    const res: any = {};

    sentryContextMiddleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledOnce();
    expect(Sentry.setContext).toHaveBeenCalledWith('request', {
      method: 'GET',
      url: '/test',
      headers: { 'content-type': 'application/json' },
      query: { foo: 'bar' },
      requestId: 'test-request-id',
    });
  });
});
