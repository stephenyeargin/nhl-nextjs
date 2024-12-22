'use client';

import React, { useState, useEffect, Suspense } from 'react';
import StoryCard from '@/app/components/StoryCard';
import { useParams } from 'next/navigation';
import NewsPageSkeleton from '@/app/components/NewsPageSkeleton';

const NewsTagPage = () => {
  const [newsData, setNewsData] = useState({});
  const { tag } = useParams();

  useEffect(() => {
    const fetchNews = async () => {
      const tagResponse = await fetch(`https://forge-dapi.d3.nhle.com/v2/content/en-us/tags/${tag}`, { cache: 'no-store' });
      const tagData = await tagResponse.json();

      const newsResponse = await fetch(`https://forge-dapi.d3.nhle.com/v2/content/en-us/stories?tags.slug=${tag}&context.slug=nhl&$limit=24`, { cache: 'no-store' });
      const newsItems = await newsResponse.json();

      setNewsData({ items: newsItems.items, tag: tagData });
    };
    if (tag) {
      fetchNews();
    }
  }, [tag]);

  if (!newsData || newsData.items?.length === 0) {
    return <NewsPageSkeleton />;
  }

  return (
    <Suspense fallback={<NewsPageSkeleton />}>
      <div className="container mx-auto px-4 py-8">
        {newsData.items?.length > 0 && (
          <div>
            <h1 className="text-3xl font-bold mb-6">{newsData.tag.title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
              {newsData.items.map((item) => (
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

export default NewsTagPage;
