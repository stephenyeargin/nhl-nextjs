'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatMarkdownContent } from '../utils/formatters';

interface GameStoryProps { game: { id: number | string; gameState: string } }
interface StoryItem { _entityId: string; slug: string; headline: string; summary?: string; fields?: { description?: string }; thumbnail?: { thumbnailUrl?: string } }
interface StoryResponse { items?: StoryItem[] }

const GameStory: React.FC<GameStoryProps> = ({ game }) => {
  const [content, setStoryContent] = useState<StoryResponse | null>(null);
  const type = game.gameState === 'FINAL' || game.gameState === 'OFF' ? 'game-recap' : 'game-preview';

  useEffect(() => {
    const fetchGameStory = async () => {
      const contentResponse = await fetch(`https://forge-dapi.d3.nhle.com/v2/content/en-us/stories?tags.slug=gameid-${game.id}&tags.slug=${type}&context.slug=nhl&$limit=1`);
  const json: StoryResponse = await contentResponse.json();
  setStoryContent(json);
    };

    fetchGameStory();
  }, [game.id, type]);

  if (!content || !content.items || content.items.length === 0) {
    return (<></>);
  }

  return (
    <>
  {content.items.map((item: StoryItem) => (
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
            <p className="text-sm mb-2" dangerouslySetInnerHTML={{ __html: formatMarkdownContent(item.summary) }} />
            <Link href={`/news/${item.slug}`} className="font-bold underline">Read Story</Link>
          </div>
        </div>
      ))}
    </>
  );
};

export default GameStory;
