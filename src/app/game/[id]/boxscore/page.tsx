'use client';

import React, { useEffect, useState } from 'react';
import GameBodySkeleton from '@/app/components/GameBodySkeleton';
import StatsTable from '@/app/components/StatsTable';
import TeamLogo from '@/app/components/TeamLogo';
import { getTeamDataByAbbreviation } from '@/app/utils/teamData';
import { notFound, useParams } from 'next/navigation';
import TeamToggle from '@/app/components/TeamToggle';

interface TeamWithData {
  id?: number | string;
  abbrev: string;
  logo?: string;
  commonName?: { default: string };
  placeName?: { default: string };
  data?: { abbreviation?: string; [key: string]: unknown };
  [key: string]: unknown;
}

type StatsRows = React.ComponentProps<typeof StatsTable>['stats'];

interface BoxScoreTeamsStats {
  forwards: StatsRows;
  defense: StatsRows;
  goalies: StatsRows;
}

interface BoxScorePlayerByGameStats {
  awayTeam: BoxScoreTeamsStats;
  homeTeam: BoxScoreTeamsStats;
}

// Minimal shape we actually access; retain unknown catch-all for unused data
interface BoxScoreData {
  homeTeam: TeamWithData;
  awayTeam: TeamWithData;
  gameDate?: string;
  venue?: unknown;
  venueLocation?: unknown;
  summary?: unknown;
  matchup?: unknown;
  game: { gameState: string; [k: string]: unknown };
  boxScore: { playerByGameStats?: BoxScorePlayerByGameStats; [k: string]: unknown };
  [k: string]: unknown;
}

const BoxScore: React.FC = () => {
  const { id } = useParams() as { id: string };
  const logos: Record<string, string> = {};

  const [gameData, setGameData] = useState<BoxScoreData | null>(null);
  const [gameState, setGameState] = useState<string | null>(null);
  const [activeStatTeam, setActiveStatTeam] = useState<'awayTeam' | 'homeTeam'>('awayTeam');
  const [errorState, setErrorState] = useState<Error | null>(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const [gameResponse, boxScoreResponse] = await Promise.all([
          fetch(`/api/nhl/gamecenter/${id}/landing`, { cache: 'no-store' }),
          fetch(`/api/nhl/gamecenter/${id}/boxscore`, { cache: 'no-store' }),
        ]);
        const game = await gameResponse.json();
        const boxScore = await boxScoreResponse.json();
        const { homeTeam, awayTeam, gameDate, venue, venueLocation, summary, matchup } = game;
        setGameData({
          homeTeam,
          awayTeam,
          gameDate,
          venue,
          venueLocation,
          summary,
          matchup,
          game,
          boxScore,
        } as BoxScoreData);
        setGameState(game.gameState);
        setErrorState(null);
      } catch (error) {
        console.error('Error fetching game data:', error);
        setErrorState(error instanceof Error ? error : new Error('Unable to load boxscore data.'));
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

  if (errorState) {
    throw errorState;
  }

  if (!gameData || !gameState) {
    return <GameBodySkeleton />;
  }
  if (['PRE', 'FUT'].includes(gameState)) {
    return notFound();
  }

  const { homeTeam, awayTeam, boxScore } = gameData;
  homeTeam.data = getTeamDataByAbbreviation(homeTeam.abbrev, true) || {};
  awayTeam.data = getTeamDataByAbbreviation(awayTeam.abbrev, false) || {};
  logos[homeTeam.abbrev] = homeTeam.logo || '';
  logos[awayTeam.abbrev] = awayTeam.logo || '';

  const playerByGameStats = boxScore.playerByGameStats;
  if (!playerByGameStats) {
    return <GameBodySkeleton />;
  }

  return (
    <div>
      <div className="flex justify-end">
        <TeamToggle
          awayTeam={awayTeam as React.ComponentProps<typeof TeamToggle>['awayTeam']}
          homeTeam={homeTeam as React.ComponentProps<typeof TeamToggle>['homeTeam']}
          handleStatTeamClick={setActiveStatTeam}
          activeStatTeam={activeStatTeam}
        />
      </div>
      <div id="awayTeamStats" className={activeStatTeam === 'awayTeam' ? 'block' : 'hidden'}>
        <div className="my-3">
          <div className="flex">
            <TeamLogo src={logos[awayTeam.abbrev]} alt={awayTeam.abbrev} className="mr-2 h-8 w-8" />
            <div className="font-bold my-1">
              Forwards ({playerByGameStats.awayTeam.forwards.length})
            </div>
          </div>
        </div>
        <StatsTable stats={playerByGameStats.awayTeam.forwards} team={awayTeam.data.abbreviation} />
        <div className="my-3">
          <div className="flex">
            <TeamLogo src={logos[awayTeam.abbrev]} alt={awayTeam.abbrev} className="mr-2 h-8 w-8" />
            <div className="font-bold my-1">
              Defensemen ({playerByGameStats.awayTeam.defense.length})
            </div>
          </div>
        </div>
        <StatsTable stats={playerByGameStats.awayTeam.defense} team={awayTeam.data.abbreviation} />
        <div className="my-3">
          <div className="flex">
            <TeamLogo src={logos[awayTeam.abbrev]} alt={awayTeam.abbrev} className="mr-2 h-8 w-8" />
            <div className="font-bold my-1">
              Goalies ({playerByGameStats.awayTeam.goalies.length})
            </div>
          </div>
        </div>
        <StatsTable stats={playerByGameStats.awayTeam.goalies} team={awayTeam.data.abbreviation} />
      </div>
      <div id="homeTeamStats" className={activeStatTeam === 'homeTeam' ? 'block' : 'hidden'}>
        <div className="my-3">
          <div className="flex">
            <TeamLogo src={logos[homeTeam.abbrev]} alt={homeTeam.abbrev} className="mr-2 h-8 w-8" />
            <div className="font-bold my-1">
              Forwards ({playerByGameStats.homeTeam.forwards.length})
            </div>
          </div>
        </div>
        <StatsTable stats={playerByGameStats.homeTeam.forwards} team={homeTeam.data.abbreviation} />
        <div className="my-3">
          <div className="flex">
            <TeamLogo src={logos[homeTeam.abbrev]} alt={homeTeam.abbrev} className="mr-2 h-8 w-8" />
            <div className="font-bold my-1">
              Defensemen ({playerByGameStats.homeTeam.defense.length})
            </div>
          </div>
        </div>
        <StatsTable stats={playerByGameStats.homeTeam.defense} team={homeTeam.data.abbreviation} />
        <div className="my-3">
          <div className="flex">
            <TeamLogo src={logos[homeTeam.abbrev]} alt={homeTeam.abbrev} className="mr-2 h-8 w-8" />
            <div className="font-bold my-1">
              Goalies ({playerByGameStats.homeTeam.goalies.length})
            </div>
          </div>
        </div>
        <StatsTable stats={playerByGameStats.homeTeam.goalies} team={homeTeam.data.abbreviation} />
      </div>
    </div>
  );
};

export default BoxScore;
