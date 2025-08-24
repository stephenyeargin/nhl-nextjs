'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatLocalizedDate, formatLocalizedTime, formatMarkdownContent } from '../utils/formatters';

interface ThumbnailTemplate {
  templateUrl: string;
  thumbnailUrl?: string;
}

interface StoryItem {
  slug: string;
  headline?: string;
  title?: string;
  contentDate?: string;
  summary?: string;
  thumbnail?: ThumbnailTemplate;
  [key: string]: any;
}

interface MissingThumbnailProps { size?: 'small' | 'medium' | 'large'; }
const MissingThumbnail: React.FC<MissingThumbnailProps> = ({ size }) => (
  <div className={`w-full bg-gray-200 flex items-center justify-center aspect-square mb-2 ${size === 'medium' ? 'aspect-square' : 'aspect-video'}`}>
    <Image
      src="https://assets.nhle.com/logos/nhl/svg/NHL_light.svg"
      width="180"
      height="180"
      alt="Story Photo"
      className=""
    />
  </div>
);

interface StoryCardProps {
  item: StoryItem;
  size?: 'small' | 'medium' | 'large' | 'default';
  showDate?: boolean;
  className?: string;
}

const StoryCard: React.FC<StoryCardProps> = ({ item, size = 'default', showDate = false, className = '' }) => {
  const [blurDataURL, setBlurDataURL] = useState('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');

  useEffect(() => {
    const fetchBlurDataURL = async () => {
      const template = item.thumbnail?.templateUrl;
      if (!template) {return;}
      const url = template.replace('{formatInstructions}', 't_ratio16_9-size10/f_png');
      try {
        const data = await fetch(url);
        const base64 = await data.blob().then((blob) => new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
            reader.onloadend = () => resolve(String(reader.result));
        }));
        setBlurDataURL(base64);
      } catch (e) {
        // swallow errors, keep placeholder
      }
    };
    fetchBlurDataURL();
  }, [item.thumbnail]);

  if (blurDataURL === null) {
    return <></>;
  }

  if (size === 'small') {
    return (
      <div className={className}>
        <Link href={`/news/${item.slug}`} className="grid grid-cols-3 gap-4 items-center">
          <div className="col-span-1">
            {item.thumbnail ? (
              <Image
                src={item.thumbnail?.thumbnailUrl || 'https://assets.nhle.com/logos/nhl/svg/NHL_light.svg'}
                width="416"
                height="416"
                alt="Story Photo"
                className="mb-2 w-full"
                loading="lazy"
              />
            ) : (
              <MissingThumbnail />
            )}
          </div>
          <div className="col-span-2">
            <h2 className="text-base font-bold">{item.headline || item.title}</h2>
            {showDate && (
              <div>{formatLocalizedDate(item.contentDate)}</div>
            )}
          </div>
        </Link>
      </div>
    );
  }

  if (size === 'medium') {
    return(
      <div className={className}>
        <p className="hidden" suppressHydrationWarning>{formatLocalizedDate(item.contentDate)} {formatLocalizedTime(item.contentDate)}</p>
        <Link href={`/news/${item.slug}`} className="">
          {item.thumbnail ? (
            <Image
              src={item.thumbnail?.thumbnailUrl || 'https://assets.nhle.com/logos/nhl/svg/NHL_light.svg'}
              width="832"
              height="468"
              alt="Story Photo"
              className="mb-2 w-full"
              loading="lazy"
            />
          ) : (
            <MissingThumbnail size="medium" />
          )}
        </Link>
        <Link href={`/news/${item.slug}`} className="">
          <h2 className="text-xl font-bold">{item.headline || item.title}</h2>
        </Link>
        {showDate && (
          <div>{formatLocalizedDate(item.contentDate)}</div>
        )}
        <div className="text-justify line-clamp-3 text-sm" dangerouslySetInnerHTML={{ __html: formatMarkdownContent(item.summary) }} />
        <Link href={`/news/${item.slug}`} className="block font-bold py-3 underline">Read Story</Link>
      </div>
    );
  }

  if (size === 'large') {
    return (
      <div className={`md:relative ${className}`}>
        <Link href={`/news/${item.slug}`} className="">
          <Image
            src={(item.thumbnail?.templateUrl || '').replace('{formatInstructions}', 't_ratio16_9-size40/f_png') || 'https://assets.nhle.com/logos/nhl/svg/NHL_light.svg'}
            width="832"
            height="468"
            alt="Story Photo"
            className="w-full"
            placeholder="blur"
            blurDataURL={blurDataURL}
            loading="lazy"
          />
        </Link>
        <div className="md:absolute md:bottom-0 md:right-0 md:left-0 md:p-5 md:bg-black/70 md:text-white">
          <Link href={`/news/${item.slug}`} className="">
            <h2 className="text-2xl font-bold">{item.headline || item.title}</h2>
          </Link>
          <div className="text-justify line-clamp-3 text-sm" dangerouslySetInnerHTML={{ __html: formatMarkdownContent(item.summary)}} />
          <Link href={`/news/${item.slug}`} className="block font-bold py-3 underline">Read Story</Link>
        </div>
      </div>
    );
  }

  return(
    <div className={className}>
      <p className="hidden" suppressHydrationWarning>{formatLocalizedDate(item.contentDate)} {formatLocalizedTime(item.contentDate)}</p>
      <Link href={`/news/${item.slug}`} className="">
        {item.thumbnail ? (
          <Image
            src={(item.thumbnail?.templateUrl || '').replace('{formatInstructions}', 't_ratio16_9-size20/f_png') || 'https://assets.nhle.com/logos/nhl/svg/NHL_light.svg'}
            width="832"
            height="468"
            alt="Story Photo"
            className="mb-2 w-full"
            placeholder="blur"
            blurDataURL={blurDataURL}
            loading="lazy"
          />
        ) : (
          <MissingThumbnail />
        )}
      </Link>
      <Link href={`/news/${item.slug}`} className="">
        <h2 className="text-xl font-bold">{item.headline || item.title}</h2>
      </Link>
      {showDate && (
        <div className="text-xs text-gray-500 my-2">{formatLocalizedDate(item.contentDate, 'LL')}</div>
      )}
      <div className="text-justify line-clamp-3 text-sm" dangerouslySetInnerHTML={{ __html: formatMarkdownContent(item.summary) }} />
      <Link href={`/news/${item.slug}`} className="block font-bold py-3 underline">Read Story</Link>
    </div>
  );
};

export default StoryCard;
