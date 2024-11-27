import React, { createContext, useState, useEffect, useContext } from 'react';
import { PropTypes } from 'prop-types';
import { GAME_STATES } from '../utils/constants';
import { formatHeadTitle } from '../utils/formatters';

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ gameId, children }) => {
  const [gameData, setGameData] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [pageError, setPageError] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchGameData = async () => {
      let game, rightRail, story;
      try {
        const gameResponse = await fetch(`/api/nhl/gamecenter/${gameId}/landing`, { cache: 'no-store' });
        const rightRailResponse = await fetch(`/api/nhl/gamecenter/${gameId}/right-rail`, { cache: 'no-store' });
        const storyResponse = await fetch(`/api/nhl/wsc/game-story/${gameId}`, { cache: 'no-store' });

        if (!gameResponse.ok || !rightRailResponse.ok || !storyResponse.ok) {
          throw new Error('Failed to fetch game data');
        }

        game = await gameResponse.json();
        rightRail = await rightRailResponse.json();
        story = await storyResponse.json();

        // Set page title
        formatHeadTitle(`${game.homeTeam.abbrev} vs. ${game.awayTeam.abbrev}`);
        if (game.gameState && !['FUT', 'PRE'].includes(game.gameState)) {
          formatHeadTitle(`${game.awayTeam.abbrev} (${game.awayTeam.score}) vs. ${game.homeTeam.abbrev} (${game.homeTeam.score}) - ${GAME_STATES[game.gameState]}`);
        }
      } catch (error) {
        setPageError({ message: 'Failed to load the game data. Please try again later.', error });
        console.error('Error fetching game data:', error);
      }

      const { homeTeam, awayTeam, gameDate, venue, venueLocation, summary, matchup } = game || {};
      setGameData({ homeTeam, awayTeam, gameDate, venue, venueLocation, summary, matchup, game, rightRail, story });
      setGameState(game ? game.gameState : null);
    };

    // Initial fetch
    fetchGameData();
   
    // Polling interval (only if the game is in progress)
    if (['PRE', 'LIVE', 'CRIT'].includes(gameState)) {
      intervalId = setInterval(() => {
        fetchGameData();
      }, 20000); // 20 seconds
    }
    
    return () => clearInterval(intervalId);
  }, [gameId, gameState]); // only re-run if gameState or gameId changes

  return (
    <GameContext.Provider value={{ gameData, gameState, pageError }}>
      {children}
    </GameContext.Provider>
  );
};

GameProvider.propTypes = {
  gameId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default GameProvider;
