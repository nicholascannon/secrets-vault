import { isApiErrorResponse } from '@secrets-vault/shared';
import type { ApiError } from '@secrets-vault/shared/api/errors';
import type { FileNotFoundResponse } from '@secrets-vault/shared/api/files';
import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../ui/button';

export function DisplayApiError({ error }: { error: Error | ApiError | FileNotFoundResponse }) {
  const navigate = useNavigate();

  if (isApiErrorResponse(error) && error.error.code === 'FILE_NOT_FOUND') {
    return (
      <div className='text-center flex flex-col items-center justify-center gap-2'>
        <p>File does not exist or was deleted.</p>
        <Button className='cursor-pointer' type='button' onClick={() => navigate('/')}>
          <ArrowLeftIcon className='w-4 h-4' /> Go to home
        </Button>
      </div>
    );
  }

  return (
    <div className='text-destructive text-center'>
      <p>There was an error. Please try again later.</p>
      {isApiErrorResponse(error) && <p>Request ID: {error.meta.requestId}</p>}
    </div>
  );
}
