import React from 'react';
import { formatLocalizedDate } from '../utils/formatters';

interface ContributorRef {
  _entityId: string;
  title?: string;
  fields?: { source?: string };
}

interface StoryFields {
  contributorOverride?: string;
  description?: string;
  [key: string]: any; // fallback for unknown fields during incremental typing
}

interface StoryReferences {
  contributor?: ContributorRef[];
  [key: string]: any;
}

export interface StoryMinimal {
  contentDate: string;
  fields: StoryFields;
  references: StoryReferences;
}

interface ContentBylineProps {
  story: StoryMinimal;
}

const ContentByline: React.FC<ContentBylineProps> = ({ story }) => {
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
        {contributor.title}{contributor.fields?.source ? `, ${contributor.fields.source}` : ''}
        {i < (story.references.contributor?.length ?? 0) - 1 && ', '}
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

export default ContentByline;
