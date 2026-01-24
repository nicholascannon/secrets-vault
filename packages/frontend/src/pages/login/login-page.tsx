import { SignIn } from '@clerk/clerk-react';
import { Page } from '@/components/page';

export function LoginPage() {
  return (
    <Page>
      <div className='flex justify-center items-center mt-8'>
        <SignIn routing='path' path='/login' signUpUrl='/signup' />
      </div>
    </Page>
  );
}
