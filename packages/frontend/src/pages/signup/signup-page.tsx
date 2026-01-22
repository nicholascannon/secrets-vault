import { SignUp } from '@clerk/clerk-react';

export function SignupPage() {
  return (
    // TODO: replace with tailwind
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <SignUp routing='path' path='/signup' signInUrl='/login' />
    </div>
  );
}
