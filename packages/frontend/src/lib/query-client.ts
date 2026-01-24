import { isApiErrorResponse } from '@secrets-vault/shared';
import { QueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
    mutations: {
      onError: (error) => {
        if (isApiErrorResponse(error)) {
          toast.error(error.error.message);
        } else {
          console.error(error);
          toast.error('An unknown error occurred');
        }
      },
    },
  },
});
