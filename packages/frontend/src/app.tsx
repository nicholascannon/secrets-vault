import { AppProviders } from './lib/providers';
import { Router } from './router';

export function App() {
  return (
    <AppProviders>
      <Router />
    </AppProviders>
  );
}
