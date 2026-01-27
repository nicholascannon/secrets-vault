import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUploadFile } from '../../../hooks/use-upload-file';

export function UploadFile() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadFile, isPending } = useUploadFile();
  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = (file: File | undefined) => {
    if (!file) return;
    uploadFile(file, {
      onSettled: () => {
        // reset input value
        if (inputRef.current) inputRef.current.value = '';
      },
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleUpload(file);
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: drag-and-drop zone requires handlers on container
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn('transition-colors', isDragging && 'opacity-70')}
    >
      <input
        ref={inputRef}
        type='file'
        className='hidden'
        disabled={isPending}
        onChange={(e) => handleUpload(e.target.files?.[0])}
      />
      <Button
        className='cursor-pointer w-full'
        variant='outline'
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
      >
        <Upload className='w-4 h-4' />
        {isPending ? 'Uploading...' : 'Upload File'}
      </Button>
    </div>
  );
}
