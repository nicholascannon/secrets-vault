import { zodResolver } from '@hookform/resolvers/zod';
import { isApiErrorResponse } from '@secrets-vault/shared';
import { type AddFileSchema, addFileSchema } from '@secrets-vault/shared/api/files';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUploadSecret } from '@/hooks/use-upload-secret';

export function UploadDialog() {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<AddFileSchema>({
    resolver: zodResolver(addFileSchema),
    defaultValues: {
      name: '',
      content: '',
    },
  });
  const { mutate: uploadSecret, isPending } = useUploadSecret();

  const onSubmit = (data: AddFileSchema) => {
    uploadSecret(data, {
      onSuccess: () => {
        closeModal();
        reset();
      },
      onError: (error) => {
        if (isApiErrorResponse(error, 'FILE_ALREADY_EXISTS')) {
          setError('name', { message: 'A secret with this name already exists' });
        }
      },
    });
  };

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Add secret</Button>
      </DialogTrigger>

      <DialogContent>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add a secret</DialogTitle>
          </DialogHeader>

          <Field>
            <Input autoComplete='off' type='text' placeholder='Secret name' {...register('name')} />
            <FieldError>{errors.name?.message}</FieldError>
          </Field>

          <Field>
            <Textarea placeholder='Secret value' {...register('content')} />
            <FieldError>{errors.content?.message}</FieldError>
          </Field>

          <DialogFooter className='w-full'>
            <Button disabled={isPending} type='submit'>
              {isPending ? <Loader2 className='animate-spin w-4 h-4' /> : 'Add secret'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
