import { useUser } from '@clerk/clerk-react';
import type { User } from '@secrets-vault/shared';

export function useCurrentUser(): { user?: User; isLoading: boolean } {
  const { isLoaded, user } = useUser();

  return {
    isLoading: !isLoaded,
    user: user
      ? {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          firstName: user.firstName ?? undefined,
          lastName: user.lastName ?? undefined,
          imageUrl: user.imageUrl ?? undefined,
          createdAt: user.createdAt ?? undefined,
          updatedAt: user.updatedAt ?? undefined,
        }
      : undefined,
  };
}
