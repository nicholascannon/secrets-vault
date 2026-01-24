import type { ApiError } from '@secrets-vault/shared/api/errors';
import type { DeleteFileResponse, FileNotFoundResponse } from '@secrets-vault/shared/api/files';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation<DeleteFileResponse, ApiError | FileNotFoundResponse, string>({
    mutationFn: deleteFile,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['user-files'] });
      toast.success(`File ${response.data?.name} deleted successfully`);
    },
    onError: (error) => {
      if (!error.success) {
        toast.error(error.error.message);
      }
    },
  });
}

async function deleteFile(id: string) {
  const response = await fetch(`/api/v1/files/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw await response.json();
  return response.json();
}
