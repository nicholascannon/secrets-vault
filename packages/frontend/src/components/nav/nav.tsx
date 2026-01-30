import { SignedIn, UserButton } from '@clerk/clerk-react';

export function Nav() {
  return (
    <nav className='flex items-center justify-between py-6 px-8'>
      <h1 className='text-2xl font-bold'>Secrets Vault</h1>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </nav>
  );
}
