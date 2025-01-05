import React from 'react';
import PropTypes from 'prop-types';

const LoadMoreButton = ({ handleClick }) => {
  return (
    <div className="flex justify-center py-4">
      <button onClick={handleClick} className="p-2 px-5 text-lg font-bold rounded border bg-slate-200 dark:bg-slate-800">
        Load More
      </button>
    </div>
  );
};

LoadMoreButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
};

export default LoadMoreButton;