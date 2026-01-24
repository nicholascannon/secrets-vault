import { useGetUserFiles } from '../hooks/use-get-user-files';
import { UserFile, UserFileSkeleton } from './user-file';

export function UserFileList() {
  const { data, isLoading, error } = useGetUserFiles();

  const files = data?.data?.files ?? [];

  return (
    <div className='flex flex-col items-center'>
      {isLoading && (
        <ul className='w-full flex flex-col gap-4'>
          <UserFileSkeleton />
          <UserFileSkeleton />
        </ul>
      )}

      {error && <div>Error loading files</div>}

      {files.length === 0 && !isLoading && <div>No files found</div>}
      {files.length > 0 && (
        <ul className='w-full flex flex-col gap-4'>
          {files.map((file) => (
            <li key={file.id}>
              <UserFile file={file} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
