import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col justify-center items-center mt-8 gap-4'>
      <h1 className='text-4xl font-bold'>404 - Page Not Found</h1>
      <p className='text-lg'>The page you are looking for does not exist.</p>
      <Button className='cursor-pointer' type='button' onClick={() => navigate('/')}>
        <ArrowLeftIcon className='w-4 h-4' /> Go to home
      </Button>
    </div>
  );
}
