'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PropTypes } from 'prop-types';
import { formatLocalizedDate, formatLocalizedTime, formatMarkdownContent } from '../utils/formatters';

const MissingThumbnail = () => (
  <div className="w-full bg-gray-200 flex items-center aspect-square">
    <Image src="https://assets.nhle.com/logos/nhl/svg/NHL_light.svg" width="416" height="416" alt="Story Photo" className="" />
  </div>
);

const StoryCard = ({ item, small, imageFormatInstructions }) => {
  if (small) {
    return (
      <div key={item._entityId} className="mb-4">
        <Link href={`/news/${item.slug}`} className="grid grid-cols-3 gap-4 items-center">
          <div className="col-span-1">
            {item.thumbnail ? (               
              <Image src={item.thumbnail?.thumbnailUrl} width="416" height="416" alt="Story Photo" className="mb-2 w-full" />
            ) : (
              <MissingThumbnail />
            )}
          </div>
          <div className="col-span-2">
            <h2 className="text-md font-bold">{item.headline || item.title}</h2>
          </div>
        </Link>
      </div>
    );
  }
  
  
  return(
    <div key={item._entityId} className="mb-4">
      <p className="hidden" suppressHydrationWarning>{formatLocalizedDate(item.contentDate)} {formatLocalizedTime(item.contentDate)}</p>
      <Link href={`/news/${item.slug}`} className="">
        {imageFormatInstructions ? (
          <>
            {item.thumbnail ? (
              <Image src={item.thumbnail?.templateUrl.replace('{formatInstructions}', imageFormatInstructions)} width="900" height="600" alt="Story Photo" className="w-full" />
            ) : (
              <MissingThumbnail />
            )}
          </>
        ) : (
          <>
            {item.thumbnail ? (               
              <Image src={item.thumbnail?.thumbnailUrl} width="416" height="416" alt="Story Photo" className="mb-2 w-full" />
            ) : (
              <MissingThumbnail />
            )}
          </>
        )}
      </Link>
      <Link href={`/news/${item.slug}`} className="">
        <h2 className="text-xl font-bold">{item.headline || item.title}</h2>
      </Link>
      <div className="text-justify line-clamp-3 text-sm" dangerouslySetInnerHTML={{ __html: formatMarkdownContent(item.summary) }} />
      <Link href={`/news/${item.slug}`} className="block font-bold py-3 underline">Read Story</Link>
    </div>
  );};

StoryCard.propTypes = {
  item: PropTypes.object.isRequired,
  small: PropTypes.bool,
  imageFormatInstructions: PropTypes.string,
};

export default StoryCard;