'use client';

import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatHeadTitle, formatLocalizedDate, formatLocalizedTime, formatMarkdownContent } from '@/app/utils/formatters';
import { useStoryContext } from '@/app/contexts/StoryContext';
import GameBodySkeleton from '@/app/components/GameBodySkeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';

const NewsArticle = () => {
  const { storyData } = useStoryContext();
  const { story } = storyData;
  
  const [isStoryLoaded, setIsStoryLoaded] = useState(false);

  useEffect(() => {
    if (story) {
      setIsStoryLoaded(true);
    }
  }, [story]);

  if (!isStoryLoaded) {
    return <GameBodySkeleton />;
  }

  if (story.status === 404) {
    return notFound();
  }

  formatHeadTitle(story.title);

  // Set default contributor if none is provided
  if (!story.references.contributor) {
    story.references.contributor = [{
      title: 'NHL.com Staff',
      fields: {},
    }];
  }

  return (
    <div className="container mx-auto my-5">
      <div className="my-5">
        <h1 className="text-4xl font-bold">{story.headline || story.title}</h1>
        <h2 className="my-4 text-gray-500 font-light">{story.fields?.description}</h2>
      </div>

      {story.parts.map((part, i) => {
        const { type, _entityId, fields, content, image, thumbnail } = part;

        // Photo Section
        if (type === 'photo') {
          return (
            <div key={_entityId} className="my-5">
              <figure>
                <Image
                  src={image.templateUrl.replace('{formatInstructions}', 't_ratio16_9-size40/f_png/')}
                  alt={fields.altText}
                  className="w-full"
                  width={832}
                  height={468}
                />
                {fields.credit && (
                  <figcaption className="text-xs text-gray-500 py-2">&copy; {fields.credit}</figcaption>
                )}
              </figure>
            </div>
          );
        }

        // Custom Entity (e.g., Video Section)
        if (type === 'customentity') {
          return (
            <div className="" key={part._entityId}>
              <figure>
                <iframe
                  src={`https://players.brightcove.net/${fields.brightcoveAccountId}/default_default/index.html?videoId=${fields.brightcoveId}`}
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  className="w-full aspect-video"
                  loading="lazy"
                  title={fields.title}
                >
                  <div key={_entityId} className="my-5">

                    <div className="relative">
                      <Image
                        src={thumbnail.templateUrl.replace('{formatInstructions}', 't_ratio16_9-size40/f_png/')}
                        alt="Custom Entity Image"
                        className="w-full"
                        width={832}
                        height={468}
                      />
                      <Link
                        href={`https://players.brightcove.net/${fields.brightcoveAccountId}/default_default/index.html?videoId=${fields.brightcoveId}`}
                        className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-cover hover:bg-white/70 opacity-0 hover:opacity-100 rounded"
                        target="_blank"
                      >
                        <FontAwesomeIcon icon={faExternalLink} fixedWidth className="text-6xl text-blue-900" />
                      </Link>
                    </div>
                  </div>
                </iframe>
                <figcaption className="my-3 text-xs text-gray-500">{fields.description || fields.longDescription}</figcaption>
              </figure>
            </div>
          );
        }

        // External Content Section (HTML)
        if (type === 'external') {
          return (
            <div key={_entityId} className="my-5 p-5">
              <div dangerouslySetInnerHTML={{ __html: content.html }} />
            </div>
          );
        }

        // Markdown Section
        if (type === 'markdown') {
          let byline = null;
          if (i === 1) {
            byline = (
              <div className="my-5">
                <div>
                  By <strong className="text-bold">
                    {story.references.contributor.map((contributor, i2) => (
                      <span key={contributor._entityId}>
                        {contributor.title}{contributor.fields.source ? `, ${contributor.fields.source}` : ''}
                        {i2 < story.references.contributor.length - 1 && ', '}
                      </span>
                    ))}
                  </strong>
                </div>
                <div>{formatLocalizedDate(story.contentDate)} {formatLocalizedTime(story.contentDate)}</div>
              </div>
            );
          }

          return (
            <div key={_entityId} className="my-5">
              {byline}
              <div dangerouslySetInnerHTML={{ __html: formatMarkdownContent(content) }} />
            </div>
          );
        }

        console.warn(`Unknown story part type: ${type}, rendering as title`);
        
        return null;
      })}

      <hr className="my-5" />

      <div className="my-5">
        <span className="inline-block rounded p-1 text-xs font-bold m-1">
          Tags:
        </span>
        {story.tags.filter((t) => !t.extraData?.hideOnSite).map((tag) => (
          <Link href={`/news/tags/${tag.slug}`} key={tag._entityId} className="inline-block rounded p-1 border text-xs m-1">
            {tag.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NewsArticle;
