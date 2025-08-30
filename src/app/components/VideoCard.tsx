'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  formatLocalizedDate,
  formatLocalizedTime,
  formatMarkdownContent,
} from '../utils/formatters';
import type { VideoItemBase } from '@/app/types/video';

interface MissingThumbnailProps {
  size?: 'small' | 'medium' | 'large';
}

interface VideoCardProps {
  item: VideoItemBase;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  handleCardClick?: (_e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => void; // consumer may use event
}

const MissingThumbnail = ({ size }: MissingThumbnailProps) => (
  <div
    className={`w-full bg-gray-200 flex items-center justify-center aspect-square mb-2 ${size === 'medium' ? 'aspect-square' : 'aspect-video'}`}
  >
    <Image
      src="https://assets.nhle.com/logos/nhl/svg/NHL_light.svg"
      width="180"
      height="180"
      alt="Story Photo"
      className=""
    />
  </div>
);

const VideoCard = ({ item, size, className, handleCardClick }: VideoCardProps) => {
  const [blurDataURL, setBlurDataURL] = useState(
    'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
  );

  useEffect(() => {
    const fetchBlurDataURL = async () => {
      if (!item.thumbnail?.templateUrl) {
        return;
      }
      const data = await fetch(
        item.thumbnail.templateUrl.replace('{formatInstructions}', 't_ratio16_9-size10/f_png')
      );
      const base64 = await data.blob().then(
        (blob) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => resolve(reader.result as string);
          })
      );
      setBlurDataURL(base64);
    };
    fetchBlurDataURL();
  }, [item.thumbnail]);

  if (blurDataURL === null) {
    return <></>;
  }

  if (size === 'small') {
    return (
      <div className={className}>
        <Link
          onClick={handleCardClick}
          href={`/video/${item.slug}`}
          className="grid grid-cols-3 gap-4 items-center"
        >
          <div className="col-span-1">
            {item.thumbnail ? (
              <Image
                src={
                  item.thumbnail?.thumbnailUrl ||
                  'https://assets.nhle.com/logos/nhl/svg/NHL_light.svg'
                }
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
          </div>
        </Link>
      </div>
    );
  }

  if (size === 'medium') {
    return (
      <div className={className}>
        <p className="hidden" suppressHydrationWarning>
          {formatLocalizedDate(item.contentDate)} {formatLocalizedTime(item.contentDate)}
        </p>
        <Link onClick={handleCardClick} href={`/video/${item.slug}`} className="">
          {item.thumbnail ? (
            <Image
              src={
                item.thumbnail?.thumbnailUrl ||
                'https://assets.nhle.com/logos/nhl/svg/NHL_light.svg'
              }
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
        <Link onClick={handleCardClick} href={`/video/${item.slug}`} className="">
          <h2 className="text-xl font-bold">{item.headline || item.title}</h2>
        </Link>
        <div
          className="text-justify line-clamp-3 text-sm"
          dangerouslySetInnerHTML={{ __html: formatMarkdownContent(item.summary) }}
        />
        <Link
          onClick={handleCardClick}
          href={`/video/${item.slug}`}
          className="block font-bold py-3 underline"
        >
          Watch
        </Link>
      </div>
    );
  }

  if (size === 'large') {
    return (
      <div className={`md:relative ${className}`}>
        <Link onClick={handleCardClick} href={`/video/${item.slug}`} className="">
          <Image
            src={(item.thumbnail?.templateUrl || '').replace(
              '{formatInstructions}',
              't_ratio16_9-size40/f_png'
            )}
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
          <Link onClick={handleCardClick} href={`/video/${item.slug}`} className="">
            <h2 className="text-2xl font-bold">{item.headline || item.title}</h2>
          </Link>
          <div
            className="text-justify line-clamp-3 text-sm"
            dangerouslySetInnerHTML={{ __html: formatMarkdownContent(item.summary) }}
          />
          <Link href={`/video/${item.slug}`} className="block font-bold py-3 underline">
            Read Story
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="hidden" suppressHydrationWarning>
        {formatLocalizedDate(item.contentDate)} {formatLocalizedTime(item.contentDate)}
      </p>
      <Link onClick={handleCardClick} href={`/video/${item.slug}`} className="">
        {item.thumbnail ? (
          <Image
            src={(item.thumbnail?.templateUrl || '').replace(
              '{formatInstructions}',
              't_ratio16_9-size20/f_png'
            )}
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
        <h2 className="text-xl font-bold">{item.headline || item.title}</h2>
        <div className="text-sm mt-3">{item.fields.description}</div>
      </Link>
    </div>
  );
};

export default VideoCard;
