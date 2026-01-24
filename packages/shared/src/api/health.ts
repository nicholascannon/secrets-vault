import type { ApiResponse } from '../types/api-response.js';

export type HealthReadinessResponse = ApiResponse<{
  version: string;
  db: 'ok' | 'error';
  clerk: 'ok' | 'error';
}>;

export type HealthLivenessResponse = ApiResponse<{ version: string; message: 'ok' }>;
