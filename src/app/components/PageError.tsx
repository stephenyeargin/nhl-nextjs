import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faWarning } from '@fortawesome/free-solid-svg-icons';

interface PageErrorProps { handleRetry?: () => void; pageError?: { message?: string } }

const PageError: React.FC<PageErrorProps> = ({handleRetry, pageError}) => {
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

export default PageError;
