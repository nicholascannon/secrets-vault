import { SignUp } from '@clerk/clerk-react';
import { Page } from '@/components/page';

export function SignupPage() {
  return (
    <Page>
      <div className='flex justify-center items-center mt-8'>
        <SignUp routing='path' path='/signup' signInUrl='/login' />
      </div>
    </Page>
  );
}
