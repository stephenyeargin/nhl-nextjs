import React from 'react';
import { SkeletonBlock, SkeletonCard, SkeletonPulse } from './loading/SkeletonPrimitives';

const DraftTickerSkeleton: React.FC = () => {
  return (
    <SkeletonPulse className="px-2 my-3" data-testid="draft-ticker-skeleton">
      <div className="flex items-center gap-2">
        <div className="px-2 whitespace-nowrap shrink-0">
          <SkeletonBlock className="h-5 w-28 rounded" />
          <SkeletonBlock className="h-7 w-24 mt-2 rounded" />
        </div>

        <SkeletonBlock className="h-7 w-7 rounded-full shrink-0" />

        <div className="flex gap-3 overflow-x-auto scrollbar-hidden">
          {[0, 1, 2, 3, 4, 5].map((placeholder) => (
            <SkeletonCard
              key={placeholder}
              className="flex flex-col justify-center items-center gap-2 px-3 py-2 min-w-40 max-w-xs overflow-hidden shrink-0"
            >
              <SkeletonBlock className="h-4 w-16 rounded" />
              <SkeletonBlock className="h-8 w-8 rounded-full" />
              <SkeletonBlock className="h-3 w-24 rounded" />
              <SkeletonBlock className="h-3 w-20 rounded" />
            </SkeletonCard>
          ))}
        </div>

        <SkeletonBlock className="h-7 w-7 rounded-full shrink-0" />
      </div>
    </SkeletonPulse>
  );
};

export default DraftTickerSkeleton;
