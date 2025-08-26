'use client';

import React, { useState, useEffect } from 'react';
import NewsPageSkeleton from '@/app/components/NewsPageSkeleton';
import VideoCard from '@/app/components/VideoCard';
import { formatHeadTitle } from '@/app/utils/formatters';
import LoadMoreButton from '@/app/components/LoadMoreButton';
import type { VideoApiResponse, VideoItemBase } from '@/app/types/video';

const VideoPage: React.FC = () => {
  const [videos, setVideos] = useState<VideoItemBase[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      const videosResponse = await fetch(
        `https://forge-dapi.d3.nhle.com/v2/content/en-us/videos?context.slug=nhl&$skip=${offset}&$limit=24`,
        { cache: 'no-store' }
      );
      const videoItems: VideoApiResponse = await videosResponse.json();
      const normalized: VideoItemBase[] = videoItems.items.map(
        (it: any) =>
          ({
            slug: it.slug || String(it._entityId || ''),
            fields: it.fields || { description: it.summary },
            ...it,
          }) as VideoItemBase
      );
      setVideos((prev) => [...prev, ...normalized]);
      if (!videoItems.pagination?.nextUrl) {
        setHasMore(false);
      }
    };
    fetchVideos();
  }, [offset]);

  if (!videos || videos.length === 0) {
    return <NewsPageSkeleton />;
  }

  const handleLoadMoreButton = () => {
    setOffset((o) => o + 24);
  };

  formatHeadTitle('Videos');

  return (
    <div className="container px-2 mx-auto">
      <div className="text-3xl font-bold mb-6">Videos</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {videos.map((item, i) => (
          <VideoCard key={i} item={item} className="col-span-1" />
        ))}
      </div>
      {hasMore && <LoadMoreButton handleClick={handleLoadMoreButton} />}
    </div>
  );
};

export default VideoPage;
