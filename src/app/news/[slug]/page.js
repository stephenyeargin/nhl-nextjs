import React from 'react';
import { notFound } from 'next/navigation';
import { PropTypes } from 'prop-types';
import { marked } from 'marked';
import Image from 'next/image';
import { formatLocalizedDate, formatLocalizedTime } from '@/app/utils/formatters';

export const metadata = {
  title: 'NHL News',
  description: '',
};

const NewsArticle = async ({ params }) => {

  const { slug } = await params;

  const storyResponse = await fetch(`https://forge-dapi.d3.nhle.com/v2/content/en-us/stories/${slug}`, { cache: 'no-store' });
  const story = await storyResponse.json();

  if (!story || story.status === 404) {
    return notFound();
  }

  metadata.title = story.headline;
  metadata.description = story.fields.description;

  return (
    <div className="container mx-auto my-5">
      <h1 className="font-bold text-3xl">{story.headline}</h1>
      <h2 className="text-xl text-gray-500">{story.fields.description}</h2>

      {story.parts.map((part, i) => {
        if (part.type === 'photo') {
          return (
            <div key={part._entityId} className="my-5">
              <figure className="relative">
                <Image
                  src={part.image.templateUrl.replace('{formatInstructions}', 't_ratio16_9-size40/f_png/')}
                  alt="Story Photo"
                  className="w-full"
                  width={832}
                  height={468}
                />
                <figcaption className="my-3 text-xs text-gray-500">{part.image.title} &ndash; {part.fields.credit}</figcaption>
              </figure>
            </div>
          );
        }

        if (part.type === 'customentity') {
          return (
            <div key={part._entityId} className="my-5">
              <figure className="relative">
                <Image
                  src={part.thumbnail.templateUrl.replace('{formatInstructions}', 't_ratio16_9-size40/f_png/')}
                  alt="Story Photo"
                  className="w-full"
                  width={832}
                  height={468}
                />
                <figcaption className="my-3 text-xs text-gray-500">{part.fields.description || part.fields.longDescription}</figcaption>
              </figure>
            </div>
          );
        }

        if (part.type === 'external') {
          return (
            <div key={part._entityId} className="my-5 p-5">
              <div dangerouslySetInnerHTML={{ __html: part.content.html }} />
            </div>
          );
        }

        if (part.type === 'markdown') {
          let byline;
          if (i === 1 && story.references?.contributor?.length > 0) {
            byline = (
              <div className="my-5">
                <div>
                  By <strong className="text-bold">{story.references.contributor.map((contributor, i2) => (
                    <span key={contributor._entityId}>
                      {contributor.title}, {contributor.fields.source}
                      {i2 < story.references.contributor.length - 1 && ', '}
                    </span>
                  ))}</strong>
                </div>
                <div>{formatLocalizedDate(story.contentDate)} {formatLocalizedTime(story.contentDate)}</div>
              </div>
            );
          }

          return (
            <div key={part._entityId} className="my-5">
              {byline}
              <div dangerouslySetInnerHTML={
                {
                  __html: marked.parse(part.content)
                    .replace(/<forge-entity\s+title="([^"]+)"\s+slug="([^"]+)"\s+code="([^"]+)">([^<]+)<\/forge-entity>/g, '<a href="/$3/$2">$4</a>')      
                    .replace(/<p>/g, '<p class="mb-4">')
                    .replace(/<a\s/g, '<a class="underline" ')
                    .replace(/<h2>/g, '<h2 class="text-xl font-bold mb-4">')
                    .replace(/<h3>/g, '<h3 class="text-lg font-bold mb-4">')             
                }
              } />
            </div>
          );
        }
      })}

    </div>
  );

};

NewsArticle.propTypes = {
  params: {
    slug: PropTypes.string.isRequired,
  },
};

export default NewsArticle;