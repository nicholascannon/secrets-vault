import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import { Loader } from 'lucide-react';
import { Navigate, Outlet, useLocation } from 'react-router';

export function RequireAuth() {
  const { isLoaded } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader className='animate-spin text-neutral-700' size={38} />
      </div>
    );
  }

  return (
    <>
      <SignedIn>
        <Outlet />
      </SignedIn>
      <SignedOut>
        <Navigate to={`/login?redirect_url=${encodeURIComponent(location.pathname)}`} replace />
      </SignedOut>
    </>
  );
}
