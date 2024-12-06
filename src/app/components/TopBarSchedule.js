'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faWarning } from '@fortawesome/free-solid-svg-icons';
import { formatLocalizedTime, formatPeriodLabel } from '../utils/formatters';
import TeamLogo from './TeamLogo';
import { PropTypes } from 'prop-types';

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
              {games.map((game) => {

                game.awayTeam.defeated = game.awayTeam.score < game.homeTeam.score && ['FINAL', 'OFF'].includes(game.gameState);
                game.homeTeam.defeated = game.homeTeam.score < game.awayTeam.score && ['FINAL', 'OFF'].includes(game.gameState);

                let itemClass = 'border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow';
                if (game.gameState === 'CRIT') {
                  itemClass = 'border border-red-500 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow';
                }

                return (
                  <Link key={game.id} href={`/game/${game.id}`} className={itemClass} style={{minWidth: '360px'}}>
                    <div className="space-y-2">
                      {/* Away Team */}
                      <div className={`flex items-center justify-between ${game.awayTeam.defeated ? 'opacity-50' : ''}`}>
                        <div className="flex items-center space-x-3">
                          <TeamLogo 
                            src={game.awayTeam.logo} 
                            alt={`${game.awayTeam.name?.default} logo`}
                            className="w-8 h-8"
                          />
                          <span className="font-light">
                            {game.awayTeam.placeNameWithPreposition?.default} <strong className="font-bold">{game.awayTeam.commonName?.default.replace(game.awayTeam.placeNameWithPreposition?.default, '')}</strong>
                            {game.situation?.awayTeam.situationDescriptions?.map((code) => (
                              <span key={code} className="text-sm font-medium px-2 py-1 bg-red-900 text-white rounded ml-2">{code}</span>
                            ))}
                          </span>
                        </div>
                        {!['FUT', 'PRE'].includes(game.gameState) ? (
                          <span className="text-lg font-semibold">{game.awayTeam.score}</span>
                        ) : (
                          <span className="text-sm font-light">{game.awayTeam.record}</span>
                        )}
                      </div>

                      {/* Home Team */}
                      <div className={`flex items-center justify-between ${game.homeTeam.defeated ? 'opacity-50' : ''}`}>
                        <div className="flex items-center space-x-3">
                          <TeamLogo 
                            src={game.homeTeam.logo} 
                            alt={`${game.homeTeam.name?.default} logo`}
                            className="w-8 h-8"
                          />
                          <span className="font-light">
                            {game.homeTeam.placeNameWithPreposition?.default} <strong className="font-bold">{game.homeTeam.commonName?.default.replace(game.homeTeam.placeNameWithPreposition?.default, '')}</strong>
                            {game.situation?.homeTeam.situationDescriptions?.map((code) => (
                              <span key={code} className="text-sm font-medium px-2 py-1 bg-red-900 text-white rounded ml-2">{code}</span>
                            ))}
                          </span>
                        </div>
                        {!['FUT', 'PRE'].includes(game.gameState) ? (
                          <span className="text-lg font-semibold">{game.homeTeam.score}</span>
                        ) : (
                          <span className="text-sm font-light">{game.homeTeam.record}</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 pt-3 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">{game.venue.default}</span>
                        {game.gameScheduleState === 'CNCL' && (
                          <span className="text-xs font-medium px-2 py-1 bg-slate-900 text-white rounded mr-1 uppercase"><FontAwesomeIcon icon={faBan} fixedWidth /> Cancelled</span>
                        )}
                        {game.gameScheduleState === 'PPD' && (
                          <span className="text-xs font-medium px-2 py-1 bg-yellow-500 text-black rounded mr-1 uppercase"><FontAwesomeIcon icon={faWarning} fixedWidth /> Postponed</span>
                        )}
                        {(game.gameState === 'FINAL' || game.gameState === 'OFF') ? (
                          <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:text-black rounded">
                            FINAL{game.periodDescriptor?.periodType !== 'REG' ? `/${game.periodDescriptor?.periodType}` : ''}
                          </span>
                        ) : (
                          <>
                            {(game.gameState === 'LIVE' || game.gameState === 'CRIT') ? (
                              <span className="text-sm">
                                <span className="text-xs font-medium px-2 py-1 bg-red-900 text-white rounded mr-2 uppercase">
                                  {formatPeriodLabel(game.periodDescriptor)}
                                  {game.clock.inIntermission ? ' INT' : ''}
                                </span>
                                <span className="font-bold">{game.clock?.timeRemaining}</span>
                              </span>
                            ) : (
                              <>
                                <span className="text-sm">
                                  {formatLocalizedTime(game.startTimeUTC)}
                                </span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
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
