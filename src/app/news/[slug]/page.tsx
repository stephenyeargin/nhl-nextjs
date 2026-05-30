'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { useStoryContext } from '@/app/contexts/StoryContext';
import GameBodySkeleton from '@/app/components/GameBodySkeleton';
import ContentPhoto from '@/app/components/ContentPhoto';
import ContentCustomEntity from '@/app/components/ContentCustomEntity';
import ContentExternal from '@/app/components/ContentExternal';
import ContentMarkdown from '@/app/components/ContentMarkdown';
import ContentByline from '@/app/components/ContentByline';
import PageError from '@/app/components/PageError';
import ContentTag from '@/app/components/ContentTag';
import type { Tag } from '@/app/types/tag';

interface StoryPartBase {
  type: string;
  [key: string]: unknown;
}
interface StoryPageError {
  message?: string;
}
interface Story {
  _entityId?: string | number;
  status?: number;
  headline?: string;
  title?: string;
  parts?: StoryPartBase[];
  tags?: Tag[];
  contentDate?: string;
  references?: Record<string, unknown>;
  fields?: { description?: string };
  [key: string]: unknown;
}

const NewsArticle: React.FC = () => {
  const ctx = useStoryContext();
  const story = ctx.story as Story | undefined;
  const pageError = ctx.pageError as StoryPageError | null;

  if (pageError) {
    return <PageError pageError={pageError} handleRetry={() => window.location.reload()} />;
  }

  if (story && story.status === 404) {
    return notFound();
  }

  if (story === undefined || !story._entityId) {
    return <GameBodySkeleton />;
  }

  const parts = Array.isArray(story.parts) ? story.parts : [];
  let storyParts: StoryPartBase[] = [{ type: 'byline' }, ...parts];
  if (parts[0] && ['photo', 'customentity'].includes(parts[0].type)) {
    storyParts = [parts[0], { type: 'byline' }, ...parts.slice(1)];
  }

  return (
    <div key={story._entityId} className="container mx-auto my-5">
      <div className="my-5">
        <h1 className="text-4xl font-bold">{story.headline || story.title}</h1>
        <h2 className="my-4 text-gray-500 font-light">{story.fields?.description}</h2>
      </div>

      {storyParts.map((part, i) => {
        const { type } = part;
        switch (type) {
          case 'byline':
            return (
              <ContentByline
                key={i}
                story={story as unknown as React.ComponentProps<typeof ContentByline>['story']}
              />
            );
          case 'photo':
            return (
              <ContentPhoto
                key={i}
                part={part as unknown as React.ComponentProps<typeof ContentPhoto>['part']}
              />
            );
          case 'customentity':
            return (
              <ContentCustomEntity
                key={i}
                part={part as unknown as React.ComponentProps<typeof ContentCustomEntity>['part']}
              />
            );
          case 'external':
            return (
              <ContentExternal
                key={i}
                part={part as unknown as React.ComponentProps<typeof ContentExternal>['part']}
              />
            );
          case 'markdown':
            return (
              <ContentMarkdown
                key={i}
                part={part as unknown as React.ComponentProps<typeof ContentMarkdown>['part']}
              />
            );
          default:
            console.warn(`Unknown story part type: ${type}, rendering as title`);
            break;
        }

        return null;
      })}

      <hr className="my-5" />

      <div className="my-5">
        <span className="inline-block rounded-sm p-1 text-xs font-bold m-1">Tags:</span>
        {(story.tags || [])
          .filter((t: Tag) => !t.extraData?.hideOnSite)
          .map((tag: Tag) => (
            <ContentTag tag={tag} key={tag._entityId} />
          ))}
      </div>
    </div>
  );
};

export default NewsArticle;
