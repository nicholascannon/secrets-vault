import { ClerkProvider } from '@clerk/clerk-react';
import { shadcn } from '@clerk/themes';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import { ENV } from '../config/env';
import { queryClient } from './query-client';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: shadcn,
      }}
      publishableKey={ENV.clerkPublishableKey}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <ToastContainer position='bottom-right' autoClose={2000} theme='dark' />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
