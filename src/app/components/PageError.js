import React from 'react';
import { PropTypes } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faWarning } from '@fortawesome/free-solid-svg-icons';

const PageError = ({handleRetry, pageError}) => {
  return (
    <div className="m-10 flex flex-col items-center">
      <h2 className="text-2xl font-bold flex items-center">
        <FontAwesomeIcon icon={faWarning} className="mr-2" />
        {pageError?.message || 'An error occurred.'}
      </h2>
      {handleRetry && (
        <button 
          onClick={handleRetry} 
          className="m-5 p-2 bg-red-900 text-white rounded-md"
        >
          <FontAwesomeIcon icon={faRedo} className="mr-2" />
    Retry
        </button>
      )}

    </div>
  );
};

PageError.displayName = 'PageError';

PageError.propTypes = {
  handleRetry: PropTypes.func.isRequired,
  pageError: PropTypes.object.isRequired,
};

export default PageError;
