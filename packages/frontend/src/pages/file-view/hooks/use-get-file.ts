import type { ApiError } from '@secrets-vault/shared/api/errors';
import type { GetFileResponse } from '@secrets-vault/shared/api/files';
import { useQuery } from '@tanstack/react-query';

export function useGetFile(id?: string) {
  return useQuery<GetFileResponse, Error | ApiError>({
    queryKey: ['file', id],
    queryFn: () => getFile(id ?? ''),
    enabled: !!id,
  });
}

async function getFile(id: string): Promise<GetFileResponse> {
  const response = await fetch(`/api/v1/files/${id}`);
  if (!response.ok) throw await response.json();
  return response.json();
}
