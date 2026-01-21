import type { HealthCheckResult, HealthRepository } from '../health-repository.js';

export class HealthCheckMemoryRepo implements HealthRepository {
  private isHealthy = true;

  async checkHealth(): Promise<HealthCheckResult> {
    return {
      isHealthy: this.isHealthy,
      db: this.isHealthy ? undefined : new Error('Database is not healthy'),
    };
  }

  setHealth(isHealthy: boolean): void {
    this.isHealthy = isHealthy;
  }
}
