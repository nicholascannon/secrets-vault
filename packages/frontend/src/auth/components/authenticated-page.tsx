import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import { Loader } from 'lucide-react';
import { Navigate } from 'react-router';
import { Page } from '@/components/page';

/**
 * Wraps the children in a Page component and redirects to the login page if the user is not signed in.
 */
export function AuthenticatedPage({ children, redirectUrl }: { children: React.ReactNode; redirectUrl?: string }) {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <main className='flex justify-center items-center h-screen'>
        <Loader className='animate-spin text-neutral-700' size={38} />
      </main>
    );
  }

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
