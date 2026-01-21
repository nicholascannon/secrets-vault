import type { HealthReadinessResponse } from '@secrets-vault/shared/api/health';
import { useEffect, useState } from 'react';

import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [version, setVersion] = useState<string | undefined>(undefined);

  useEffect(() => {
    // TODO: test api response - remove
    fetch('/api/v1/health/ready')
      .then((res) => res.json())
      .then((data: HealthReadinessResponse) => {
        setVersion(data.data?.version);
      });
  }, []);

  return (
    <>
      <div>
        <a href='https://vite.dev' target='_blank' rel='noreferrer'>
          <img src='/vite.svg' className='logo' alt='Vite logo' />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h2>Version: {version ?? 'loading...'}</h2>
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)} type='button'>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
