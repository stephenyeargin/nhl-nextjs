import React from 'react';

const TopBarScheduleSkeleton: React.FC = () => {
  return (
    <div className="overflow-x-auto scrollbar-hidden animate-pulse">
      <div className="flex text-sm py-4">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className={
              i !== 3
                ? 'active rounded-xl bg-slate-300 dark:bg-slate-700 mx-3'
                : 'active rounded-xl bg-slate-700 dark:bg-slate-300 mx-3'
            }
          >
            <div className="px-4">&nbsp;</div>
          </div>
        ))}
      </div>
      <div className="flex flex-nowrap gap-4 p-4">
        {[0, 1, 3, 4, 5, 6].map((placeholder) => (
          <div
            key={placeholder}
            className="border border-slate-300 dark:border-slate-700 rounded-lg shadow-xs p-4"
            style={{ minWidth: '380px' }}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="mx-3 text-sm bg-slate-300 dark:bg-slate-700 w-10">&nbsp;</div>
                <div className="mx-3 text-sm bg-slate-300 dark:bg-slate-700 w-80">&nbsp;</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="mx-3 text-sm bg-slate-300 dark:bg-slate-700 w-10">&nbsp;</div>
                <div className="mx-3 text-sm bg-slate-300 dark:bg-slate-700 w-80">&nbsp;</div>
              </div>
            </div>
            <div className="mt-2 pt-3">
              <div className="flex justify-between items-center">
                <div className="mx-3 text-sm bg-slate-300 dark:bg-slate-700 w-80">&nbsp;</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBarScheduleSkeleton;
