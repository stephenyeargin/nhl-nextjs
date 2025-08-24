'use client';

import React, { useEffect, useState } from 'react';
import NewsPageSkeleton from '@/app/components/NewsPageSkeleton';
import GameTile from '@/app/components/GameTile';
import { formatLocalizedDate } from '@/app/utils/formatters';

interface GameWeekDay { date: string; dayAbbrev: string; numberOfGames: number }
interface ScoreGame { id: string | number; [k:string]: any }
interface ScoresResponse {
  gameWeek: GameWeekDay[];
  games: ScoreGame[];
  prevDate: string; currentDate: string; nextDate?: string;
  [k:string]: any;
}

const ScoresPage: React.FC = () => {
  const [scores, setScores] = useState<ScoresResponse | null>(null);
  const [today, setToday] = useState<string | Date | null>(null);

  useEffect(() => {
    const setTodayNoonET = () => {
      const now = new Date();
      const easternTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      easternTime.setHours(12, 0, 0, 0);
      
  return easternTime.toISOString().split('T')[0];
    };

    if (!today) {
      const todayNoonET = setTodayNoonET();
      setToday(todayNoonET);
    } else {
      const getScores = async () => {
        const todayString = typeof today === 'string' ? today : today.toISOString().slice(0, 10);
        const scoresResponse = await fetch(`/api/nhl/score/${todayString}`, { cache: 'no-store' });
        setScores(await scoresResponse.json());
      };

      getScores();
      const interval = setInterval(getScores, 30000);
      
  return () => clearInterval(interval);
    }
  }, [today]);

  const handleDateChange = (date: string) => {
    setToday(new Date(date));
  };

  if (!scores) {
    return (<NewsPageSkeleton />);
  }

  return (
    <div className="container px-4 mx-auto pb-10">
      <div className="text-3xl font-bold my-5">Scores</div>
      <div className="my-5">
        <div className="flex justify-between gap-2">
          {scores.gameWeek.map((day, i) => (
            <button key={i} className={`p-1 border rounded w-full ${day.date === today ? 'bg-slate-200 dark:bg-slate-800' : ''}`} onClick={() => setToday(day.date)}>
              <div className="text-xs my-1">{day.dayAbbrev} {formatLocalizedDate(day.date, 'M/D')}</div>
              <div className="text-xs my-1 font-bold">{day.numberOfGames} game{day.numberOfGames === 1 ? '' : 's'}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="my-5">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1 text-start"><button onClick={() => handleDateChange(scores.prevDate)} className="font-bold underline">&laquo; {formatLocalizedDate(scores.prevDate, 'LL')}</button></div>
          <div className="col-span-1 text-center">{formatLocalizedDate(scores.currentDate, 'dddd, MMMM D, YYYY')}</div>
          {scores.nextDate ? (
            <div className="col-span-1 text-end"><button onClick={() => handleDateChange(scores.nextDate!)} className="font-bold underline">{formatLocalizedDate(scores.nextDate, 'LL')} &raquo;</button></div>
          ) : (
            <div className="col-span-1 text-end" />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {scores.games.length === 0 && (
          <div className="my-5 py-5 text-2xl text-center col-span-full h-fit content-center">
            No games scheduled.
          </div>
        )}
        {scores.games.map((game: any, i) => (
          <GameTile key={i} game={game as any} hideDate />
        ))}
      </div>
    </div>
  );
};

export default ScoresPage;
