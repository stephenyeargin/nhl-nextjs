import React from 'react';
import { useStoryContext } from '../contexts/StoryContext';
import StoryCard from './StoryCard';
import GameTile, { type GameTileGame } from './GameTile';
import type { StoryItem } from '@/app/types/content';

interface RelationItem {
  _entityId: string | number;
  type?: string;
  slug?: string;
  [key: string]: unknown;
}
interface SidebarStories {
  items?: RelationItem[];
}
interface StoryContextShape {
  story?: { relations?: RelationItem[] };
  game?: { id?: string | number; [k: string]: unknown };
  sidebarStories: SidebarStories;
}

const StorySidebar = () => {
  const ctx = (useStoryContext() as StoryContextShape) || ({} as StoryContextShape);
  const story = ctx?.story || {};
  const game = ctx?.game || {};
  const sidebarStories: SidebarStories = ctx?.sidebarStories || {};
  const asStoryItem = (item: RelationItem): StoryItem | null =>
    typeof item.slug === 'string' ? (item as StoryItem) : null;

  return (
    <div className="my-5">
      {game?.id && (
        <div className="my-5">
          <GameTile game={game as unknown as GameTileGame} style={{ display: 'block' }} />
        </div>
      )}

      {story?.relations &&
        story.relations.filter((s: RelationItem) => s.type === 'story').length > 0 && (
          <div className="my-5">
            <h3 className="font-bold text-xl my-2 py-2 border-b">Related Stories</h3>
            {story.relations
              .filter((s: RelationItem) => s.type === 'story')
              .map((relation: RelationItem) => {
                const relationItem = asStoryItem(relation);

                return relationItem ? (
                  <StoryCard
                    key={relation._entityId}
                    item={relationItem}
                    size="small"
                    className="mb-2"
                  />
                ) : null;
              })}
          </div>
        )}

      <h3 className="font-bold text-xl my-2 py-2 border-b">Top Stories</h3>
      {sidebarStories.items?.map((item: RelationItem) => {
        const storyItem = asStoryItem(item);

        return storyItem ? (
          <StoryCard key={item._entityId} item={storyItem} size="small" className="mb-2" />
        ) : null;
      })}
    </div>
  );
};

export default StorySidebar;
