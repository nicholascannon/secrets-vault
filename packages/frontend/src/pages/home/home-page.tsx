import { useCurrentUser } from '@/auth';
import { UploadDialog } from './components/upload-dialog';
import { UploadFile } from './components/upload-file';
import { UserFileList } from './components/user-file-list';

export function HomePage() {
  const { user } = useCurrentUser();

  if (!user) return <div>Error loading user data</div>;

  return (
    <section className='mx-8 flex flex-col gap-8'>
      <h1 className='text-4xl animate-in fade-in duration-300'>Welcome, {user.firstName ?? user.email}</h1>

      <div className='flex flex-col gap-2'>
        <UploadDialog />
        <UploadFile />
      </div>

      <UserFileList />
    </section>
  );
}
