import React from 'react';
import { SkeletonBlock, SkeletonCard, SkeletonPulse } from './loading/SkeletonPrimitives';

const TopBarScheduleSkeleton: React.FC = () => {
  return (
    <SkeletonPulse className="overflow-x-auto scrollbar-hidden">
      <div className="flex text-sm py-4">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={i !== 3 ? 'active rounded-xl mx-3' : 'active rounded-xl mx-3'}>
            <SkeletonBlock
              className={
                i !== 3 ? 'rounded-xl px-4' : 'rounded-xl px-4 bg-slate-700 dark:bg-slate-300'
              }
            >
              &nbsp;
            </SkeletonBlock>
          </div>
        ))}
      </div>
      <div className="flex flex-nowrap gap-4 p-4">
        {[0, 1, 3, 4, 5, 6].map((placeholder) => (
          <SkeletonCard key={placeholder} className="p-4" style={{ minWidth: '380px' }}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <SkeletonBlock className="mx-3 text-sm w-10">&nbsp;</SkeletonBlock>
                <SkeletonBlock className="mx-3 text-sm w-80">&nbsp;</SkeletonBlock>
              </div>
              <div className="flex items-center justify-between">
                <SkeletonBlock className="mx-3 text-sm w-10">&nbsp;</SkeletonBlock>
                <SkeletonBlock className="mx-3 text-sm w-80">&nbsp;</SkeletonBlock>
              </div>
            </div>
            <div className="mt-2 pt-3">
              <div className="flex justify-between items-center">
                <SkeletonBlock className="mx-3 text-sm w-80">&nbsp;</SkeletonBlock>
              </div>
            </div>
          </SkeletonCard>
        ))}
      </div>
    </SkeletonPulse>
  );
};

export default TopBarScheduleSkeleton;
