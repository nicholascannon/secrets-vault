import { useClerk } from '@clerk/clerk-react';

export function SignOutButton() {
  const { signOut } = useClerk();

  return (
    <button type='button' onClick={() => signOut({ redirectUrl: '/login' })}>
      Sign Out
    </button>
  );
}
