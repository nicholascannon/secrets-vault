import { AuthenticatedPage, useCurrentUser } from '@/auth';
import { UploadFile } from './components/upload-file';
import { UserFileList } from './components/user-file-list';

function HomeContent() {
  const { user } = useCurrentUser();

  if (!user) return <div>Error loading user data</div>;

  return (
    <div className='mx-8 flex flex-col gap-8'>
      <h1 className='text-4xl animate-in fade-in duration-300'>Welcome, {user.firstName ?? user.email}</h1>
      <UploadFile />
      <UserFileList />
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
