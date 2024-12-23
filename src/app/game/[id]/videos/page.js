'use client';

import React, { useEffect, useState, useRef } from 'react';
import GameBodySkeleton from '@/app/components/GameBodySkeleton.js';
import { PropTypes } from 'prop-types';
import { redirect, useParams } from 'next/navigation';
import VideoCard from '@/app/components/VideoCard';
import { useGameContext } from '@/app/contexts/GameContext';
import { formatLocalizedDate, formatLocalizedTime } from '@/app/utils/formatters';

const Videos = () => {
  const { id } = useParams();
  const { gameState } = useGameContext();
  const videoPlayerRef = useRef(null);

  // Initial state for the game data
  const [videos, setVideos] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  // Use `useEffect` to run once on initial render and set up polling
  useEffect(() => {
    // Function to fetch the live game data
    const fetchGameVideos = async () => {
      let videos;

      try {
        const videosResponse = await fetch(`https://forge-dapi.d3.nhle.com/v2/content/en-us/videos?tags.slug=gameid-${id}&context.slug=nhl`, { cache: 'no-store' });
        videos = await videosResponse.json();
      } catch (error) {
        console.error('Error fetching related videos:', error);

        return;
      }

      setVideos(videos.items);
    };

    // Initial fetch on page load
    fetchGameVideos();

    // Only set up polling if gameState is one of the following values: 'PRE', 'LIVE', 'CRIT'
    if (['PRE', 'LIVE', 'CRIT'].includes(gameState)) {
      const intervalId = setInterval(() => {
        fetchGameVideos();
      }, 20000); // 20 seconds polling interval

      // Cleanup the interval when component unmounts or gameState changes
      return () => clearInterval(intervalId);
    }
  }, [ id, gameState ]);

  // If game data is loading, show loading indicator
  if (!videos) {
    return <GameBodySkeleton />;
  }

  if (['PRE', 'FUT'].includes(gameState)) {
    return redirect(`/game/${id}`);
  }

  if (videos.length === 0) {
    return (
      <div className="text-center">
        <div className="p-10 text-2xl mx-40">  
          <div className="text-center bg-gray-500 aspect-video p-10 items-center opacity-50 animate-pulse" />
          <div className="my-5">
            No game highlight videos yet.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="viewTop">
      {activeVideo && (
        <div className="mb-5">
          <iframe
            ref={videoPlayerRef}
            src={`https://players.brightcove.net/${activeVideo.fields.brightcoveAccountId}/default_default/index.html?videoId=${activeVideo.fields.brightcoveId}`}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            className="w-full aspect-video"
            loading="lazy"
            title={activeVideo.fields.title}
          ></iframe>
          <div className="text-3xl font-bold my-5">{activeVideo.title}</div>
          <div className="my-5">{activeVideo.fields.longDescription}</div>
          <div className="my-5">{formatLocalizedDate(activeVideo.contentDate)} {formatLocalizedTime(activeVideo.contentDate)}</div>
    
          <hr className="my-3" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {videos.map((item, i) => (
          <VideoCard
            key={i}
            item={item}
            className="col-span-1"
            handleCardClick={(e) => {
              const myDiv = document.getElementById('viewTop');
              const rect = myDiv.getBoundingClientRect();
              e.preventDefault();
              setActiveVideo(item);
              window.scrollTo({
                top: window.scrollY + rect.top - 200,
                behavior: 'smooth'
              });
            }}
          />
        ))}
      </div>
    </div>
    
  );
};

Videos.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default Videos;
