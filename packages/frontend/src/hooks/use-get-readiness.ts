import type { HealthReadinessResponse } from '@secrets-vault/shared/api/health';
import { useQuery } from '@tanstack/react-query';

export function useGetReadiness() {
  return useQuery({
    queryKey: ['readiness'],
    queryFn: () => getHealthReadiness(),
    staleTime: Infinity,
  });
}

async function getHealthReadiness(): Promise<HealthReadinessResponse> {
  const response = await fetch('/api/v1/health/ready');
  if (!response.ok) throw await response.json();
  return response.json() as Promise<HealthReadinessResponse>;
}
