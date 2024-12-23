'use client';

import React, { useState, useEffect } from 'react';
import NewsPageSkeleton from '@/app/components/NewsPageSkeleton';
import { useParams } from 'next/navigation';
import { formatHeadTitle, formatLocalizedDate, formatLocalizedTime } from '@/app/utils/formatters';
import Link from 'next/link';
import { faFilm, faVideoCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import VideoCard from '@/app/components/VideoCard';

const VideoItemPage = () => {
  const { slug } = useParams();
  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  
  useEffect(() => {
    const fetchVideos = async () => {
      const videoResponse = await fetch(`https://forge-dapi.d3.nhle.com/v2/content/en-us/videos/${slug}`, { cache: 'no-store' });
      const videoItem = await videoResponse.json();
      setVideo(videoItem);

      const videosResponse = await fetch('https://forge-dapi.d3.nhle.com/v2/content/en-us/videos?context.slug=nhl&$skip=0&$limit=6', { cache: 'no-store' });
      const videoItems = await videosResponse.json();
      setVideos(videoItems.items);
    };
    fetchVideos();
  }, []);
  
  if (!video) {
    return <NewsPageSkeleton />;
  }

  const { fields } = video;
  formatHeadTitle(video.title);

  return (
    <div className="container mx-auto">
      <div className="my-5 text-xs text-center">
        <Link href="/videos/" className="underline font-bold"><FontAwesomeIcon icon={faFilm} fixedWidth className="mr-1" />Back to Videos</Link>
        {' '}|{' '}
        <Link href={`https://nhl.com/video/${video.slug}`} className="underline font-bold"><FontAwesomeIcon icon={faVideoCamera} fixedWidth className="mr-1" />NHL.com Video</Link>
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
      <div className="my-5">{formatLocalizedDate(video.contentDate)} {formatLocalizedTime(video.contentDate)}</div>

      <hr className="my-3" />

      <div className="text-2xl font-bold my-5">Latest Videos</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {videos.map((item, i) => {
          return (
            <VideoCard
              key={i}
              item={item}
              size=""
              className="col-span-1"
            />
          );
        })}
      </div>
    </div>
  );
};

export default VideoItemPage;
