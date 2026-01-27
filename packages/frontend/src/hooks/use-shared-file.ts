import type { ApiError } from '@secrets-vault/shared/api/errors';
import type { GetFileResponse } from '@secrets-vault/shared/api/files';
import { useQuery } from '@tanstack/react-query';

export function useSharedFile(id?: string, code?: string) {
  return useQuery<GetFileResponse, Error | ApiError>({
    queryKey: ['shared-file', id, code],
    queryFn: () => getSharedFile(id ?? '', code ?? ''),
    enabled: !!id && !!code,
  });
}

async function getSharedFile(id: string, code: string) {
  const response = await fetch(`/api/v1/files/${id}/share?code=${code}`);
  if (!response.ok) throw await response.json();
  return response.json();
}
