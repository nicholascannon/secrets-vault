import { Outlet } from 'react-router';
import { Nav } from '@/components/nav';

export function PageLayout() {
  return (
    <>
      <header className='mb-4'>
        <Nav />
      </header>
      <main className='container mx-auto'>
        <Outlet />
      </main>
    </>
  );
}
