import { AuthenticatedPage, useCurrentUser } from '@/auth';

function HomeContent() {
  const { user } = useCurrentUser();
  if (!user) return <div>Error loading user data</div>;

  return (
    <div className='mx-16'>
      <h1 className='text-4xl animate-in fade-in duration-300'>Welcome, {user.firstName ?? user.email}</h1>
    </div>
  );
}

export function HomePage() {
  return (
    <AuthenticatedPage>
      <HomeContent />
    </AuthenticatedPage>
  );
}
