import React from 'react';

const GameBodySkeleton = () => {
  return (
    <div className="animate-pulse container mx-auto">
      <div
        className="my-2 h-10 bg-slate-300 dark:bg-slate-700 animate-pulse"
        style={{ maxWidth: '40%' }}
      ></div>

      <div
        className="my-2 h-5 bg-slate-300 dark:bg-slate-700 animate-pulse"
        style={{ maxWidth: '30%' }}
      ></div>
      <div className="my-10 h-5 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
      <div className="my-2 h-5 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
      <div className="my-2 h-5 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
      <div className="my-2 h-5 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
    </div>
  );
};

GameBodySkeleton.propTypes = {};

export default GameBodySkeleton;
