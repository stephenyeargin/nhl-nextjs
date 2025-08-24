import React from 'react';
import { useStoryContext } from '../contexts/StoryContext';
import StoryCard from './StoryCard';
import GameTile from './GameTile';

interface RelationItem { _entityId: string | number; type?: string; slug?: string; [key: string]: any }
interface SidebarStories { items?: RelationItem[] }
interface StoryContextShape {
  story?: { relations?: RelationItem[] };
  game: any;
  sidebarStories: SidebarStories;
}

const StorySidebar = () => {
  const ctx = (useStoryContext() as StoryContextShape) || ({} as StoryContextShape);
  const story = ctx?.story || {};
  const game: any = ctx?.game || {};
  const sidebarStories: SidebarStories = ctx?.sidebarStories || {};

  return (
    <div className="my-5">
  {game?.id && (
        <div className="my-5">
          <GameTile game={game} style={{ display: 'block'}} />
        </div>
      )}

      {story?.relations && story.relations.filter((s: RelationItem) => s.type === 'story').length > 0 && (
        <div className="my-5">
          <h3 className="font-bold text-xl my-2 py-2 border-b">Related Stories</h3>
          {story.relations.filter((s: RelationItem) => s.type === 'story').map((relation: RelationItem) => (
            relation.slug ? (
              <StoryCard key={relation._entityId} item={relation as any} size="small" className="mb-2" />
            ) : null
          ))}
        </div>
      )}

      <h3 className="font-bold text-xl my-2 py-2 border-b">Top Stories</h3>
      {sidebarStories.items?.map((item: RelationItem) => (
        item.slug ? (
          <StoryCard key={item._entityId} item={item as any} size="small" className="mb-2" />
        ) : null
      ))}
    </div>
  );
};

export default StorySidebar;