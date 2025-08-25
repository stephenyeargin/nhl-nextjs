'use client';

import React, { useState, useEffect, Suspense } from 'react';
import StoryCard from '@/app/components/StoryCard';
import NewsPageSkeleton from '@/app/components/NewsPageSkeleton';
import { StoryItem, PaginatedContentResponse } from '@/app/types/content';

// Contract:
// - Fetch latest 22 news stories for NHL context tagged 'news'.
// - Show skeleton while loading or if empty; once loaded render featured layout.

const TAG = 'news';

const fetchNews = async (): Promise<StoryItem[]> => {
  try {
    const res = await fetch('https://forge-dapi.d3.nhle.com/v2/content/en-us/stories?context.slug=nhl&tags.slug=news&$skip=0&$limit=22', { cache: 'no-store' });
    if (!res.ok) {
      return [];
    }
  const json: PaginatedContentResponse<StoryItem> = await res.json();

  return json.items || [];
  } catch (_e) {
    return [];
  }
};

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<StoryItem[]>([]);

  useEffect(() => {
    if (!TAG) {return;}
    fetchNews().then(setNews);
  }, []);

  if (!news || news.length === 0) {
    return <NewsPageSkeleton />;
  }

  return (
    <Suspense fallback={<NewsPageSkeleton />}> {/* Suspense retained for parity, though data is client-fetched */}
      <div className="container px-2 mx-auto">
        {news.length > 0 && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Latest News</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
              <div className="mb-4 col-span-4 md:col-span-3">
                <StoryCard item={news[0]} size="large" />
              </div>
              {news[1] && (
                <div className="mb-4 col-span-4 md:col-span-1">
                  <StoryCard item={news[1]} size="medium" />
                </div>
              )}
              {news.slice(2).map((item, i) => (
                <div key={item._entityId || i} className="col-span-4 md:col-span-1">
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
