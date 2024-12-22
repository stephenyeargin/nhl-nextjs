import React from 'react';
import PropTypes from 'prop-types';
import { formatLocalizedDate } from '../utils/formatters';

const ContentByline = ({ story }) => {
  if (story.fields.contributorOverride) {
    return (
      <div className="my-5">
        <p>
          By <strong className="text-bold">{story.fields.contributorOverride}</strong>
        </p>
        <p className="text-sm text-gray-500">
          {formatLocalizedDate(story.contentDate, 'LLL')}
        </p>
      </div>
    );
  }

  return (
    <div className="my-5">
      {story.references.contributor && (
        <p>
          By <strong className="text-bold">
            {story.references.contributor?.map((contributor, i) => (
              <span key={contributor._entityId}>
                {contributor.title}{contributor.fields.source ? `, ${contributor.fields.source}` : ''}
                {i < story.references.contributor.length - 1 && ', '}
              </span>
            ))}
          </strong>
        </p>
      )}
      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 my-2">
        {formatLocalizedDate(story.contentDate, 'LLL')}
      </p>
    </div>
  );
};

ContentByline.propTypes = {
  story: PropTypes.shape({
    contentDate: PropTypes.string,
    fields: PropTypes.object,
    references: PropTypes.object,
  }),
};

export default ContentByline;
