import React from 'react';

const GameSidebarSkeleton = () => {
  return (
    <div className="animate-pulse">
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
  );
};

GameSidebarSkeleton.propTypes = {};

export default GameSidebarSkeleton;

