import React from 'react';

const NewsPageSkeleton = () => {
  return (
    <div className="container mx-auto animate-pulse">
      <div className="bg-slate-300 dark:bg-slate-700 h-10 w-80 my-10" />
      <div className="grid grid-cols-4 gap-10">
        <div className="col-span-3">
          <div className="aspect-video bg-slate-300 dark:bg-slate-700 mb-4" />
          <div className="bg-slate-300 dark:bg-slate-700 h-8 w-80 my-3" />
          <div className="bg-slate-300 dark:bg-slate-700 h-5 my-1" />
          <div className="bg-slate-300 dark:bg-slate-700 h-5 my-1" />
          <div className="bg-slate-300 dark:bg-slate-700 h-5 my-1" />
          <div className="bg-slate-300 dark:bg-slate-700 h-6 w-40 my-3" />
        </div>

        <div className="col-span-1">
          <div className="aspect-square bg-slate-300 dark:bg-slate-700 mb-4" />
          <div className="bg-slate-300 dark:bg-slate-700 h-8 w-80 my-3" />
          <div className="bg-slate-300 dark:bg-slate-700 h-5 my-1" />
          <div className="bg-slate-300 dark:bg-slate-700 h-5 my-1" />
          <div className="bg-slate-300 dark:bg-slate-700 h-5 my-1" />
          <div className="bg-slate-300 dark:bg-slate-700 h-6 w-40 my-3" />
        </div>

        {[0, 1, 3, 4, 5, 6, 7, 8].map((_r, i) => {
          return (
            <div key={i} className="col-span-1">
              <div className="aspect-video bg-slate-300 dark:bg-slate-700 mb-4" />
              <div className="bg-slate-300 dark:bg-slate-700 h-8 w-80 my-3" />
              <div className="bg-slate-300 dark:bg-slate-700 h-5 my-1" />
              <div className="bg-slate-300 dark:bg-slate-700 h-5 my-1" />
              <div className="bg-slate-300 dark:bg-slate-700 h-5 my-1" />
              <div className="bg-slate-300 dark:bg-slate-700 h-6 w-40 my-3" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsPageSkeleton;
