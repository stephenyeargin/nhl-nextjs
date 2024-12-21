'use client';

import React, { useState, useEffect, Suspense } from 'react';
import StoryCard from './components/StoryCard';
import GameBodySkeleton from './components/GameBodySkeleton';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const tag = 'news';

  useEffect(() => {
    const fetchNews = async () => {
      const newsResponse = await fetch(`https://forge-dapi.d3.nhle.com/v2/content/en-us/stories?tags.slug=${tag}&context.slug=nhl&$limit=22`, { cache: 'no-store' });
      const newsItems = await newsResponse.json();
      setNews(newsItems.items);
    };
    if (tag) {
      fetchNews();
    }
  }, [tag]);

  if (!news || news.length === 0) {
    return <GameBodySkeleton />;
  }

  return (
    <Suspense fallback={<GameBodySkeleton />}>
      <div className="container mx-auto px-4 py-8">
        {news.length > 0 && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Latest News</h1>
            <div key={news[0]._entityId} className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
              <div className="mb-4 col-span-3">
                <StoryCard item={news[0]} size="large" />
              </div>
              {news.slice(1, news.length).map((item) => (
                <div key={item._entityId} className="col-span-4 md:col-span-1">
                  <StoryCard item={item} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default NewsPage;
