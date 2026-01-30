import { SignUp, useSignUp } from '@clerk/clerk-react';
import { Loader } from 'lucide-react';

export function SignupPage() {
  const { isLoaded } = useSignUp();

  return (
    <div className='flex justify-center items-center mt-8'>
      {isLoaded ? (
        <SignUp routing='path' path='/signup' signInUrl='/login' />
      ) : (
        <div className='flex justify-center items-center mt-8'>
          <Loader className='animate-spin text-neutral-700' size={38} />
        </div>
      )}
    </div>
  );
}
