'use client';
import React, { useEffect } from 'react';

export default function PlayerError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('Player page error', error);
  }, [error]);

  return (
    <div className='p-4'>
      <h2 className='text-xl font-semibold mb-2'>Unable to load player data.</h2>
      <p className='text-sm opacity-80 mb-4'>Try again in a moment.</p>
      <button className='underline font-bold' onClick={() => reset()}>Retry</button>
      {error.digest && <p className='mt-2 text-xs text-gray-500'>Ref: {error.digest}</p>}
    </div>
  );
}
