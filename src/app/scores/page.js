'use client';

import React, { useEffect, useState } from 'react';
import NewsPageSkeleton from '../components/NewsPageSkeleton';
import GameTile from '../components/GameTile';
import { formatLocalizedDate } from '../utils/formatters';

const ScoresPage = () => {
  const [scores, setScores] = useState(null);
  const [today, setToday] = useState(null);

  useEffect(() => {
    // Function to get the current date at noon Eastern time
    const setTodayNoonET = () => {
      const now = new Date();

      // Adjust current time to Eastern Time, no DST consideration here for simplicity
      const easternTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));

      // Set the time to 12:00 PM today
      easternTime.setHours(12, 0, 0, 0);

      return easternTime.toISOString().split('T')[0]; // returns YYYY-MM-DD format
    };

    if (!today) {
      const todayNoonET = setTodayNoonET();
      setToday(todayNoonET); // Set `today` state
    } else {
      // Now fetch the scores based on `today`
      const getScores = async () => {
        let todayString = today;
        if (typeof today !== 'string') {
          todayString = today.toISOString().slice(0, 10);
        }
        const scoresResponse = await fetch(`/api/nhl/score/${todayString}`, { cache: 'no-store' });
        setScores(await scoresResponse.json());
      };

      getScores();

      const interval = setInterval(getScores, 30000);

      return () => clearInterval(interval);
    }
  }, [today]); // Runs when `today` changes

  const handleDateChange = (date) => {
    setToday(new Date(date));
  };

  if (!scores) {
    return (<NewsPageSkeleton />);
  }

  return (
    <div className="container mx-auto">
      <div className="text-3xl font-bold my-5">Scores</div>
      <div className="my-5">
        <div className="flex justify-between gap-2">
          {scores.gameWeek.map((day, i) => {
            return (
              <button key={i} className={`p-1 border rounded w-full ${day.date === today ? 'bg-slate-200 dark:bg-slate-800' : ''}`} onClick={() => setToday(day.date)}>
                <div className="text-xs my-1">{day.dayAbbrev} {formatLocalizedDate(day.date, 'M/D')}</div>
                <div className="text-xs my-1 font-bold">{day.numberOfGames} game{day.numberOfGames === 1 ? '' : 's'}</div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="my-5">
        <div className="flex justify-between">
          <div><button onClick={() => handleDateChange(scores.prevDate)} className="font-bold underline">&laquo; {formatLocalizedDate(scores.prevDate, 'LL')}</button></div>
          <div>{formatLocalizedDate(scores.currentDate, 'dddd, MMMM D, YYYY')}</div>
          <div><button onClick={() => handleDateChange(scores.nextDate)} href="#" className="font-bold underline">{formatLocalizedDate(scores.nextDate, 'LL')} &raquo;</button></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {scores.games.length === 0 && (
          <div className="my-5 py-5 text-2xl text-center col-span-full h-fit content-center">
            No games scheduled.
          </div>
        )}
        {scores.games.map((game, i) => {
          return (
            <GameTile key={i} game={game} hideDate className="col-span-1" />
          );
        })}
      </div>
    </div>
  );
};

export default ScoresPage;
