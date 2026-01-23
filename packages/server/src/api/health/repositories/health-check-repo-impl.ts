import type { ClerkClient } from '@clerk/express';
import type { PrismaClient } from '../../../generated/prisma/client.js';
import { LOGGER } from '../../../lib/logger.js';
import type { HealthCheckResult, HealthRepository } from '../health-repository.js';

export class HealthCheckRepoImpl implements HealthRepository {
  constructor(
    private readonly db: PrismaClient,
    private readonly clerkClient: ClerkClient
  ) {}

  async checkHealth(): Promise<HealthCheckResult> {
    const [dbResult, clerkResult] = await Promise.all([this.checkDbHealth(), this.checkClerkHealth()]);

    return {
      isHealthy: dbResult === 'ok' && clerkResult === 'ok',
      db: dbResult,
      clerk: clerkResult,
    };
  }

  private async checkDbHealth(): Promise<'ok' | 'error'> {
    try {
      await this.db.$queryRaw`SELECT 1`;
      return 'ok';
    } catch (error) {
      LOGGER.error('DB Health Check Failed', { error });
      return 'error';
    }
  }

  private async checkClerkHealth(): Promise<'ok' | 'error'> {
    try {
      await this.clerkClient.users.getCount();
      return 'ok';
    } catch (error) {
      LOGGER.error('Clerk Health Check Failed', { error });
      return 'error';
    }
  }
}
