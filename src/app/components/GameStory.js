'use client';

import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';

const GameStory = ({ game }) => {
  const [content, setStoryContent] = useState(null);
  const type = game.gameState === 'FINAL' || game.gameState === 'OFF' ? 'game-recap' : 'game-preview';

  useEffect(() => {
    const fetchGameStory = async () => {
      const contentResponse = await fetch(`https://forge-dapi.d3.nhle.com/v2/content/en-us/stories?tags.slug=gameid-${game.id}&tags.slug=${type}&context.slug=nhl`);
      const content = await contentResponse.json();
  
      setStoryContent(content);
    };

    fetchGameStory();
  }, [game.id, type]);

  if (!content || !content.items || content.items.length === 0) {
    return (<></>);
  }

  return (
    <>
      {content.items.map((item) => (
        <div key={item._entityId} className="mb-4 p-4 flex flex-wrap md:flex-nowrap gap-5 border rounded leading-2">
          {item.thumbnail?.thumbnailUrl && (
            <Link href={`/news/${item.slug}`}>
              <Image
                src={item.thumbnail.thumbnailUrl}
                width="416"
                height="416"
                alt="Story Photo"
                className="w-full"
              />
            </Link>
          )}
          <div>
            <h1 className="text-2xl font-bold mb-2">
              <Link href={`/news/${item.slug}`}>{item.headline}</Link>
            </h1>
            <h2 className="text-lg text-slate-500 mb-2">{item.fields?.description}</h2>
            <p className="text-sm mb-2">{item.summary}</p>
            <Link href={`/news/${item.slug}`} className="font-bold underline">Read Story</Link>
          </div>
        </div>
      ))}
    </>
  );
};

GameStory.propTypes = {
  game: PropTypes.object.isRequired,
};

export default GameStory;