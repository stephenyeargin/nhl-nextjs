import React from 'react';
import { SkeletonBlock, SkeletonPulse } from './loading/SkeletonPrimitives';

const NewsPageSkeleton = () => {
  return (
    <SkeletonPulse className="container mx-auto">
      <SkeletonBlock className="h-10 w-80 my-10" />
      <div className="grid grid-cols-4 gap-10">
        <div className="col-span-3">
          <SkeletonBlock className="aspect-video mb-4" />
          <SkeletonBlock className="h-8 w-80 my-3" />
          <SkeletonBlock className="h-5 my-1" />
          <SkeletonBlock className="h-5 my-1" />
          <SkeletonBlock className="h-5 my-1" />
          <SkeletonBlock className="h-6 w-40 my-3" />
        </div>

        <div className="col-span-1">
          <SkeletonBlock className="aspect-square mb-4" />
          <SkeletonBlock className="h-8 w-80 my-3" />
          <SkeletonBlock className="h-5 my-1" />
          <SkeletonBlock className="h-5 my-1" />
          <SkeletonBlock className="h-5 my-1" />
          <SkeletonBlock className="h-6 w-40 my-3" />
        </div>

        {[0, 1, 3, 4, 5, 6, 7, 8].map((_r, i) => {
          return (
            <div key={i} className="col-span-1">
              <SkeletonBlock className="aspect-video mb-4" />
              <SkeletonBlock className="h-8 w-80 my-3" />
              <SkeletonBlock className="h-5 my-1" />
              <SkeletonBlock className="h-5 my-1" />
              <SkeletonBlock className="h-5 my-1" />
              <SkeletonBlock className="h-6 w-40 my-3" />
            </div>
          );
        })}
      </div>
    </SkeletonPulse>
  );
};

export default NewsPageSkeleton;
