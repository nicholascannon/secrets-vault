import { DisplayApiError } from '@/components/display-api-error';
import { UserFile, UserFileSkeleton } from '../../../components/user-file';
import { useGetUserFiles } from '../../../hooks/use-get-user-files';

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

      {error && <DisplayApiError error={error} />}

      {files.length === 0 && !isLoading && !error && <div>No files found</div>}
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
