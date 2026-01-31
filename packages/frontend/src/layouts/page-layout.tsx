import type { ReactNode } from 'react';
import { Outlet } from 'react-router';
import { Nav } from '@/components/nav';

type PageLayoutProps = {
  children?: ReactNode;
};

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <>
      <header className='mb-4'>
        <Nav />
      </header>
      <main className='container mx-auto'>{children ?? <Outlet />}</main>
    </>
  );
}
