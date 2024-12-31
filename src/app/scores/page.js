'use client';

import React, { useEffect, useState } from 'react';
import NewsPageSkeleton from '../components/NewsPageSkeleton';
import GameTile from '../components/GameTile';
import { formatLocalizedDate } from '../utils/formatters';

const ScoresPage = () => {
  const [scores, setScores] = useState(null);
  const [today, setToday] = useState(new Date());

  useEffect(() => {
    const formattedDate = today.toISOString().slice(0, 10);
    const getScores = async () => {
      const scoresResponse = await fetch(`/api/nhl/score/${formattedDate}`, { cache: 'no-store' });
      setScores(await scoresResponse.json());
    };

    getScores();

  }, [today]);

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
        <div className="flex justify-between">
          <div><button onClick={() => handleDateChange(scores.prevDate)} className="font-bold underline">&laquo; {formatLocalizedDate(scores.prevDate, 'LL')}</button></div>
          <div>{formatLocalizedDate(scores.currentDate, 'dddd, MMMM D, YYYY')}</div>
          <div><button onClick={() => handleDateChange(scores.nextDate)} href="#" className="font-bold underline">{formatLocalizedDate(scores.nextDate, 'LL')} &raquo;</button></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {scores.games.map((game, i) => {
          return (
            <GameTile key={i} game={game} className="col-span-1" />
          );
        })}
      </div>
    </div>
  );
};

export default ScoresPage;
