'use client';

import React, { useState, useEffect, Suspense } from 'react';
import StoryCard from '@/app/components/StoryCard';
import { notFound, useParams } from 'next/navigation';
import NewsPageSkeleton from '@/app/components/NewsPageSkeleton';
import LoadMoreButton from '@/app/components/LoadMoreButton';

const NewsTagPage = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [tagData, setTagData] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { tag } = useParams();

  useEffect(() => {
    const fetchNews = async () => {
      const tagResponse = await fetch(`https://forge-dapi.d3.nhle.com/v2/content/en-us/tags/${tag}`, { cache: 'no-store' });
      const tagData = await tagResponse.json();
      setTagData(tagData);

      const newsResponse = await fetch(`https://forge-dapi.d3.nhle.com/v2/content/en-us/stories?tags.slug=${tag}&context.slug=nhl&$skip=${offset}&$limit=24`, { cache: 'no-store' });
      const news = await newsResponse.json();
      setNewsItems((prevNewsItems) => [...prevNewsItems, ...news.items]);

      if (!news.pagination.nextUrl) {
        setHasMore(false);
      }
    };
    if (tag) {
      fetchNews();
    }
  }, [tag, offset]);

  if (!newsItems) {
    return <NewsPageSkeleton />;
  }

  if (newsItems.length === 0 && hasMore === false) {
    return notFound();
  }

  const handleLoadMoreButton = () => {
    setOffset(offset + 24);
  };

  return (
    <Suspense fallback={<NewsPageSkeleton />}>
      <div className="container mx-auto px-4 py-8">
        {newsItems.length > 0 && (
          <div>
            <h1 className="text-3xl font-bold mb-6">{tagData.title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
              {newsItems.map((item, i) => (
                <div key={i} className="col-span-4 md:col-span-1">
                  <StoryCard item={item} showDate />
                </div>
              ))}
            </div>
          </div>
        )}
        {hasMore && (
          <LoadMoreButton handleClick={handleLoadMoreButton} />
        )}
      </div>
    </Suspense>
  );
};

export default NewsTagPage;
