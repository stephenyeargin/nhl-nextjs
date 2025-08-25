import React, { createContext, useState, useEffect, useContext } from 'react';
import { GAME_STATES } from '@/app/utils/constants';
import { formatHeadTitle } from '@/app/utils/formatters';

// --- Domain shapes (partial) ---
interface TeamSide { abbrev: string; score?: number; [k: string]: any }
interface GameLanding {
  gameState?: string;
  gameScheduleState?: string;
  homeTeam: TeamSide;
  awayTeam: TeamSide;
  gameDate?: string;
  venue?: any;
  venueLocation?: any;
  summary?: any;
  matchup?: any;
  [k: string]: any;
}
interface RightRailData { [k: string]: any }
interface GameStoryData { [k: string]: any }

interface GameDataShape {
  homeTeam?: TeamSide;
  awayTeam?: TeamSide;
  gameDate?: string;
  venue?: any;
  venueLocation?: any;
  summary?: any;
  matchup?: any;
  game?: GameLanding | null;
  rightRail?: RightRailData | null;
  story?: GameStoryData | null;
}

interface PageError { message: string; error: { status?: number } | any }

interface GameContextValue {
  gameData: GameDataShape | null;
  gameState: string | null;
  pageError: PageError | null;
}

export const GameContext = createContext<GameContextValue | undefined>(undefined);
export const useGameContext = (): GameContextValue => {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGameContext must be used within a GameProvider');
  }

  return ctx;
};

const GAME_REFRESH_TTL = 15 * 1000; // 15 seconds

interface GameProviderProps { gameId: string; children: React.ReactNode }

export const GameProvider: React.FC<GameProviderProps> = ({ gameId, children }) => {
  const [gameData, setGameData] = useState<GameDataShape | null>(null);
  const [gameState, setGameState] = useState<string | null>(null);
  const [gameScheduleState, setGameScheduleState] = useState<string | null>(null);
  const [pageError, setPageError] = useState<PageError | null>(null);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const fetchGameData = async () => {
      let game: GameLanding | undefined; let rightRail: RightRailData | undefined; let story: GameStoryData | undefined;
      try {
        const [ gameResponse, rightRailResponse, storyResponse ] = await Promise.all([
          fetch(`/api/nhl/gamecenter/${gameId}/landing`, { cache: 'no-store' }),
          fetch(`/api/nhl/gamecenter/${gameId}/right-rail`, { cache: 'no-store' }),
          fetch(`/api/nhl/wsc/game-story/${gameId}`, { cache: 'no-store' })
        ]);

        if (!gameResponse.ok || !rightRailResponse.ok || !storyResponse.ok) {
          const notFound = gameResponse.status === 404;
          setPageError({ message: notFound ? 'Game not found.' : 'Failed to load the game data. Please try again later.', error: { status: notFound ? 404 : 500 } });
          throw new Error('Error loading game data.');
        }

        game = await gameResponse.json();
        rightRail = await rightRailResponse.json();
        story = await storyResponse.json();

        // Set page title
        if (game?.homeTeam?.abbrev && game?.awayTeam?.abbrev) {
          formatHeadTitle(`${game.homeTeam.abbrev} vs. ${game.awayTeam.abbrev}`);
          if (game.gameState && !['FUT', 'PRE'].includes(game.gameState)) {
            const readable = GAME_STATES[game.gameState as keyof typeof GAME_STATES] || game.gameState;
            formatHeadTitle(`${game.awayTeam.abbrev} (${game.awayTeam.score}) vs. ${game.homeTeam.abbrev} (${game.homeTeam.score}) - ${readable}`);
          }
        }
      } catch (error) {
        // Already captured high-level error above; just log for diagnostics
        // eslint-disable-next-line no-console
        console.error('Error fetching game data:', error);
      }

      const { homeTeam, awayTeam, gameDate, venue, venueLocation, summary, matchup } = game || {} as GameLanding;
      setGameData({ homeTeam, awayTeam, gameDate, venue, venueLocation, summary, matchup, game: game || null, rightRail: rightRail || null, story: story || null });
      setGameState(game ? game.gameState || null : null);
      setGameScheduleState(game ? game.gameScheduleState || null : null);
    };

    fetchGameData();

    if (!['OFF'].includes(gameState || '') && gameScheduleState === 'OK') {
      intervalId = setInterval(fetchGameData, GAME_REFRESH_TTL);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [gameId, gameState, gameScheduleState]);

  const value: GameContextValue = { gameData, gameState, pageError };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
