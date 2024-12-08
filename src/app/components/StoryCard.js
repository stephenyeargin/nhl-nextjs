'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PropTypes } from 'prop-types';
import { formatLocalizedDate, formatLocalizedTime } from '../utils/formatters';

const StoryCard = ({ item }) => (
  <div key={item.entityId} className="mb-4">
    <p className="text-sm opacity-50" suppressHydrationWarning>{formatLocalizedDate(item.contentDate)} {formatLocalizedTime(item.contentDate)}</p>
    <Link href={`https://nhl.com/news/${item.slug}`} className="">
      {item.thumbnail ? (               
        <Image src={item.thumbnail?.thumbnailUrl} width="416" height="416" alt="Story Photo" className="mb-2" />
      ) : (
        <div className="w-full bg-gray-200 flex items-center aspect-square">
          <Image src="https://assets.nhle.com/logos/nhl/svg/NHL_light.svg" width="416" height="416" alt="Story Photo" className="" />
        </div>
      )}
    </Link>
    <p className="flex flex-wrap gap-1 my-3">
      {item.tags.filter((t) => t.extraData?.hideOnSite !== true).map((t) => (
        <Link href={`/?tag=${t.slug}`} key={t._entityId} className="text-xs p-1 text-nowrap border rounded">{t.title}</Link>
      ))}
    </p>
    <Link href={`https://nhl.com/news/${item.slug}`} className="">
      <h2 className="text-xl font-bold">{item.headline || item.title}</h2>
    </Link>
    <p className="text-justify line-clamp-3">{item.summary}</p>
    <Link href={`https://nhl.com/news/${item.slug}`} className="block font-bold py-3 underline">Read Story</Link>
  </div>
);

StoryCard.propTypes = {
  item: PropTypes.object.isRequired,
};

export default StoryCard;