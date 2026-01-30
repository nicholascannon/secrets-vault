import { SignIn, useSignIn } from '@clerk/clerk-react';
import { Loader } from 'lucide-react';
import { Page } from '@/components/page';

export function LoginPage() {
  const { isLoaded } = useSignIn();
  return (
    <Page>
      <div className='flex justify-center items-center mt-8'>
        {isLoaded ? (
          <SignIn routing='path' path='/login' signUpUrl='/signup' />
        ) : (
          <div className='flex justify-center items-center mt-8'>
            <Loader className='animate-spin text-neutral-700' size={38} />
          </div>
        )}
      </div>
    </Page>
  );
}
