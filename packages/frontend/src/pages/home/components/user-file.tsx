import type { File } from '@secrets-vault/shared/api/files';
import { CopyIcon, FileIcon, Loader2, TrashIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeleteFile } from '../hooks/use-delete-file';

export function UserFile({ file }: { file: File }) {
  const { mutate: deleteFile, isPending } = useDeleteFile();

  const onCopy = () => {
    navigator.clipboard.writeText(file.content);
    toast.info('Copied to clipboard');
  };

  return (
    <div className='flex flex-col border rounded-md p-4 gap-2 bg-card'>
      <div className='flex items-center justify-between gap-2 font-bold border-b pb-2'>
        <span className='flex items-center gap-2'>
          <FileIcon className='w-4 h-4' />
          {file.name}
        </span>

        <button
          type='button'
          className='text-destructive hover:text-destructive/80 cursor-pointer'
          onClick={() => deleteFile(file.id)}
          disabled={isPending}
        >
          {isPending ? <Loader2 className='w-4 h-4 animate-spin' /> : <TrashIcon className='w-4 h-4 ' />}
        </button>
      </div>

      <pre className='relative text-sm bg-accent p-2 rounded-sm'>
        <button onClick={onCopy} type='button' className='absolute top-2 right-2 cursor-pointer hover:text-primary/80'>
          <CopyIcon className='w-4 h-4' />
        </button>

        <code>{file.content}</code>
      </pre>
    </div>
  );
}

export function UserFileSkeleton() {
  return (
    <div className='flex flex-col border rounded-md p-4 gap-2 bg-card'>
      <div className='flex items-center justify-between gap-2 font-bold border-b pb-2'>
        <span className='flex items-center gap-2'>
          <Skeleton className='h-5 w-24' />
        </span>
      </div>

      <div className='relative text-sm bg-accent p-2 rounded-sm flex flex-col gap-2'>
        <Skeleton className='w-full h-4 rounded-sm' />
      </div>
    </div>
  );
}
