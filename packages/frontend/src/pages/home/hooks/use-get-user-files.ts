import type { ApiError } from '@secrets-vault/shared/api/errors';
import type { GetUserFilesResponse } from '@secrets-vault/shared/api/files';
import { useQuery } from '@tanstack/react-query';

export function useGetUserFiles() {
  return useQuery<GetUserFilesResponse, ApiError>({
    queryKey: ['user-files'],
    queryFn: () => getUserFiles(),
  });
}

async function getUserFiles() {
  const response = await fetch('/api/v1/files');
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  return response.json();
}
