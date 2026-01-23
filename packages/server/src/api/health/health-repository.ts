export type HealthCheckResult = {
  isHealthy: boolean;
  db: 'ok' | 'error';
};

export interface HealthRepository {
  checkHealth(): Promise<HealthCheckResult>;
}
