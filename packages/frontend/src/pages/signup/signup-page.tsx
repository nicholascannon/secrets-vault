import { SignUp } from '@clerk/clerk-react';

export function SignupPage() {
  return (
    <div className='flex justify-center items-center h-screen'>
      <SignUp routing='path' path='/signup' signInUrl='/login' />
    </div>
  );
}
