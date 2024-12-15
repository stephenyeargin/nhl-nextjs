'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PropTypes } from 'prop-types';
import { formatLocalizedDate, formatLocalizedTime } from '../utils/formatters';

const MissingThumbnail = () => (
  <div className="w-full bg-gray-200 flex items-center aspect-square">
    <Image src="https://assets.nhle.com/logos/nhl/svg/NHL_light.svg" width="416" height="416" alt="Story Photo" className="" />
  </div>
);

const StoryCard = ({ item, imageFormatInstructions }) => (
  <div key={item.entityId} className="mb-4">
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
    <p className="text-justify line-clamp-3 text-sm">{item.summary.replace('\\', '')}</p>
    <Link href={`/news/${item.slug}`} className="block font-bold py-3 underline">Read Story</Link>
  </div>
);

StoryCard.propTypes = {
  item: PropTypes.object.isRequired,
  imageFormatInstructions: PropTypes.string,
};

export default StoryCard;