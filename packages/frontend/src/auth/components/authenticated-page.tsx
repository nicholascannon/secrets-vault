import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Navigate } from 'react-router';
import { Page } from '@/components/page';

/**
 * Wraps the children in a Page component and redirects to the login page if the user is not signed in.
 */
export function AuthenticatedPage({ children, redirectUrl }: { children: React.ReactNode; redirectUrl?: string }) {
  return (
    <>
      <SignedIn>
        <Page>{children}</Page>
      </SignedIn>
      <SignedOut>
        <Navigate to={`/login${redirectUrl ? `?redirect_url=${encodeURIComponent(redirectUrl)}` : ''}`} replace />
      </SignedOut>
    </>
  );
}
