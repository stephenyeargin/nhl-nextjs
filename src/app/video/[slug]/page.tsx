'use client';

import React, { useState, useEffect } from 'react';
import NewsPageSkeleton from '@/app/components/NewsPageSkeleton';
import { notFound, useParams } from 'next/navigation';
import { formatHeadTitle, formatLocalizedDate, formatLocalizedTime } from '@/app/utils/formatters';
import Link from 'next/link';
import { faFilm, faVideoCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import VideoCard from '@/app/components/VideoCard';
import type { VideoApiResponse, VideoDetailItem, VideoItemBase } from '@/app/types/video';

const VideoItemPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [video, setVideo] = useState<VideoDetailItem | null>(null);
  const [videos, setVideos] = useState<VideoItemBase[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const videoResponse = await fetch(
        `https://forge-dapi.d3.nhle.com/v2/content/en-us/videos/${slug}`,
        { cache: 'no-store' }
      );
      const videoItem: VideoDetailItem = await videoResponse.json();
      setVideo(videoItem);

      const videosResponse = await fetch(
        'https://forge-dapi.d3.nhle.com/v2/content/en-us/videos?context.slug=nhl&$skip=0&$limit=6',
        { cache: 'no-store' }
      );
      const videoItems: VideoApiResponse = await videosResponse.json();
      setVideos(
        videoItems.items.map((it: any) => ({
          slug: it.slug || String(it._entityId || ''),
          fields: it.fields || { description: it.summary },
          thumbnail: it.thumbnail
            ? {
                templateUrl: it.thumbnail.templateUrl || '',
                thumbnailUrl: it.thumbnail.thumbnailUrl || it.thumbnail.templateUrl || '',
              }
            : undefined,
          ...it,
        }))
      );
    };
    fetchVideos();
  }, [slug]);

  if (!video) {
    return <NewsPageSkeleton />;
  }

  if (video.status === 404) {
    return notFound();
  }

  const { fields } = video;
  formatHeadTitle(video.title);

  return (
    <div className="container px-2 mx-auto">
      <div className="my-5 text-xs text-center">
        <Link href="/video/" className="underline font-bold">
          <FontAwesomeIcon icon={faFilm} fixedWidth className="mr-1" />
          Back to Videos
        </Link>{' '}
        |{' '}
        <Link href={`https://nhl.com/video/${video.slug}`} className="underline font-bold">
          <FontAwesomeIcon icon={faVideoCamera} fixedWidth className="mr-1" />
          NHL.com Video
        </Link>
      </div>

      <iframe
        src={`https://players.brightcove.net/${fields.brightcoveAccountId}/default_default/index.html?videoId=${fields.brightcoveId}`}
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        className="w-full aspect-video"
        loading="lazy"
        title={fields.title}
      ></iframe>
      <div className="text-3xl font-bold my-5">{video.title}</div>
      <div className="my-5">{fields.longDescription}</div>
      <div className="my-5">
        {formatLocalizedDate(video.contentDate)} {formatLocalizedTime(video.contentDate)}
      </div>

      <hr className="my-3" />

      <div className="text-2xl font-bold my-5">Latest Videos</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {videos.map((item, i) => (
          <VideoCard key={i} item={item} className="col-span-1" />
        ))}
      </div>
    </div>
  );
};

export default VideoItemPage;
