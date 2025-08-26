import React from 'react';
import GameBodySkeleton from './GameBodySkeleton';
import GameSidebarSkeleton from './GameSidebarSkeleton';
import GameHeaderSkeleton from './GameHeaderSkeleton';

const GameSkeleton = () => {
  return (
    <div className="container mx-auto">
      <GameHeaderSkeleton />

      <div className="grid grid-cols-4 gap-10">
        <div className="col-span-4 md:col-span-3">
          <GameBodySkeleton />
        </div>
        <div className="col-span-4 md:col-span-1">
          <GameSidebarSkeleton />
        </div>
      </div>
    </div>
  );
};

export default GameSkeleton;
