import { ArrowLeftIcon } from 'lucide-react';
import { isRouteErrorResponse, useRouteError } from 'react-router';
import { Button } from '@/components/ui/button';

export function RouteErrorPage() {
  const error = useRouteError();
  const isRouteError = isRouteErrorResponse(error);

  const message = isRouteError
    ? error.statusText || `${error.status}`
    : error instanceof Error
      ? error.message
      : 'Something went wrong';

  return (
    <div className='flex flex-col justify-center items-center mt-8 gap-4'>
      <h1 className='text-4xl font-bold'>Something went wrong</h1>
      <p className='text-lg text-muted-foreground max-w-md text-center'>{message}</p>
      <Button className='cursor-pointer' type='button' onClick={() => window.location.assign('/')}>
        <ArrowLeftIcon className='w-4 h-4' /> Go to home
      </Button>
    </div>
  );
}
