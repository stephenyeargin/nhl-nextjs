'use client';

import React, { useState, useEffect, Suspense } from 'react';
import StoryCard from '@/app/components/StoryCard.tsx';
import NewsPageSkeleton from '@/app/components/NewsPageSkeleton.tsx';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const tag = 'news';

  useEffect(() => {
    const fetchNews = async () => {
      const newsResponse = await fetch('https://forge-dapi.d3.nhle.com/v2/content/en-us/stories?context.slug=nhl&tags.slug=news&$skip=0&$limit=22', { cache: 'no-store' });
      const newsItems = await newsResponse.json();
      setNews(newsItems.items);
    };
    if (tag) {
      fetchNews();
    }
  }, [tag]);

  if (!news || news.length === 0) {
    return <NewsPageSkeleton />;
  }

  return (
    <Suspense fallback={<NewsPageSkeleton />}>
      <div className="container px-2 mx-auto">
        {news.length > 0 && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Latest News</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
              <div className="mb-4 col-span-4 md:col-span-3">
                <StoryCard item={news[0]} size="large" />
              </div>
              <div className="mb-4 col-span-4 md:col-span-1">
                <StoryCard item={news[1]} size="medium" />
              </div>
              {news.slice(2, news.length).map((item, i) => (
                <div key={i} className="col-span-4 md:col-span-1">
                  <StoryCard item={item} showDate />
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
