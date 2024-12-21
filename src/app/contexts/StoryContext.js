import React, { createContext, useState, useEffect, useContext } from 'react';
import { PropTypes } from 'prop-types';
import { formatHeadTitle } from '../utils/formatters';

const StoryContext = createContext();

export const useStoryContext = () => useContext(StoryContext);

export const StoryProvider = ({ storyId, children }) => {
  const [storyData, setStoryData] = useState({});
  const [gameData, setGameData] = useState({});
  const [sidebarStories, setSidebarStories] = useState({});
  const [pageError, setPageError] = useState(null);

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        const storyResponse = await fetch(`https://forge-dapi.d3.nhle.com/v2/content/en-us/stories/${storyId}`, { cache: 'no-store' });
        if (!storyResponse.ok) {
          throw new Error('Failed to fetch content');
        }
        const story = await storyResponse.json();

        const topStoriesResponse = await fetch('https://forge-dapi.d3.nhle.com/v2/content/en-us/stories?tags.slug=news&context.slug=nhl&$limit=5', { cache: 'no-store' });
        const topStories = await topStoriesResponse.json();

        // If the story has a game tag, fetch the game data
        const gameTag = story.tags.find((t) => t.externalSourceName === 'game');
        let game;
        if (gameTag) {
          const gameId = gameTag.extraData.gameId;
          const gameResponse = await fetch(`/api/nhl/gamecenter/${gameId}/landing`, { cache: 'no-store' });
          if (gameResponse.ok) {
            game = await gameResponse.json();
          }
        }

        setSidebarStories(topStories);
        setStoryData({ story });
        setGameData({ game });

        // Set page title
        formatHeadTitle(`${story.headline || story.title}`);
      } catch (error) {
        setPageError({ message: 'Failed to load story. Please try again later.', error });
        console.error('Error fetching story data:', error);
      }
    };

    // Initial fetch
    fetchStoryData();    

  }, [storyId]); // only re-run if storyId changes

  return (
    <StoryContext.Provider value={{ storyData, gameData, sidebarStories, pageError }}>
      {children}
    </StoryContext.Provider>
  );
};

StoryProvider.propTypes = {
  storyId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default StoryProvider;
