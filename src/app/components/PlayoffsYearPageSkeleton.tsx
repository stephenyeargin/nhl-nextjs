import React from 'react';
import { SkeletonBlock, SkeletonPulse } from './loading/SkeletonPrimitives';

const PlayoffsYearPageSkeleton: React.FC = () => {
  return (
    <main className="px-2 py-10 text-white" style={{ backgroundColor: '#121212' }}>
      <SkeletonPulse>
        <div className="max-w-4xl my-5 mx-auto p-5 rounded-xl">
          <SkeletonBlock className="h-12 w-80 mx-auto rounded bg-slate-700" />
          <SkeletonBlock className="h-6 w-64 mx-auto mt-4 rounded bg-slate-700" />
        </div>

        <div>
          <SkeletonBlock className="h-8 w-72 mx-auto rounded bg-slate-700 mb-3" />
          <SkeletonBlock className="h-5 w-96 max-w-full mx-auto rounded bg-slate-700 mb-8" />

          <div className="flex justify-center gap-3 mb-8">
            <SkeletonBlock className="h-8 w-20 rounded bg-slate-700" />
            <SkeletonBlock className="h-8 w-40 rounded bg-slate-700" />
          </div>

          <div className="hidden sm:grid grid-cols-7 gap-5">
            {[0, 1, 2, 3, 4, 5, 6].map((col) => (
              <div key={col} className="space-y-5">
                {[0, 1, 2].map((tile) => (
                  <SkeletonBlock key={tile} className="h-24 rounded-lg bg-slate-700" />
                ))}
              </div>
            ))}
          </div>

          <div className="sm:hidden space-y-5">
            {[0, 1, 2, 3].map((tile) => (
              <SkeletonBlock key={tile} className="h-24 rounded-lg bg-slate-700" />
            ))}
          </div>
        </div>
      </SkeletonPulse>
    </main>
  );
};

export default PlayoffsYearPageSkeleton;
