import { useClerk } from '@clerk/clerk-react';
import type { VariantProps } from 'class-variance-authority';
import { Button, type buttonVariants } from '@/components/ui/button';

export function SignOutButton({ variant }: { variant?: VariantProps<typeof buttonVariants>['variant'] }) {
  const { signOut } = useClerk();

  return (
    <Button
      variant={variant}
      className='cursor-pointer'
      type='button'
      onClick={() => signOut({ redirectUrl: '/login' })}
    >
      Sign Out
    </Button>
  );
}
