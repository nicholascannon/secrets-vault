import { SignIn } from '@clerk/clerk-react';

export function LoginPage() {
  return (
    // TODO: replace with tailwind
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <SignIn routing='path' path='/login' signUpUrl='/signup' />
    </div>
  );
}
