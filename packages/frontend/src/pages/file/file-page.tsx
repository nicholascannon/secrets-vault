import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { DisplayApiError } from '@/components/display-api-error';
import { Button } from '@/components/ui/button';
import { UserFile, UserFileSkeleton } from '@/components/user-file';
import { useGetFile } from '../../hooks/use-get-file';

export function FilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetFile(id);

  const BackButton = () => (
    <Button className='mb-4 cursor-pointer' type='button' variant='ghost' onClick={() => navigate(-1)}>
      <ArrowLeftIcon className='w-4 h-4' /> Back
    </Button>
  );

  return (
    <section>
      {error && <DisplayApiError error={error} />}
      {isLoading && <UserFileSkeleton isExpanded />}
      {data?.data && (
        <>
          <BackButton />
          <UserFile file={data.data.file} canExpand={false} defaultExpanded={true} onDelete={() => navigate(`/`)} />
        </>
      )}
    </section>
  );
}
