'use client';

import type { ReactNode } from 'react';
import React, { Suspense } from 'react';
import GameBodySkeleton from '@/app/components/GameBodySkeleton';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { StoryProvider } from '@/app/contexts/StoryContext';
import StorySidebar from '@/app/components/StorySidebar';
import { useParams } from 'next/navigation';

interface NewsLayoutProps {
  children: ReactNode;
}

const NewsLayout: React.FC<NewsLayoutProps> = ({ children }) => {
  const { slug: storyId } = useParams<{ slug: string }>();

  return (
    <StoryProvider storyId={storyId}>
      <Suspense fallback={<GameBodySkeleton />}>
        <div className="container px-2 mx-auto">
          <div className="my-5 text-xs text-center">
            <Link href="/" className="underline font-bold">
              <FontAwesomeIcon icon={faHome} fixedWidth className="mr-1" />
              Back to News
            </Link>{' '}
            |{' '}
            <Link href={`https://nhl.com/news/${storyId}`} className="underline font-bold">
              <FontAwesomeIcon icon={faNewspaper} fixedWidth className="mr-1" />
              NHL.com Story
            </Link>
          </div>

          <hr />

          <div className="grid grid-cols-4 gap-10">
            <div className="col-span-4 md:col-span-3">{children}</div>

            <div className="col-span-4 md:col-span-1">
              <StorySidebar />
            </div>
          </div>
        </div>
      </Suspense>
    </StoryProvider>
  );
};

export default NewsLayout;
