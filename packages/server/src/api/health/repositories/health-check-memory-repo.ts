import type { HealthCheckResult, HealthRepository } from '../health-repository.js';

export class HealthCheckMemoryRepo implements HealthRepository {
  private dbHealthy = true;
  private clerkHealthy = true;

  async checkHealth(): Promise<HealthCheckResult> {
    const isHealthy = this.dbHealthy && this.clerkHealthy;
    return {
      isHealthy,
      db: this.dbHealthy ? 'ok' : 'error',
      clerk: this.clerkHealthy ? 'ok' : 'error',
    };
  }

  setHealth(isHealthy: boolean): void {
    this.dbHealthy = isHealthy;
    this.clerkHealthy = isHealthy;
  }

  setDbHealth(isHealthy: boolean): void {
    this.dbHealthy = isHealthy;
  }

  setClerkHealth(isHealthy: boolean): void {
    this.clerkHealthy = isHealthy;
  }
}
