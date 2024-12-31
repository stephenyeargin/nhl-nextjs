import React from 'react';
import { useStoryContext } from '../contexts/StoryContext';
import StoryCard from './StoryCard';
import GameTile from './GameTile';

const StorySidebar = () => {
  const { story, game, sidebarStories } = useStoryContext();

  return (
    <div className="my-5">
      {game.id && (
        <div className="my-5">
          <GameTile game={game} style={{ display: 'block'}} />
        </div>
      )}

      {story?.relations?.filter((s) => s.type === 'story').length > 0 && (
        <div className="my-5">
          <h3 className="font-bold text-xl my-2 py-2 border-b">Related Stories</h3>
          {story?.relations.filter((s) => s.type === 'story').map((relation) => (
            <StoryCard key={relation._entityId} item={relation} size="small" className="mb-2" />
          ))}
        </div>
      )}

      <h3 className="font-bold text-xl my-2 py-2 border-b">Top Stories</h3>
      {sidebarStories.items?.map((item) => (
        <StoryCard key={item._entityId} item={item} size="small" className="mb-2" />
      ))}
    </div>
  );
};

export default StorySidebar;