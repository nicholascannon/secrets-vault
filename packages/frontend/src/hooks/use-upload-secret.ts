import type { ApiError } from '@secrets-vault/shared/api/errors';
import type { AddFileResponse, AddFileSchema, FileAlreadyExistsResponse } from '@secrets-vault/shared/api/files';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

/**
 * This is the same as use-upload-file.ts, but for doesn't pull data from a
 * File object, instead allows a name and value to be passed in.
 *
 * TODO: should refactor to just one mutation to handle both of these cases.
 */
export function useUploadSecret() {
  const queryClient = useQueryClient();

  return useMutation<AddFileResponse, ApiError | FileAlreadyExistsResponse, AddFileSchema>({
    mutationFn: (data: AddFileSchema) => uploadSecret(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-files'] });
      toast.success('File uploaded successfully');
    },
  });
}

async function uploadSecret(data: AddFileSchema) {
  const response = await fetch('/api/v1/files', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw await response.json();
  return response.json();
}
