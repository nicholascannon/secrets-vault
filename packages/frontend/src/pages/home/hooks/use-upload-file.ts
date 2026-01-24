import type { ApiError } from '@secrets-vault/shared/api/errors';
import type { AddFileResponse, FileAlreadyExistsResponse } from '@secrets-vault/shared/api/files';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation<AddFileResponse, ApiError | FileAlreadyExistsResponse, File>({
    mutationFn: (file: File) => uploadFile(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-files'] });
      toast.success('File uploaded successfully');
    },
    onError: (error) => {
      if (!error.success) {
        toast.error(error.error.message);
      }
    },
  });
}

async function uploadFile(file: File) {
  const response = await fetch('/api/v1/files', {
    method: 'POST',
    body: JSON.stringify({ name: file.name, content: await file.text() }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw await response.json();
  return response.json();
}
