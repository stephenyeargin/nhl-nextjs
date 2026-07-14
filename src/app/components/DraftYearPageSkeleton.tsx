import React from 'react';
import { SkeletonBlock, SkeletonCard, SkeletonPulse } from './loading/SkeletonPrimitives';

const DraftYearPageSkeleton: React.FC = () => {
  return (
    <SkeletonPulse className="max-w-6xl mx-auto px-4 py-10">
      <SkeletonBlock className="h-9 w-72 rounded mb-4" />
      <div className="flex gap-3 mb-6">
        {[0, 1, 2].map((tab) => (
          <SkeletonBlock key={tab} className="h-8 w-28 rounded" />
        ))}
      </div>

      <SkeletonCard className="p-4">
        <div className="grid grid-cols-6 gap-3 mb-4">
          {[0, 1, 2, 3, 4, 5].map((col) => (
            <SkeletonBlock key={col} className="h-6 rounded" />
          ))}
        </div>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((row) => (
          <div key={row} className="grid grid-cols-6 gap-3 mb-3">
            {[0, 1, 2, 3, 4, 5].map((cell) => (
              <SkeletonBlock key={cell} className="h-8 rounded" />
            ))}
          </div>
        ))}
      </SkeletonCard>
    </SkeletonPulse>
  );
};

export default DraftYearPageSkeleton;
