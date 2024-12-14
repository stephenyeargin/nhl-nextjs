'use client';

import React, { use, useEffect, useState } from 'react';
import GameBodySkeleton from '@/app/components/GameBodySkeleton.js';
import StatsTable from '@/app/components/StatsTable';
import TeamLogo from '@/app/components/TeamLogo';
import { getTeamDataByAbbreviation } from '@/app/utils/teamData';
import { PropTypes } from 'prop-types';
import { notFound } from 'next/navigation';
import TeamToggle from '@/app/components/TeamToggle';

const BoxScore = ({ params }) => {
  const { id } = use(params);
  const logos = {};

  // Initial state for the game data
  const [gameData, setGameData] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [activeStatTeam, setActiveStatTeam] = useState('awayTeam');

  // Use `useEffect` to run once on initial render and set up polling
  useEffect(() => {
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

    // Initial fetch on page load
    fetchGameData();

    // Only set up polling if gameState is one of the following values: 'PRE', 'LIVE', 'CRIT'
    if (['PRE', 'LIVE', 'CRIT'].includes(gameState)) {
      const intervalId = setInterval(() => {
        fetchGameData();
      }, 20000); // 20 seconds polling interval

      // Cleanup the interval when component unmounts or gameState changes
      return () => clearInterval(intervalId);
    }
  }, [ id, gameState ]);

  // If game data is loading, show loading indicator
  if (!gameData || !gameState) {
    return <GameBodySkeleton />;
  }

  if (['PRE', 'FUT'].includes(gameState)) {
    return notFound();
  }

  // Destructure data for rendering
  const { homeTeam, awayTeam, boxScore } = gameData;

  homeTeam.data = getTeamDataByAbbreviation(homeTeam.abbrev) || {};
  awayTeam.data = getTeamDataByAbbreviation(awayTeam.abbrev) || {};

  // Update logo map
  logos[homeTeam.abbrev] = homeTeam.logo;
  logos[awayTeam.abbrev] = awayTeam.logo;

  const handleStatTeamClick = (team) => {
    setActiveStatTeam(team);
  };

  return (
    <div>
      <div className="flex justify-end">
        <TeamToggle
          awayTeam={awayTeam}
          homeTeam={homeTeam}
          handleStatTeamClick={handleStatTeamClick}
          activeStatTeam={activeStatTeam}
        />
      </div>

      <div id="awayTeamStats" className={ activeStatTeam === 'awayTeam' ? 'block' : 'hidden'}>
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
        <StatsTable stats={boxScore.playerByGameStats?.awayTeam.forwards} teamColor={awayTeam.data.teamColor} />
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
        <StatsTable stats={boxScore.playerByGameStats?.awayTeam.defense} teamColor={awayTeam.data.teamColor} />
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
        <StatsTable stats={boxScore.playerByGameStats?.awayTeam.goalies} teamColor={awayTeam.data.teamColor} />
      </div>

      <div id="homeTeamStats" className={ activeStatTeam === 'homeTeam' ? 'block' : 'hidden'}>
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
        <StatsTable stats={boxScore.playerByGameStats?.homeTeam.forwards} teamColor={homeTeam.data.teamColor} />
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
        <StatsTable stats={boxScore.playerByGameStats?.homeTeam.defense} teamColor={homeTeam.data.teamColor} />
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
        <StatsTable stats={boxScore.playerByGameStats?.homeTeam.goalies} teamColor={homeTeam.data.teamColor} />
      </div>
    </div>
  );
};

BoxScore.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default BoxScore;
