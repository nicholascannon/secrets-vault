import { zodResolver } from '@hookform/resolvers/zod';
import { isApiErrorResponse } from '@secrets-vault/shared';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUploadSecret } from '@/hooks/use-upload-secret';

const formSchema = z.object({
  name: z.string().nonempty(),
  value: z.string().nonempty(),
});
type FormData = z.infer<typeof formSchema>;

export function UploadDialog() {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      value: '',
    },
  });
  const { mutate: uploadSecret, isPending } = useUploadSecret();

  const onSubmit = (data: FormData) => {
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
            <Textarea placeholder='Secret value' {...register('value')} />
            <FieldError>{errors.value?.message}</FieldError>
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
