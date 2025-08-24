import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { formatHeadTitle, formatLocalizedDate } from '@/app/utils/formatters';

// Context & Custom Hook
const StoryContext = createContext();
export const useStoryContext = () => useContext(StoryContext);

// Helper function for fetching data
const fetchJsonData = async (url) => {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }

  return response.json();
};

// Fetch story data based on the storyId
const fetchStory = async (storyId) => {
  const isLegacyStory = /^c-\d+$/.test(storyId);
  if (isLegacyStory) {
    // Handle legacy story by looking up homebase content
    const homebaseContent = await fetchJsonData(
      `https://forge-dapi.d3.nhle.com/v2/content/en-us/stories/?fields.homebaseId=${storyId.replace('c-', '')}`
    );

    return homebaseContent.items[0].slug;
  }

  // Otherwise, fetch the full story data
  return await fetchJsonData(`https://forge-dapi.d3.nhle.com/v2/content/en-us/stories/${storyId}`);
};

// Fetch sidebar stories
const fetchSidebarStories = async () => {
  return await fetchJsonData(
    'https://forge-dapi.d3.nhle.com/v2/content/en-us/stories?tags.slug=news&context.slug=nhl&$limit=5'
  );
};

// Fetch game data based on the story's game tag
const fetchGameData = async (gameId) => {
  return await fetchJsonData(`/api/nhl/gamecenter/${gameId}/landing`);
};

// Story Provider Component
export const StoryProvider = ({ storyId, children }) => {
  const [story, setStory] = useState({});
  const [game, setGame] = useState({});
  const [players, setPlayers] = useState([]);
  const [sidebarStories, setSidebarStories] = useState([]);
  const [pageError, setPageError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Step 1: Fetch story
        const storyResponse = await fetchStory(storyId);

        if (typeof storyResponse === 'string') {
          return window.location.replace(`/news/${storyResponse}`);
        }

        const topStories = await fetchSidebarStories();

        const gameTag = storyResponse.tags.find((t) => t.externalSourceName === 'game');
        if (gameTag) {
          const gameId = gameTag.extraData.gameId;
          const gameResponse = await fetchGameData(gameId);
          setGame(gameResponse);
        }

        const playerTags = storyResponse.tags.filter((t) => t.externalSourceName === 'player');
        if (playerTags.length) {
          setPlayers(playerTags);
        }

        setSidebarStories(topStories);
        setStory(storyResponse);

        formatHeadTitle(`${formatLocalizedDate(storyResponse.contentDate)}: ${storyResponse.headline || storyResponse.title}`);

      } catch (error) {
        setPageError({ message: 'Failed to load story. Please try again later.', error });
        console.error('Error fetching story data:', error);
      }
    };

    loadData();
  }, [storyId]); // only re-run if story/storyId changes

  return (
    <StoryContext.Provider value={{ story, game, players, sidebarStories, pageError }}>
      {children}
    </StoryContext.Provider>
  );
};

// Prop Types Validation
StoryProvider.propTypes = {
  storyId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default StoryProvider;
