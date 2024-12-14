import React from 'react';
import StoryCard from './components/StoryCard';
import { PropTypes } from 'prop-types';

const NewsPage = async ({ searchParams }) => {
  const { tag } = await searchParams;

  const newsResponse = await fetch(`https://forge-dapi.d3.nhle.com/v2/content/en-us/stories?tags.slug=${tag || 'news'}`, { cache: 'no-store' });
  const news = await newsResponse.json();

  return (
    <div className="container mx-auto px-4 py-8">
      {news.items?.length > 0 && (
        <div>
          <h1 className="text-3xl font-bold mb-6">Latest News</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
            {news.items.map((item) => (
              <StoryCard key={item.entityId} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

NewsPage.propTypes = {
  searchParams: PropTypes.shape({
    tag: PropTypes.string,
  }).isRequired,
};

export default NewsPage;