'use client';
import React, { useEffect } from 'react';

export default function GameError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error('Game page error', error);
  }, [error]);
  
return (
    <div className='p-4'>
      <h2 className='text-xl font-semibold mb-2'>Something went wrong loading this game.</h2>
      <p className='text-sm opacity-80'>Please refresh or try again shortly.</p>
      {error.digest && <p className='mt-2 text-xs text-gray-500'>Ref: {error.digest}</p>}
    </div>
  );
}
