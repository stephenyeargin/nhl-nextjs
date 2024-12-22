'use client';

import React, { Suspense } from 'react';
import { PropTypes } from 'prop-types';
import GameBodySkeleton from '@/app/components/GameBodySkeleton';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { StoryProvider } from '@/app/contexts/StoryContext';
import StorySidebar from '@/app/components/StorySidebar';
import { useParams } from 'next/navigation';

const NewsLayout = ({ children }) => {
  const { slug: storyId } = useParams();

  return (
    <StoryProvider storyId={storyId}>
      <Suspense fallback={<GameBodySkeleton />}>
        <div className="container mx-auto">
          <div className="my-5 text-xs text-center">
            <Link href="/" className="underline font-bold"><FontAwesomeIcon icon={faHome} fixedWidth className="mr-1" />Back to News</Link>
            {' '}|{' '}
            <Link href={`https://nhl.com/news/${storyId}`} className="underline font-bold"><FontAwesomeIcon icon={faNewspaper} fixedWidth className="mr-1" />NHL.com Story</Link>
          </div>

          <hr />

          <div className="grid grid-cols-4 gap-10">
            <div className="col-span-4 md:col-span-3">
              {children}
            </div>

            <div className="col-span-4 md:col-span-1">
              <StorySidebar />
            </div>
          </div>
        </div>
      </Suspense>
    </StoryProvider>
  );
};

NewsLayout.propTypes = {
  children: PropTypes.node.isRequired,
  params: PropTypes.shape({
    slug: PropTypes.string.isRequired,
  }).isRequired,
};

export default NewsLayout;