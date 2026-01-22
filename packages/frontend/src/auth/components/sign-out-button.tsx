import { useClerk } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';

export function SignOutButton() {
  const { signOut } = useClerk();

  return (
    <Button type='button' onClick={() => signOut({ redirectUrl: '/login' })}>
      Sign Out
    </Button>
  );
}
