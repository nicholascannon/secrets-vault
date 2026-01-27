import type { File } from '@secrets-vault/shared/api/files';
import { ChevronDownIcon, ChevronRightIcon, CopyIcon, FileIcon, Loader2, ShareIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeleteFile } from '@/hooks/use-delete-file';
import { useGetShareLink } from '@/hooks/use-get-share-link';

export function UserFile({
  file,
  canExpand = true,
  defaultExpanded = false,
  onDelete,
  isShared = false,
}: {
  file: File;
  canExpand?: boolean;
  defaultExpanded?: boolean;
  isShared?: boolean;
  onDelete?: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { mutate: deleteFile, isPending } = useDeleteFile();
  const { mutate: getShareLink, isPending: isGettingShareLink } = useGetShareLink();

  const onCopy = () => {
    navigator.clipboard.writeText(file.content);
    toast.info('Copied to clipboard');
  };

  const ExpandButton = () => (
    <Button className='cursor-pointer' type='button' variant='ghost' onClick={() => setIsExpanded(!isExpanded)}>
      {isExpanded ? <ChevronDownIcon className='w-4 h-4' /> : <ChevronRightIcon className='w-4 h-4' />}
    </Button>
  );

  const ShareButton = () => (
    <Button className='cursor-pointer' type='button' variant='ghost' onClick={() => getShareLink(file.id)}>
      {isGettingShareLink ? <Loader2 className='w-4 h-4 animate-spin' /> : <ShareIcon className='w-4 h-4' />}
    </Button>
  );

  const DeleteButton = () => (
    <Button
      type='button'
      className='text-destructive hover:text-destructive/80 cursor-pointer'
      variant='ghost'
      onClick={() => deleteFile(file.id, { onSuccess: onDelete })}
      disabled={isPending}
    >
      {isPending ? <Loader2 className='w-4 h-4 animate-spin' /> : <TrashIcon className='w-4 h-4 ' />}
    </Button>
  );

  return (
    <div className='flex flex-col border rounded-md p-2 gap-4 bg-card'>
      <div className='flex items-center justify-between gap-2 font-bold'>
        <span className='flex items-center gap-2'>
          {canExpand && <ExpandButton />}

          <Link className='flex items-center gap-2 hover:underline' to={`/file/${file.id}`}>
            <FileIcon className='w-4 h-4' />

            {file.name}
          </Link>
        </span>

        {/* Don't display these options is we are viewing a shared file */}
        {!isShared && (
          <div className='flex items-center gap-2'>
            <ShareButton />
            <DeleteButton />
          </div>
        )}
      </div>

      {isExpanded && (
        <pre className='relative text-sm bg-accent p-2 rounded-sm min-h-[50px]'>
          <Button onClick={onCopy} type='button' className='absolute top-2 right-2 cursor-pointer'>
            <CopyIcon className='w-4 h-4' />
          </Button>

          <code className='whitespace-pre-wrap wrap-break-word'>{file.content}</code>
        </pre>
      )}
    </div>
  );
}

export function UserFileSkeleton({ isExpanded = false }: { isExpanded?: boolean }) {
  return (
    <div className='flex flex-col border rounded-md p-4 gap-2 bg-card'>
      <div className='flex items-center justify-between gap-2 font-bold'>
        <span className='flex items-center gap-2'>
          <Skeleton className='h-5 w-24' />
        </span>
      </div>

      {isExpanded && (
        <pre className='relative text-sm bg-accent p-2 rounded-sm min-h-[50px]'>
          <Skeleton className='h-5 w-full' />
        </pre>
      )}
    </div>
  );
}
