import type { File } from '@secrets-vault/shared/api/files';
import { ChevronDownIcon, ChevronRightIcon, CopyIcon, FileIcon, Loader2, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeleteFile } from '../hooks/use-delete-file';

export function UserFile({ file }: { file: File }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutate: deleteFile, isPending } = useDeleteFile();

  const onCopy = () => {
    navigator.clipboard.writeText(file.content);
    toast.info('Copied to clipboard');
  };

  const ExpandButton = () => (
    <Button className='cursor-pointer' type='button' variant='ghost' onClick={() => setIsExpanded(!isExpanded)}>
      {isExpanded ? <ChevronDownIcon className='w-4 h-4' /> : <ChevronRightIcon className='w-4 h-4' />}
    </Button>
  );

  const DeleteButton = () => (
    <Button
      type='button'
      className='text-destructive hover:text-destructive/80 cursor-pointer'
      variant='ghost'
      onClick={() => deleteFile(file.id)}
      disabled={isPending}
    >
      {isPending ? <Loader2 className='w-4 h-4 animate-spin' /> : <TrashIcon className='w-4 h-4 ' />}
    </Button>
  );

  return (
    <div className='flex flex-col border rounded-md p-2 gap-4 bg-card'>
      <div className='flex items-center justify-between gap-2 font-bold'>
        <span className='flex items-center gap-2'>
          <ExpandButton />

          <FileIcon className='w-4 h-4' />

          {file.name}
        </span>

        <DeleteButton />
      </div>

      {isExpanded && (
        <pre className='relative text-sm bg-accent p-2 rounded-sm'>
          <Button onClick={onCopy} type='button' className='absolute top-2 right-2 cursor-pointer'>
            <CopyIcon className='w-4 h-4' />
          </Button>

          <code className='whitespace-pre-wrap wrap-break-word'>{file.content}</code>
        </pre>
      )}
    </div>
  );
}

export function UserFileSkeleton() {
  return (
    <div className='flex flex-col border rounded-md p-4 gap-2 bg-card'>
      <div className='flex items-center justify-between gap-2 font-bold'>
        <span className='flex items-center gap-2'>
          <Skeleton className='h-5 w-24' />
        </span>
      </div>
    </div>
  );
}
