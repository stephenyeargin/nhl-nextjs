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

const NewsArticle = () => {
  const { story, pageError } = useStoryContext();

  if (pageError) {
    return (
      <PageError pageError={pageError} handleRetry={() => window.location.reload()} />
    );
  }

  if (story && story.status === 404) {
    return notFound();
  }

  if (story === undefined || !story._entityId) {
    return <GameBodySkeleton />;
  }

  // Put the byline as the second element in the story parts array
  let storyParts = [{ type: 'byline' }, ...story.parts];
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
            <ContentByline key={i} story={story} />
          );
        case 'photo':
          return(
            <ContentPhoto key={i} part={part} />
          );
        case 'customentity':
          return (
            <ContentCustomEntity key={i} part={part} />
          );
        case 'external':
          return (
            <ContentExternal key={i} part={part} />
          );
        case 'markdown':
          return (
            <ContentMarkdown key={i} part={part} />
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
        {story.tags.filter((t) => !t.extraData?.hideOnSite).map((tag) => (
          <ContentTag tag={tag} key={tag._entityId} />
        ))}
      </div>
    </div>
  );
};

export default NewsArticle;
