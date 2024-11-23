import React from 'react';
import { PropTypes } from 'prop-types';

const PageError = ({handleRetry, pageError}) => {
  return (
    <div className="error-message flex flex-col items-center justify-center p-6 bg-red-100 border-2 border-red-500 rounded-lg shadow-lg max-w-sm mx-auto text-center space-y-4">
      <h2 className="text-red-700 font-semibold text-lg">{pageError?.message || 'An error occurred.'}</h2>
      <button 
        onClick={handleRetry} 
        className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition-colors"
      >
      Retry
      </button>
    </div>
  );
};

PageError.displayName = 'PageError';

PageError.propTypes = {
  handleRetry: PropTypes.func.isRequired,
  pageError: PropTypes.object.isRequired,
};

export default PageError;
