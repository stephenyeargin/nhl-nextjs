import React from 'react';
import { SkeletonBlock, SkeletonCard, SkeletonPulse } from './loading/SkeletonPrimitives';

const PlayerPageSkeleton: React.FC = () => {
  return (
    <SkeletonPulse className="container mx-auto px-2 my-5">
      <SkeletonCard className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <SkeletonBlock className="h-28 w-28 rounded-full shrink-0" />
          <div className="w-full space-y-3">
            <SkeletonBlock className="h-8 w-64 rounded" />
            <SkeletonBlock className="h-5 w-48 rounded" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <SkeletonBlock key={i} className="h-6 rounded" />
              ))}
            </div>
          </div>
        </div>
      </SkeletonCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-4">
          <SkeletonBlock className="h-8 w-48 rounded" />
          {[0, 1, 2, 3, 4].map((row) => (
            <SkeletonBlock key={row} className="h-10 rounded" />
          ))}
        </div>
        <div className="space-y-4">
          <SkeletonBlock className="h-8 w-40 rounded" />
          <SkeletonBlock className="aspect-square rounded" />
          <SkeletonBlock className="aspect-square rounded" />
        </div>
      </div>
    </SkeletonPulse>
  );
};

export default PlayerPageSkeleton;
