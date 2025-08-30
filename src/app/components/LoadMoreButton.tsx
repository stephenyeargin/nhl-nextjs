import React from 'react';

interface LoadMoreButtonProps {
  handleClick: (_e: React.MouseEvent<HTMLButtonElement>) => void;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ handleClick }) => {
  return (
    <div className="flex justify-center py-4">
      <button
        onClick={handleClick}
        className="p-2 px-5 text-lg font-bold rounded border bg-slate-200 dark:bg-slate-800"
      >
        Load More
      </button>
    </div>
  );
};

export default LoadMoreButton;
