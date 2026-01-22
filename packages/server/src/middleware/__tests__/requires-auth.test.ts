/** biome-ignore-all lint/suspicious/noExplicitAny: testing */
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { UnauthorizedError } from '../../lib/errors.js';
import { getUserId, requiresAuth } from '../requires-auth.js';

const mockGetAuth = vi.fn();

vi.mock('@clerk/express', () => ({
  getAuth: (req: any) => mockGetAuth(req),
}));

describe('requiresAuth middleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReq = { headers: {} };
    mockRes = {};
    mockNext = vi.fn();
  });

  it('should set req.userId and call next when authenticated', () => {
    mockGetAuth.mockReturnValue({ userId: 'user_123' });

    requiresAuth(mockReq, mockRes, mockNext);

    expect(mockReq.userId).toBe('user_123');
    expect(mockNext).toHaveBeenCalled();
  });

  it('should call next with UnauthorizedError when userId is null', () => {
    mockGetAuth.mockReturnValue({ userId: null });

    requiresAuth(mockReq, mockRes, mockNext);

    expect(mockReq.userId).toBeUndefined();
    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it('should call next with UnauthorizedError when userId is undefined', () => {
    mockGetAuth.mockReturnValue({});

    requiresAuth(mockReq, mockRes, mockNext);

    expect(mockReq.userId).toBeUndefined();
    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });
});

describe('getUserId helper', () => {
  it('should return userId when present on request', () => {
    const req: any = { userId: 'user_456' };

    const result = getUserId(req);

    expect(result).toBe('user_456');
  });

  it('should throw UnauthorizedError when userId is undefined', () => {
    const req: any = {};

    expect(() => getUserId(req)).toThrow(UnauthorizedError);
  });

  it('should throw UnauthorizedError when userId is empty string', () => {
    const req: any = { userId: '' };

    expect(() => getUserId(req)).toThrow(UnauthorizedError);
  });
});
