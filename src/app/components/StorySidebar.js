import React from 'react';
import { useStoryContext } from '../contexts/StoryContext';
import StoryCard from './StoryCard';

const StorySidebar = () => {
  const { sidebarStories } = useStoryContext();
  
  return (
    <div className="my-5">
      {sidebarStories.items?.map((item) => (
        <StoryCard key={item._entityId} item={item} small />
      ))}
    </div>
  );
};

export default StorySidebar;