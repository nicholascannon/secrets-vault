import { AuthenticatedPage, SignOutButton, useCurrentUser } from '@/auth';

function AuthenticatedHome() {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <div>Error loading user data</div>;
  }

  return (
    <div>
      {user.imageUrl && (
        <img src={user.imageUrl} alt='Profile' style={{ width: 64, height: 64, borderRadius: '50%' }} />
      )}
      <h1>Welcome, {user.firstName ?? user.email}</h1>
      <p>Email: {user.email}</p>
      {user.firstName && <p>First Name: {user.firstName}</p>}
      {user.lastName && <p>Last Name: {user.lastName}</p>}
      {user.createdAt && <p>Created At: {user.createdAt.toLocaleDateString()}</p>}
      {user.updatedAt && <p>Updated At: {user.updatedAt.toLocaleDateString()}</p>}

      <SignOutButton />
    </div>
  );
}

export function HomePage() {
  return (
    <AuthenticatedPage>
      <AuthenticatedHome />
    </AuthenticatedPage>
  );
}
