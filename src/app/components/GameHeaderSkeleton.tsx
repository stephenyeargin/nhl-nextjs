import React from 'react';

const GameHeaderSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="border border-slate-300 dark:border-slate-700 rounded-lg grid grid-cols-12 my-5 py-4 gap-5">
        <div className="col-span-3 flex justify-center ms-5">
          <div className="w-40 h-20 bg-slate-300 dark:bg-slate-700"></div>
          <div className="mx-4">
            <div className="h-4 bg-slate-300 dark:bg-slate-700"></div>
          </div>
        </div>
        <div className="col-span-2 flex justify-end">
          <div className="w-20 h-20 bg-slate-300 dark:bg-slate-700"></div>
          <div className="mx-4">
            <div className="h-4 bg-slate-300 dark:bg-slate-700"></div>
          </div>
        </div>
        <div className="col-span-2 text-center text-5xl md:text-7xl font-black">
          <div className="my-2 h-4 bg-slate-300 dark:bg-slate-700"></div>
          <div className="my-2 h-4 bg-slate-300 dark:bg-slate-700"></div>
          <div className="my-2 h-4 bg-slate-300 dark:bg-slate-700"></div>
        </div>
        <div className="col-span-2 flex">
          <div className="w-20 h-20 bg-slate-300 dark:bg-slate-700"></div>
          <div className="mx-4">
            <div className="h-4 bg-slate-300 dark:bg-slate-700"></div>
          </div>
        </div>
        <div className="col-span-3 flex justify-center me-5">
          <div className="w-40 h-20 bg-slate-300 dark:bg-slate-700"></div>
          <div className="mx-4">
            <div className="h-4 bg-slate-300 dark:bg-slate-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHeaderSkeleton;