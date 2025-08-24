'use client';

import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import GameTile from './GameTile';
import TopBarScheduleSkeleton from './TopBarScheduleSkeleton';
import { formatLocalizedDate } from '../utils/formatters';

dayjs.extend(timezone);
dayjs.extend(utc);

interface ScheduleGameTeam { abbrev: string; score: number; record?: string; logo?: string; placeName?: { default: string }; commonName?: { default: string }; id?: string | number }
interface ScheduleGame {
  id: string | number;
  gameState: string;
  gameScheduleState?: string;
  gameType: number;
  awayTeam: ScheduleGameTeam;
  homeTeam: ScheduleGameTeam;
  startTimeUTC: string;
  seriesStatus?: any;
  gameOutcome?: { lastPeriodType?: string };
  periodDescriptor?: any;
  clock?: { timeRemaining?: string; inIntermission?: boolean };
  ifNecessary?: boolean;
  venue?: { default: string };
}

const sortGamesByState = (games: ScheduleGame[]): ScheduleGame[] => {
  const sortedGames = [...games].sort((a, b) => {
    if (a.gameState === 'LIVE' || a.gameState === 'CRIT') {return -1;}
    if (b.gameState === 'LIVE' || b.gameState === 'CRIT') {return 1;}

    return 0;
  });

  return sortedGames;
};

interface TopBarScheduleProps { gameDate?: string }
const TopBarSchedule: React.FC<TopBarScheduleProps> = ({ gameDate }) => {
  const [games, setGames] = useState<ScheduleGame[] | null>(null);
  const [focusedDate, setFocusedDate] = useState<string | null>(gameDate || null);
  const [dates, setDates] = useState<string[]>([]);

  // Fetch the game data on initial load and when focusedDate changes
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/nhl/scoreboard/now', { cache: 'reload' });
        const data = await response.json();

        // If focusedDate is not set initially, set it from the API response
        if (!focusedDate) {
          setFocusedDate(gameDate || data.focusedDate || data.gamesByDate[0]?.date);
        }

        // Set the available dates from the API response
  setDates(data.gamesByDate.map((d: any) => d.date));

        // Find the games for the focused date
  const gamesForFocusedDate = data.gamesByDate.find((g: any) => focusedDate === g.date)?.games || [];
        setGames(sortGamesByState(gamesForFocusedDate));
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, [focusedDate, gameDate]); // Re-run when focusedDate or gameDate changes

  // Set up the interval to fetch games every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const fetchGames = async () => {
        try {
          const response = await fetch('/api/nhl/scoreboard/now', { cache: 'reload' });
          const data = await response.json();
          const gamesForFocusedDate = data.gamesByDate.find((g: any) => focusedDate === g.date)?.games || [];
          setGames(sortGamesByState(gamesForFocusedDate));
        } catch (error) {
          console.error('Error fetching games on interval:', error);
        }
      };

      fetchGames();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [focusedDate]); // Only re-run interval if focusedDate changes

  // Handle date click to update focusedDate
  const handleDateClick = (date: string) => {
    setFocusedDate(date);
  };

  if (!games) {
    return (<TopBarScheduleSkeleton />);
  }

  return (
    <div className="px-2 my-3">
      <div className="flex text-xs gap-2 overflow-x-auto scrollbar-hidden">
        {dates.map((date) => {
          let dateClass = 'border rounded-xl';
          if (dayjs(date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')) {
            dateClass = 'border border-blue-400 rounded-xl';
          }
          if (date === focusedDate) {
            dateClass = 'active rounded-xl bg-slate-500 text-white';
          }

          return (
            <button key={date} className={dateClass} onClick={() => handleDateClick(date)} title={formatLocalizedDate(date, 'dddd, MMMM D, YYYY')}>
              <div className="px-4 text-center">{dayjs(date).utc().format('MMM D')}</div>
            </button>
          );
        })}
      </div>
      <div className="overflow-x-auto scrollbar-hidden my-3">
        <div className="flex flex-nowrap gap-4">
          {games.length === 0 && (
            <div className="flex items-center border rounded" style={{ minHeight: '9.25rem', minWidth: '360px' }}>
              <div className="p-4 text-gray-500">No games scheduled for today.</div>
            </div>
          )}
          {games.map((game) => (<GameTile key={game.id} game={game as any} hideDate={true} style={{minWidth: '360px'}} /> ))}
        </div>
      </div>
    </div>
  );
};

export default TopBarSchedule;
