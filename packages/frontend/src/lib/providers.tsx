import { ClerkProvider } from '@clerk/clerk-react';
import { shadcn } from '@clerk/themes';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { ENV } from '../config/env';
import { queryClient } from './query-client';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: shadcn,
      }}
      publishableKey={ENV.clerkPublishableKey}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <ToastContainer position='bottom-right' autoClose={2000} theme='dark' />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
