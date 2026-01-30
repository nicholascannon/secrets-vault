import { useParams, useSearchParams } from 'react-router';
import { DisplayApiError } from '@/components/display-api-error/display-api-error';
import { UserFile, UserFileSkeleton } from '@/components/user-file/user-file';
import { useSharedFile } from '@/hooks/use-shared-file';

export function SharedFilePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code') ?? '';
  const { data, isLoading, error } = useSharedFile(id, code);

  return (
    <section>
      {error && <DisplayApiError error={error} />}
      {isLoading && <UserFileSkeleton isExpanded />}
      {data?.data && <UserFile file={data.data.file} canExpand={false} defaultExpanded={true} isShared />}
    </section>
  );
}
