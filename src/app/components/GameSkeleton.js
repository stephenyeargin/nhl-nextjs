'use client';

import React from 'react';

const GameSkeleton = () => {
  return (
    <div className="container mx-auto animate-pulse">
      <div className="border rounded-lg grid grid-cols-12 my-5 py-4 gap-5">
        <div className="col-span-3 flex mx-auto">
          <div className="w-40 h-20 bg-slate-300 dark:bg-slate-700"></div>
          <div className="mx-4">
            <div className="h-4 bg-slate-300 dark:bg-slate-700"></div>
          </div>
        </div>
        <div className="col-span-2 flex mx-auto">
          <div className="w-20 h-20 bg-slate-300 dark:bg-slate-700"></div>
          <div className="mx-4">
            <div className="h-4 bg-slate-300 dark:bg-slate-700"></div>
          </div>
        </div>
        <div className="col-span-2 text-center text-5xl md:text-7xl font-black">
          <div className="my-2 h-4 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
          <div className="my-2 h-4 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
          <div className="my-2 h-4 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
        </div>
        <div className="col-span-2 flex mx-auto">
          <div className="w-20 h-20 bg-slate-300 dark:bg-slate-700"></div>
          <div className="mx-4">
            <div className="h-4 bg-slate-300 dark:bg-slate-700"></div>
          </div>
        </div>
        <div className="col-span-3 flex mx-auto">
          <div className="w-40 h-20 bg-slate-300 dark:bg-slate-700"></div>
          <div className="mx-4">
            <div className="h-4 bg-slate-300 dark:bg-slate-700"></div>
          </div>
        </div>
      </div>

      <div className="my-4 flex">
        <div className="h-5 my-2 bg-slate-300 dark:bg-slate-700 grow mx-auto" style={{maxWidth:'20%'}}></div>
      </div>

      <div className="grid grid-cols-4 gap-10">
        <div className="col-span-4 md:col-span-3">

          <div className="my-2 h-10 bg-slate-300 dark:bg-slate-700 animate-pulse" style={{maxWidth:'40%'}}></div>

          <div className="my-2 h-5 bg-slate-300 dark:bg-slate-700 animate-pulse" style={{maxWidth:'30%'}}></div>
          <div className="my-10 h-5 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
          <div className="my-2 h-5 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
          <div className="my-2 h-5 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
          <div className="my-2 h-5 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
        </div>
        <div className="col-span-4 md:col-span-1">
          <div className="my-2 h-10 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
          <div className="my-2 h-5 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
          <div className="my-2 h-5 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
          <div className="my-2 h-5 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
          <div className="my-2 h-5 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>

          <div className="mt-10 mb-2 h-10 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
          <div className="my-2 h-5 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
          <div className="my-2 h-5 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
          <div className="my-2 h-5 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
          <div className="my-2 h-5 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
        </div>
      </div>
    </div>

  );
};

export default GameSkeleton;
