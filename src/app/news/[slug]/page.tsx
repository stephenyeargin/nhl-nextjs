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

interface StoryPartBase { type: string; [key: string]: any }
interface Story {
  _entityId?: string | number;
  status?: number;
  headline?: string;
  title?: string;
  parts: StoryPartBase[];
  tags: any[];
  fields?: { description?: string };
  [key: string]: any;
}

const NewsArticle: React.FC = () => {
  const { story, pageError }: { story?: Story; pageError?: Error | number } = useStoryContext() as any;

  if (pageError) {
    return (
      <PageError pageError={pageError as any} handleRetry={() => window.location.reload()} />
    );
  }

  if (story && story.status === 404) {
    return notFound();
  }

  if (story === undefined || !story._entityId) {
    return <GameBodySkeleton />;
  }

  let storyParts: StoryPartBase[] = [{ type: 'byline' }, ...story.parts];
  if (['photo', 'customentity'].includes(story.parts[0].type)) {
    storyParts = [ story.parts[0], { type: 'byline' }, ...story.parts.slice(1) ];
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
            <ContentByline key={i} story={story as any} />
          );
        case 'photo':
          return(
            <ContentPhoto key={i} part={part as any} />
          );
        case 'customentity':
          return (
            <ContentCustomEntity key={i} part={part as any} />
          );
        case 'external':
          return (
            <ContentExternal key={i} part={part as any} />
          );
        case 'markdown':
          return (
            <ContentMarkdown key={i} part={part as any} />
          );
        default:
          console.warn(`Unknown story part type: ${type}, rendering as title`);
          break;
        }

        return null;
      })}

      <hr className="my-5" />

      <div className="my-5">
        <span className="inline-block rounded p-1 text-xs font-bold m-1">
          Tags:
        </span>
        {story.tags.filter((t: any) => !t.extraData?.hideOnSite).map((tag: any) => (
          <ContentTag tag={tag} key={tag._entityId} />
        ))}
      </div>
    </div>
  );
};

export default NewsArticle;
