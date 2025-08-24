'use client';

import React, { useEffect, useState } from 'react';
import GameBodySkeleton from '@/app/components/GameBodySkeleton';
import StatsTable from '@/app/components/StatsTable';
import TeamLogo from '@/app/components/TeamLogo';
import { getTeamDataByAbbreviation } from '@/app/utils/teamData';
import { notFound, useParams } from 'next/navigation';
import TeamToggle from '@/app/components/TeamToggle';

interface BoxScoreData { [k: string]: any }

const BoxScore: React.FC = () => {
  const { id } = useParams() as { id: string };
  const logos: Record<string, string> = {};

  const [gameData, setGameData] = useState<any>(null);
  const [gameState, setGameState] = useState<string | null>(null);
  const [activeStatTeam, setActiveStatTeam] = useState<'awayTeam' | 'homeTeam'>('awayTeam');

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const [gameResponse, boxScoreResponse] = await Promise.all([
          fetch(`/api/nhl/gamecenter/${id}/landing`, { cache: 'no-store' }),
          fetch(`/api/nhl/gamecenter/${id}/boxscore`, { cache: 'no-store' })
        ]);
        const game = await gameResponse.json();
        const boxScore = await boxScoreResponse.json();
        const { homeTeam, awayTeam, gameDate, venue, venueLocation, summary, matchup } = game;
        setGameData({ homeTeam, awayTeam, gameDate, venue, venueLocation, summary, matchup, game, boxScore } as BoxScoreData);
        setGameState(game.gameState);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching game data:', error);
      }
    };
    fetchGameData();
    if (['PRE', 'LIVE', 'CRIT'].includes(gameState || '')) {
      const intervalId = setInterval(fetchGameData, 20000);
      
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [id, gameState]);

  if (!gameData || !gameState) {
    return <GameBodySkeleton />;
  }
  if (['PRE', 'FUT'].includes(gameState)) {
    return notFound();
  }

  const { homeTeam, awayTeam, boxScore } = gameData as any;
  homeTeam.data = getTeamDataByAbbreviation(homeTeam.abbrev, true) || {};
  awayTeam.data = getTeamDataByAbbreviation(awayTeam.abbrev, false) || {};
  logos[homeTeam.abbrev] = homeTeam.logo;
  logos[awayTeam.abbrev] = awayTeam.logo;

  return (
    <div>
      <div className="flex justify-end">
        <TeamToggle awayTeam={awayTeam} homeTeam={homeTeam} handleStatTeamClick={setActiveStatTeam} activeStatTeam={activeStatTeam} />
      </div>
      <div id="awayTeamStats" className={activeStatTeam === 'awayTeam' ? 'block' : 'hidden'}>
        <div className="my-3">
          <div className="flex">
            <TeamLogo src={logos[awayTeam.abbrev]} alt={awayTeam.abbrev} className="mr-2 h-8 w-8" />
            <div className="font-bold my-1">Forwards ({boxScore.playerByGameStats?.awayTeam.forwards.length})</div>
          </div>
        </div>
        <StatsTable stats={boxScore.playerByGameStats?.awayTeam.forwards} team={awayTeam.data.abbreviation} />
        <div className="my-3">
          <div className="flex">
            <TeamLogo src={logos[awayTeam.abbrev]} alt={awayTeam.abbrev} className="mr-2 h-8 w-8" />
            <div className="font-bold my-1">Defensemen ({boxScore.playerByGameStats?.awayTeam.defense.length})</div>
          </div>
        </div>
        <StatsTable stats={boxScore.playerByGameStats?.awayTeam.defense} team={awayTeam.data.abbreviation} />
        <div className="my-3">
          <div className="flex">
            <TeamLogo src={logos[awayTeam.abbrev]} alt={awayTeam.abbrev} className="mr-2 h-8 w-8" />
            <div className="font-bold my-1">Goalies ({boxScore.playerByGameStats?.awayTeam.goalies.length})</div>
          </div>
        </div>
        <StatsTable stats={boxScore.playerByGameStats?.awayTeam.goalies} team={awayTeam.data.abbreviation} />
      </div>
      <div id="homeTeamStats" className={activeStatTeam === 'homeTeam' ? 'block' : 'hidden'}>
        <div className="my-3">
          <div className="flex">
            <TeamLogo src={logos[homeTeam.abbrev]} alt={homeTeam.abbrev} className="mr-2 h-8 w-8" />
            <div className="font-bold my-1">Forwards ({boxScore.playerByGameStats?.homeTeam.forwards.length})</div>
          </div>
        </div>
        <StatsTable stats={boxScore.playerByGameStats?.homeTeam.forwards} team={homeTeam.data.abbreviation} />
        <div className="my-3">
          <div className="flex">
            <TeamLogo src={logos[homeTeam.abbrev]} alt={homeTeam.abbrev} className="mr-2 h-8 w-8" />
            <div className="font-bold my-1">Defensemen ({boxScore.playerByGameStats?.homeTeam.defense.length})</div>
          </div>
        </div>
        <StatsTable stats={boxScore.playerByGameStats?.homeTeam.defense} team={homeTeam.data.abbreviation} />
        <div className="my-3">
          <div className="flex">
            <TeamLogo src={logos[homeTeam.abbrev]} alt={homeTeam.abbrev} className="mr-2 h-8 w-8" />
            <div className="font-bold my-1">Goalies ({boxScore.playerByGameStats?.homeTeam.goalies.length})</div>
          </div>
        </div>
        <StatsTable stats={boxScore.playerByGameStats?.homeTeam.goalies} team={homeTeam.data.abbreviation} />
      </div>
    </div>
  );
};

export default BoxScore;
