import React from 'react';
import { useStoryContext } from '../contexts/StoryContext';
import StoryCard from './StoryCard';
import GameTile from './GameTile';

const StorySidebar = () => {
  const { storyData, gameData, sidebarStories } = useStoryContext();

  return (
    <div className="my-5">
      {gameData?.game && (
        <div className="my-5">
          <GameTile game={gameData.game} style={{ display: 'block'}} />
        </div>
      )}

      {storyData.story?.relations?.filter((s) => s.type === 'story').length > 0 && (
        <div className="my-5">
          <h3 className="font-bold text-xl my-2 py-2 border-b">Related Stories</h3>
          {storyData.story?.relations.filter((s) => s.type === 'story').map((relation) => (
            <StoryCard key={relation._entityId} item={relation} size="small" />
          ))}
        </div>
      )}

      <h3 className="font-bold text-xl my-2 py-2 border-b">Top Stories</h3>
      {sidebarStories.items?.map((item) => (
        <StoryCard key={item._entityId} item={item} size="small" />
      ))}
    </div>
  );
};

export default StorySidebar;