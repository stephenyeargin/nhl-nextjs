'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { PropTypes } from 'prop-types';
import GameTile from './GameTile';

dayjs.extend(timezone);
dayjs.extend(utc);

const sortGamesByState = (games) => {
  const sortedGames = [...games].sort((a, b) => {
    if (a.gameState === 'LIVE' || a.gameState === 'CRIT') {return -1;}
    if (b.gameState === 'LIVE' || b.gameState === 'CRIT') {return 1;}
    
    return 0;
  });
  
  return sortedGames;
};

const TopBarSchedule = ({ gameDate }) => {
  const [games, setGames] = useState([]);
  const [focusedDate, setFocusedDate] = useState(gameDate || null);
  const [dates, setDates] = useState([]);

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
        setDates(data.gamesByDate.map((d) => d.date));

        // Find the games for the focused date
        const gamesForFocusedDate = data.gamesByDate.find((g) => focusedDate === g.date)?.games || [];
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
          const gamesForFocusedDate = data.gamesByDate.find((g) => focusedDate === g.date)?.games || [];
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
  const handleDateClick = (date) => {
    setFocusedDate(date);
  };

  return (
    <div className="px-2">
      {games?.length > 0 ? (
        <>
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
                <Link key={date} href={`?date=${date}`} className={dateClass} onClick={() => handleDateClick(date)}>
                  <div className="px-4 text-center">{dayjs(date).utc().format('MMM D')}</div>
                </Link>
              );
            })}
          </div>
          <div className="overflow-x-auto scrollbar-hidden my-3">
            <div className="flex flex-nowrap gap-4">
              {games.map((game) => (<GameTile key={game.id} game={game} hideDate={true} style={{minWidth: '360px'}} /> ))}
            </div>
          </div>
        </>
      ) : (
        <div className="overflow-x-auto scrollbar-hidden animate-pulse">
          <div className="flex text-sm py-4">
            {[0,1,2,3,4,5,6].map((i) => (
              <div key={i} className={i !== 3 ? 'active rounded-xl bg-slate-300 dark:bg-slate-700 mx-3' : 'active rounded-xl bg-slate-700 dark:bg-slate-300 mx-3'}>
                <div className="px-4">&nbsp;</div>
              </div>
            ))}
          </div>
          <div className="flex flex-nowrap gap-4 p-4">
            {[0,1,3,4,5,6].map((placeholder) => (
              <div key={placeholder} className="border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow" style={{minWidth: '380px'}}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="mx-3 text-sm bg-slate-300 dark:bg-slate-700 w-10">&nbsp;</div>
                    <div className="mx-3 text-sm bg-slate-300 dark:bg-slate-700 w-80">&nbsp;</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="mx-3 text-sm bg-slate-300 dark:bg-slate-700 w-10">&nbsp;</div>
                    <div className="mx-3 text-sm bg-slate-300 dark:bg-slate-700 w-80">&nbsp;</div>
                  </div>
                </div>
                <div className="mt-2 pt-3">
                  <div className="flex justify-between items-center">
                    <div className="mx-3 text-sm bg-slate-300 dark:bg-slate-700 w-80">&nbsp;</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

TopBarSchedule.propTypes = {
  gameDate: PropTypes.string,
};

export default TopBarSchedule;
