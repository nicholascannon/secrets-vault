import type { ApiError } from '@secrets-vault/shared/api/errors';
import type { FileNotFoundResponse, GenerateShareLinkResponse } from '@secrets-vault/shared/api/files';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export function useGetShareLink() {
  return useMutation<GenerateShareLinkResponse, ApiError | FileNotFoundResponse, string>({
    mutationFn: getShareLink,
    onSuccess: (response) => {
      const params = new URLSearchParams({ code: response.data.code });
      navigator.clipboard.writeText(`${window.location.origin}/file/${response.data.id}/share?${params}`);
      toast.success('Share link copied to clipboard');
    },
  });
}

async function getShareLink(id: string) {
  const response = await fetch(`/api/v1/files/${id}/share`, {
    method: 'POST',
  });
  if (!response.ok) throw await response.json();
  return response.json();
}
