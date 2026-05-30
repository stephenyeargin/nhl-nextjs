'use client';

import React, { useEffect, useState } from 'react';
import StoryCard from '@/app/components/StoryCard';
import LoadMoreButton from '@/app/components/LoadMoreButton';
import type { PaginatedContentResponse, StoryItem } from '@/app/types/content';

interface SeriesCoverageProps {
  year: number;
  seriesString: string;
}

const PAGE_SIZE = 24;

function normalizeSeriesLetter(seriesString: string): string | null {
  const seriesLetter = seriesString.match(/(?:series-)?([a-z])(?:-coverage)?/i)?.[1]?.toLowerCase();

  return seriesLetter || null;
}

function getStoryIdentity(item: StoryItem): string {
  return String(item._entityId || item.slug || item.headline || item.title || 'story');
}

const SeriesCoverage: React.FC<SeriesCoverageProps> = ({ year, seriesString }) => {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const seriesLetter = normalizeSeriesLetter(seriesString);

  useEffect(() => {
    const fetchStories = async () => {
      if (!seriesLetter) {
        setHasMore(false);

        return;
      }

      try {
        const response = await fetch(
          `https://forge-dapi.d3.nhle.com/v2/content/en-us/stories?tags.slug=${year - 1}-${String(year).slice(-2)}&tags.slug=series-${seriesLetter}&context.slug=nhl&$skip=${offset}&$limit=${PAGE_SIZE}`,
          { cache: 'no-store' }
        );

        if (!response.ok) {
          setHasMore(false);

          return;
        }

        const payload: PaginatedContentResponse<StoryItem> = await response.json();
        setStories((prev) => {
          const seen = new Set(prev.map(getStoryIdentity));
          const incoming = (payload.items || []).filter((item) => {
            const identity = getStoryIdentity(item);
            if (seen.has(identity)) {
              return false;
            }
            seen.add(identity);

            return true;
          });

          return [...prev, ...incoming];
        });

        if (!payload.pagination?.nextUrl) {
          setHasMore(false);
        }
      } catch {
        setHasMore(false);
      }
    };

    fetchStories();
  }, [offset, seriesLetter, year]);

  if (stories.length === 0 && !hasMore) {
    return null;
  }

  return (
    <div className="my-5">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-4">Series Coverage</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {stories.map((item) => (
          <div key={getStoryIdentity(item)} className="col-span-4 md:col-span-1">
            <StoryCard item={item} showDate />
          </div>
        ))}
      </div>
      {hasMore && <LoadMoreButton handleClick={() => setOffset((prev) => prev + PAGE_SIZE)} />}
    </div>
  );
};

export default SeriesCoverage;
