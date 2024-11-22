'use client';

import React, { use, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Link from 'next/link.js';
import utc from 'dayjs/plugin/utc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHockeyPuck} from '@fortawesome/free-solid-svg-icons';
import GameSkeleton from '@/app/components/GameSkeleton.js';
import GameHeader from '@/app/components/GameHeader.js';
import StatsTable from '@/app/components/StatsTable';
import TeamLogo from '@/app/components/TeamLogo';
import { getTeamDataByAbbreviation } from '@/app/utils/teamData';

dayjs.extend(utc);

const BoxScore = ({ params }) => {
  const { id } = use(params);
  const logos = {};

  // Initial state for the game data
  const [gameData, setGameData] = useState(null);
  const [gameState, setGameState] = useState(null);

  // Function to fetch the live game data
  const fetchGameData = async () => {
    let game, boxScore;

    try {
      const gameResponse = await fetch(`/api/nhl/gamecenter/${id}/landing`, { cache: 'no-store' });
      const boxScoreResponse = await fetch(`/api/nhl/gamecenter/${id}/boxscore`, { cache: 'no-store' });

      game = await gameResponse.json();
      boxScore = await boxScoreResponse.json();
    } catch (error) {
      console.error('Error fetching game data:', error);
      
      return;
    }

    // Extract relevant parts of the game data
    const { homeTeam, awayTeam, gameDate, venue, venueLocation, summary, matchup } = game;
    setGameData({ homeTeam, awayTeam, gameDate, venue, venueLocation, summary, matchup, game, boxScore });
    setGameState(game.gameState);
  };

  // Use `useEffect` to run once on initial render and set up polling
  useEffect(() => {
    // Initial fetch on page load
    fetchGameData();

    if (!['PRE', 'LIVE', 'CRIT'].includes(gameState)) {
      return;
    }

    // Set up polling every 30 seconds to update game data
    const intervalId = setInterval(() => {
      fetchGameData();
    }, 20000); // 20 seconds polling interval

    // Cleanup the interval when component unmounts
    return () => clearInterval(intervalId);
  }, [ id, gameState ]); // Only re-run the effect if the `id` changes

  // If game data is loading, show loading indicator
  if (!gameData) {
    return <GameSkeleton />;
  }

  // Destructure data for rendering
  const { homeTeam, awayTeam, game, boxScore } = gameData;

  homeTeam.data = getTeamDataByAbbreviation(homeTeam.abbrev) || {};
  awayTeam.data = getTeamDataByAbbreviation(awayTeam.abbrev) || {};

  // If no boxscore available, redirect back up
  if (!boxScore.playerByGameStats) {
    return window.location.href = `/game/${id}`;
  }

  // Update logo map
  logos[homeTeam.abbrev] = homeTeam.logo;
  logos[awayTeam.abbrev] = awayTeam.logo;

  return (
    <div className="container mx-auto">
      <GameHeader game={game} />

      <div className="text-center my-3 text-xs font-bold">
        <Link
          href={`/game/${id}`}
          className="text-sm underline"
        >
          <FontAwesomeIcon icon={faHockeyPuck} fixedWidth className="mr-1" />
          Back to Gamecenter
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-6">
          <div className="my-3">
            <div className="flex">
              <TeamLogo
                src={logos[awayTeam.abbrev]}
                alt={awayTeam.abbrev}
                className="mr-2 h-8 w-8"
              />
              <div className="font-bold my-1">Forwards</div>
            </div>
          </div>
          <StatsTable stats={boxScore.playerByGameStats.awayTeam.forwards} teamColor={awayTeam.data.teamColor} />
          <div className="my-3">
            <div className="flex">
              <TeamLogo
                src={logos[awayTeam.abbrev]}
                alt={awayTeam.abbrev}
                className="mr-2 h-8 w-8"
              />
              <div className="font-bold my-1">Defensemen</div>
            </div>
          </div>
          <StatsTable stats={boxScore.playerByGameStats.awayTeam.defense} teamColor={awayTeam.data.teamColor} />
          <div className="my-3">
            <div className="flex">
              <TeamLogo
                src={logos[awayTeam.abbrev]}
                alt={awayTeam.abbrev}
                className="mr-2 h-8 w-8"
              />
              <div className="font-bold my-1">Goalies</div>
            </div>
          </div>
          <StatsTable stats={boxScore.playerByGameStats.awayTeam.goalies} teamColor={awayTeam.data.teamColor} />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <div className="my-3">
            <div className="flex">
              <TeamLogo
                src={logos[homeTeam.abbrev]}
                alt={homeTeam.abbrev}
                className="mr-2 h-8 w-8"
              />
              <div className="font-bold my-1">Forwards</div>
            </div>
          </div>
          <StatsTable stats={boxScore.playerByGameStats.homeTeam.forwards} teamColor={homeTeam.data.teamColor} />
          <div className="my-3">
            <div className="flex">
              <TeamLogo
                src={logos[homeTeam.abbrev]}
                alt={homeTeam.abbrev}
                className="mr-2 h-8 w-8"
              />
              <div className="font-bold my-1">Defensemen</div>
            </div>
          </div>
          <StatsTable stats={boxScore.playerByGameStats.homeTeam.defense} teamColor={homeTeam.data.teamColor} />
          <div className="my-3">
            <div className="flex">
              <TeamLogo
                src={logos[homeTeam.abbrev]}
                alt={homeTeam.abbrev}
                className="mr-2 h-8 w-8"
              />
              <div className="font-bold my-1">Goalies</div>
            </div>
          </div>
          <StatsTable stats={boxScore.playerByGameStats.homeTeam.goalies} teamColor={homeTeam.data.teamColor} />
        </div>
      </div>

    </div>   
  );
};

export default BoxScore;
