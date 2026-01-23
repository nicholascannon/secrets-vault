import type { PrismaClient } from '../../../generated/prisma/client.js';
import { LOGGER } from '../../../lib/logger.js';
import type { HealthCheckResult, HealthRepository } from '../health-repository.js';

export class HealthCheckRepoImpl implements HealthRepository {
  constructor(private readonly db: PrismaClient) {}

  async checkHealth(): Promise<HealthCheckResult> {
    try {
      await this.db.$queryRaw`SELECT 1`;
      return {
        isHealthy: true,
        db: 'ok',
      };
    } catch (error) {
      LOGGER.error('DB Health Check Failed', { error });
      return {
        isHealthy: false,
        db: 'error',
      };
    }
  }
}
