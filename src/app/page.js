import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PropTypes } from 'prop-types';
import StoryCard from './components/StoryCard';
import { formatMarkdownContent } from './utils/formatters';

const NewsPage = async ({ searchParams }) => {
  const { tag } = await searchParams;

  const newsResponse = await fetch(`https://forge-dapi.d3.nhle.com/v2/content/en-us/stories?tags.slug=${tag || 'news'}&context.slug=nhl&$limit=22`, { cache: 'no-store' });
  const news = await newsResponse.json();

  if (news.items.length === 0) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {news.items?.length > 0 && (
        <div>
          <h1 className="text-3xl font-bold mb-6">Latest News</h1>
          <div key={news.items[0]._entityId} className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
            <div className="mb-4 col-span-3">
              <div className="md:relative">
                <Link href={`/news/${news.items[0].slug}`} className="">
                  <Image src={news.items[0].thumbnail?.templateUrl.replace('{formatInstructions}', 't_ratio16_9-size40/f_png/')} width="832" height="468" alt="Story Photo" className="w-full" />
                </Link>
                <div className="md:absolute md:bottom-0 md:right-0 md:left-0 md:p-5 md:bg-black/70 md:text-white">
                  <Link href={`/news/${news.items[0].slug}`} className="">
                    <h2 className="text-2xl font-bold">{news.items[0].headline || news.items[0].title}</h2>
                  </Link>
                  <div className="text-justify line-clamp-3 text-sm" dangerouslySetInnerHTML={{ __html: formatMarkdownContent(news.items[0].summary)}} />
                  <Link href={`/news/${news.items[0].slug}`} className="block font-bold py-3 underline">Read Story</Link>
                </div>
              </div>
            </div>
            {news.items.slice(1, news.items.length).map((item) => (
              <div key={item._entityId} className="col-span-4 md:col-span-1">
                <StoryCard item={item} />
              </div>
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