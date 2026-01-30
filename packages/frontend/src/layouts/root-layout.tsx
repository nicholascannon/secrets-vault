import { Outlet } from 'react-router';
import { useGetReadiness } from '@/hooks/use-get-readiness';
import { AppProviders } from '@/lib/providers';

function Readiness() {
  const { data: readiness } = useGetReadiness();
  if (readiness) console.log('VERSION', readiness.data);
  return null;
}

export function RootLayout() {
  return (
    <AppProviders>
      <Readiness />
      <Outlet />
    </AppProviders>
  );
}
