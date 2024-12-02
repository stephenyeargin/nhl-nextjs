'use client';

import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';

const GameStory = ({ game }) => {
  const [content, setStoryContent] = useState(null);

  useEffect(() => {
    const fetchGameStory = async () => {
      const contentResponse = await fetch(`https://forge-dapi.d3.nhle.com/v2/content/en-us/stories?tags.slug=gameid-${game.id}&tags.slug=game-recap&context.slug=nhl`);
      const content = await contentResponse.json();
  
      setStoryContent(content);
    };

    fetchGameStory();
  }, [game.id]);

  if (!content || !content.items || content.items.length === 0) {
    return null;
  }

  return (
    <div className="p-4 flex flex-wrap md:flex-nowrap gap-5 border rounded leading-2">
      <Link href={`https://www.nhl.com/news/${content.items[0].slug}`}>
        <Image src={content.items[0].thumbnail.thumbnailUrl} width="416" height="416" alt="Story Photo" />
      </Link>
      <div>
        <h1 className="text-2xl font-bold mb-2"><Link href={`https://www.nhl.com/news/${content.items[0].slug}`}>{content.items[0].headline}</Link></h1>
        <h2 className="text-lg text-slate-500 mb-2">{content.items[0].fields?.description}</h2>
        <p className="text-md mb-2">{content.items[0].summary}</p>
        <Link href={`https://www.nhl.com/news/${content.items[0].slug}`} className="font-bold underline">Read Story</Link>
      </div>
    </div>
  );
};

GameStory.propTypes = {
  game: PropTypes.object.isRequired,
};

export default GameStory;