import React from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import StoryCard from './components/StoryCard';
import { PropTypes } from 'prop-types';

dayjs.extend(LocalizedFormat);

const NewsPage = async ({ searchParams }) => {
  const { tag } = await searchParams;

  const newsResponse = await fetch(`https://forge-dapi.d3.nhle.com/v2/content/en-us/stories?tags.slug=${tag || 'news'}`, { cache: 'no-store' });
  const news = await newsResponse.json();

  return (
    <div className="container mx-auto px-4 py-8">
      {news.items?.length > 0 && (
        <>
          <h1 className="text-3xl font-bold mb-6">News</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
            {news.items.map((item) => (
              <StoryCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

NewsPage.propTypes = {
  searchParams: PropTypes.shape({
    tag: PropTypes.string,
  }).isRequired,
};

export default NewsPage;