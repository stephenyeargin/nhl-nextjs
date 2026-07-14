import React from 'react';
import { SkeletonBlock, SkeletonCard, SkeletonPulse } from './loading/SkeletonPrimitives';

const GameHeaderSkeleton = () => {
  return (
    <SkeletonPulse>
      <SkeletonCard className="grid grid-cols-12 my-5 py-4 gap-5">
        <div className="col-span-3 flex justify-center ms-5">
          <SkeletonBlock className="w-40 h-20" />
          <div className="mx-4">
            <SkeletonBlock className="h-4" />
          </div>
        </div>
        <div className="col-span-2 flex justify-end">
          <SkeletonBlock className="w-20 h-20" />
          <div className="mx-4">
            <SkeletonBlock className="h-4" />
          </div>
        </div>
        <div className="col-span-2 text-center text-5xl md:text-7xl font-black">
          <SkeletonBlock className="my-2 h-4" />
          <SkeletonBlock className="my-2 h-4" />
          <SkeletonBlock className="my-2 h-4" />
        </div>
        <div className="col-span-2 flex">
          <SkeletonBlock className="w-20 h-20" />
          <div className="mx-4">
            <SkeletonBlock className="h-4" />
          </div>
        </div>
        <div className="col-span-3 flex justify-center me-5">
          <SkeletonBlock className="w-40 h-20" />
          <div className="mx-4">
            <SkeletonBlock className="h-4" />
          </div>
        </div>
      </SkeletonCard>
    </SkeletonPulse>
  );
};

export default GameHeaderSkeleton;
