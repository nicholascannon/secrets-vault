import { UserButton } from '@/auth';

export function Nav() {
  return (
    <nav className='flex items-center justify-between py-4 px-8'>
      <h1 className='text-2xl font-bold'>Secrets Vault</h1>

      <UserButton />
    </nav>
  );
}
