'use client';

import React, { useState, useEffect } from 'react';
import NewsPageSkeleton from '@/app/components/NewsPageSkeleton';
import VideoCard from '../components/VideoCard';
import { formatHeadTitle } from '../utils/formatters';

const VideoPage = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const videosResponse = await fetch('https://forge-dapi.d3.nhle.com/v2/content/en-us/videos?context.slug=nhl&$skip=0&$limit=24', { cache: 'no-store' });
      const videoItems = await videosResponse.json();
      setVideos(videoItems.items);
    };
    fetchVideos();
  }, []);
  
  if (!videos || videos.length === 0) {
    return <NewsPageSkeleton />;
  }

  formatHeadTitle('Videos');

  return (
    <div className="container mx-auto py-8">
      <div className="text-3xl font-bold mb-6">Videos</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {videos.map((item, i) => (
          <VideoCard key={i} item={item} className="col-span-1" />
        ))}
      </div>
    </div>
  );
};

export default VideoPage;