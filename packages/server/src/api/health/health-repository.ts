export type HealthCheckResult = {
  isHealthy: boolean;
  db?: Error;
};

export interface HealthRepository {
  checkHealth(): Promise<HealthCheckResult>;
}
