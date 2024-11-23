'use client';

import React, { use, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Link from 'next/link.js';
import utc from 'dayjs/plugin/utc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle} from '@fortawesome/free-solid-svg-icons';
import GameSkeleton from '@/app/components/GameSkeleton.js';
import GameHeader from '@/app/components/GameHeader.js';
import TeamLogo from '@/app/components/TeamLogo';
import { getTeamDataByAbbreviation } from '@/app/utils/teamData';
import { GAME_EVENTS, PENALTY_DESCRIPTIONS, PENALTY_TYPES, PERIOD_DESCRIPTORS } from '@/app/utils/constants';
import SirenOnSVG from '@/app/assets/siren-on-solid.svg';
import PeriodSelector from '@/app/components/PeriodSelector';
import Image from 'next/image';
import Headshot from '@/app/components/Headshot';
import { PropTypes } from 'prop-types';
import GameSubPageNavigation from '@/app/components/GameSubPageNavigation';

dayjs.extend(utc);

const PlayByPlay = ({ params }) => {
  const { id } = use(params);
  const logos = {};

  // Initial state for the game data
  const [gameData, setGameData] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [activePeriod, setActivePeriod] = useState(null);

  // Use `useEffect` to run once on initial render and set up polling
  useEffect(() => {
    // Function to fetch the live game data
    const fetchGameData = async () => {
      let game, playByPlay;

      try {
        const gameResponse = await fetch(`/api/nhl/gamecenter/${id}/landing`, { cache: 'no-store' });
        const playByPlayResponse = await fetch(`/api/nhl/gamecenter/${id}/play-by-play`, { cache: 'no-store' });

        game = await gameResponse.json();
        playByPlay = await playByPlayResponse.json();
      } catch (error) {
        console.error('Error fetching game data:', error);

        return;
      }

      // Extract relevant parts of the game data
      const { homeTeam, awayTeam, gameDate, venue, venueLocation, summary, matchup } = game;
      setGameData({ homeTeam, awayTeam, gameDate, venue, venueLocation, summary, matchup, game, playByPlay });
      setActivePeriod(game.periodDescriptor?.number);
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
  }, [ gameState, id ]);

  // If game data is loading, show loading indicator
  if (!gameData) {
    return <GameSkeleton />;
  }

  // Destructure data for rendering
  const { homeTeam, awayTeam, game, playByPlay } = gameData;

  homeTeam.data = getTeamDataByAbbreviation(homeTeam.abbrev) || {};
  awayTeam.data = getTeamDataByAbbreviation(awayTeam.abbrev) || {};

  // If no boxscore available, redirect back up
  if (!playByPlay.plays) {
    return window.location.href = `/game/${id}`;
  }

  // Update logo map
  logos[homeTeam.abbrev] = homeTeam.logo;
  logos[awayTeam.abbrev] = awayTeam.logo;

  let sortedPlays = playByPlay.plays?.filter((p) => p.periodDescriptor.number === activePeriod) || [];
  if (['LIVE', 'CRIT'].includes(playByPlay.gameState)) {
    sortedPlays = sortedPlays.sort((a, b) => b.sortOrder - a.sortOrder);
  }

  const lookupPlayerData = (playerId) => {
    const defaultPlayer = { firstName: { default: 'Unnamed' }, lastName: { default: 'Player' }};

    return playByPlay.rosterSpots.find((player) => player.playerId === playerId) || defaultPlayer;
  };

  const renderTeamLogo = (teamId) => {
    if (teamId === awayTeam.id) {
      return (
        <TeamLogo
          src={logos[awayTeam.abbrev]}
          alt={awayTeam.abbrev}
          className="h-10 w-10"
        />
      );
    }
    if (teamId === homeTeam.id) {
      return (
        <TeamLogo
          src={logos[homeTeam.abbrev]}
          alt={homeTeam.abbrev}
          className="h-10 w-10"
        />
      );
    }
  };

  const renderPlayer = (playerId) => {
    const player = lookupPlayerData(playerId);
    
    return (
      <>
        {/* <span className="p-1 border rounded text-xs">#{player.sweaterNumber}</span> */}
        <Link href={`/player/${player.playerId}`} className="font-bold">{player.firstName.default} {player.lastName.default}</Link>
      </>
    );
  };

  const renderPlayByPlayEvent = (play) => {
    switch (play.typeDescKey) {
    case 'period-start':
      return (
        <div className="">
          <div className="">
            Start of {PERIOD_DESCRIPTORS[play.periodDescriptor.number]} Period
          </div>
        </div>
      );
    case 'faceoff':
      return (
        <div className="">
          <div className="">
            {renderPlayer(play.details.winningPlayerId)} won faceoff against {renderPlayer(play.details.losingPlayerId)}
          </div>
        </div>
      );
    case 'takeaway':
      return (
        <div className="">
          <div className="">
            {renderPlayer(play.details.playerId)} took the puck away
          </div>
        </div>
      );
    case 'blocked-shot':
      return (
        <div className="">
          <div className="">
            {renderPlayer(play.details.blockingPlayerId)} blocked a shot from {renderPlayer(play.details.shootingPlayerId)}
          </div>
        </div>
      );
    case 'shot-on-goal':
      return (
        <div className="">
          <div className="">
            {renderPlayer(play.details.shootingPlayerId)} took a shot on {renderPlayer(play.details.goalieInNetId)}
          </div>
        </div>
      );
    case 'stoppage':
      return (
        <div className="">
          <div className="">
            {GAME_EVENTS[play.details.reason]}
          </div>
        </div>
      );
    case 'hit':
      return (
        <div className="">
          <div className="">
            {renderPlayer(play.details.hittingPlayerId)} hit {renderPlayer(play.details.hitteePlayerId)}
          </div>
        </div>
      );
    case 'giveaway':
      return (
        <div className="">
          <div className="">
            {renderPlayer(play.details.playerId)} gave the puck away
          </div>
        </div>
      );
    case 'missed-shot':
      return (
        <div className="">
          <div className="">
            {renderPlayer(play.details.shootingPlayerId)} missed a shot
          </div>
        </div>
      );
    case 'goal':
      return (
        <div className="p-1 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src={SirenOnSVG}
              className="h-6 w-6 mr-4 hidden md:block"
              height={250}
              width={250}
              alt="Goal Icon"
            />
            <Headshot
              playerId={play.details.scoringPlayerId}
              src={(lookupPlayerData(play.details.scoringPlayerId)).headshot}
              alt="Player Headshot"
              className="h-16 w-16 mr-4 hidden md:block"
            />
            <div className="leading-5">
              <div className="font-medium text-lg mb-3">{renderPlayer(play.details.scoringPlayerId)} ({play.details.scoringPlayerTotal}) scored a goal on a {play.details.shotType} shot</div>
              {(play.details.assist1PlayerId || play.details.assist2PlayerId) && (
                <span>Assisted By: </span>
              )}
              {play.details.assist1PlayerId && (
                <span>{renderPlayer(play.details.assist1PlayerId)} ({play.details.assist1PlayerTotal})</span>
              )}
              {play.details.assist2PlayerId && (
                <span> and {renderPlayer(play.details.assist2PlayerId)} ({play.details.assist2PlayerTotal})</span>
              )}
              {!play.details.assist1PlayerId && !play.details.assist2PlayerId && (
                <span>Unassisted</span>
              )}
            </div>
          </div>
          {play.details?.highlightClipSharingUrl && (
            <div className="text-center text-white">
              <Link href={play.details?.highlightClipSharingUrl} rel="noopener noreferrer">
                <div className="my-2">Watch Highlight</div>
                <FontAwesomeIcon icon={faPlayCircle} size="2x" className="align-middle mr-2 md:mr-0" />
              </Link>
            </div>
          )}
        </div>
      );
    case 'penalty':
      return (
        <div className="">
          <div className="flex gap-4 items-center">
            <Headshot
              playerId={play.details.committedByPlayerId}
              src={(lookupPlayerData(play.details.committedByPlayerId)).headshot}
              alt="Player Headshot"
              className="h-16 w-16 hidden md:block"
            />
            <div className="w-1/3">
              {play.details.committedByPlayerId ? (
                <div className="font-medium text-lg mb-3">{renderPlayer(play.details.committedByPlayerId)}</div>
              ) : (
                <div className="font-medium text-lg mb-3">Team Penalty</div>
              )}
              {play.details.servedByPlayerId && (
                <div className="text-xs">Served by: {renderPlayer(play.details.servedByPlayerId)}</div>
              )}
              {play.details.drawnByPlayerId && (
                <div className="text-xs">Drawn By: {renderPlayer(play.details.drawnByPlayerId)}</div>
              )}
            </div>
            <div className="w-1/3">
              <div className="text-xs font-light text-slate-600">Duration</div>
              <div>{play.details.duration} minutes</div>
            </div>
            <div className="w-1/3">
              <div className="text-xs font-light text-slate-600">{PENALTY_TYPES[play.details.typeCode]}</div>
              <div>{PENALTY_DESCRIPTIONS[play.details.descKey]}</div>
            </div>
          </div>
        </div>
      );
    case 'period-end':
      return (
        <div className="">
          <div className="">
            End of {PERIOD_DESCRIPTORS[play.periodDescriptor.number]} period
          </div>
        </div>
      );
    case 'delayed-penalty':
      return (
        <div className="">
          <div className="">
            Delayed penalty
          </div>
        </div>
      );
    case 'game-end':
      return (
        <div className="">
          <div className="">
            End of game
          </div>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto">
      <GameHeader game={game} />

      <GameSubPageNavigation game={game} />

      <div className="flex justify-center my-5">
        <PeriodSelector periodsPlayed={game.periodDescriptor?.number} activePeriod={activePeriod} handlePeriodChange={setActivePeriod} />
      </div>

      <div className="overflow-x-auto">
        <table className="text-xs min-w-full table-auto">
          <thead>
            <tr className="hidden">
              <th className="p-2 border text-center">Time</th>
              <th className="p-2 border text-center">Event Type</th>
              <th className="p-2 border text-center">Details</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlays.map((play) => {
              let eventRowStyle = '';
              switch(play.typeDescKey) {
              case 'goal':
                eventRowStyle = 'bg-red-900/80 text-white';
                break;
              case 'penalty':
                eventRowStyle = 'bg-gray-900/80 text-white';
                break;
              }
              
              return(
                <tr key={play.eventId} className={eventRowStyle}>
                  <td className="p-2 text-center">
                    <span className="m-1 border rounded p-1 font-bold text-xs">{play.timeRemaining}</span>
                    <div className="p-2">{PERIOD_DESCRIPTORS[play.periodDescriptor.number]}</div>
                  </td>
                  <td className="p-2 flex flex-wrap gap-2 items-center">
                    <div className="w-10 h-10">
                      {play.details?.eventOwnerTeamId && renderTeamLogo(play.details?.eventOwnerTeamId)}
                    </div>
                    <div>
                      <span className="hidden md:block p-1 border rounded font-bold text-xs uppercase">
                        {GAME_EVENTS[play.typeDescKey]}
                      </span>
                    </div>
                  </td>
                  <td className="p-2 text-sm">
                    {renderPlayByPlayEvent(play, game)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

PlayByPlay.propTypes = {
  id: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired,
};

export default PlayByPlay;
