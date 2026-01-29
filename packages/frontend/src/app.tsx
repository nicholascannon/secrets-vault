import { useGetReadiness } from './hooks/use-get-readiness';
import { AppProviders } from './lib/providers';
import { Router } from './router';

export function App() {
  return (
    <AppProviders>
      <Readiness />
      <Router />
    </AppProviders>
  );
}

function Readiness() {
  const { data: readiness } = useGetReadiness();
  if (readiness) console.log('VERSION', readiness.data);
  return null;
}
