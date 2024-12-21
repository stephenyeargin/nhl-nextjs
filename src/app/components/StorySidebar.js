import React from 'react';
import { useStoryContext } from '../contexts/StoryContext';
import StoryCard from './StoryCard';

const StorySidebar = () => {
  const { storyData, sidebarStories } = useStoryContext();
  
  return (
    <div className="my-5">
      {storyData.story?.relations?.length > 0 && (
        <div className="my-5">
          <h3 className="font-bold text-xl my-2 py-2 border-b">Related Stories</h3>
          {storyData.story?.relations.map((relation) => (
            <StoryCard key={relation._entityId} item={relation} small />
          ))}
        </div>
      )}

      <h3 className="font-bold text-xl my-2 py-2 border-b">Top Stories</h3>
      {sidebarStories.items?.map((item) => (
        <StoryCard key={item._entityId} item={item} small />
      ))}
    </div>
  );
};

export default StorySidebar;