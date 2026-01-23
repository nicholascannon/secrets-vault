import { SignIn } from '@clerk/clerk-react';

export function LoginPage() {
  return (
    <div className='flex justify-center items-center h-screen'>
      <SignIn routing='path' path='/login' signUpUrl='/signup' />
    </div>
  );
}
