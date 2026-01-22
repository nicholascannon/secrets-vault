import { Nav } from '../nav';

export function Page({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className='mb-4'>
        <Nav />
      </header>

      <main className='container mx-auto'>{children}</main>
    </>
  );
}
