'use client';

import React, { use, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Link from 'next/link.js';
import utc from 'dayjs/plugin/utc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHockeyPuck} from '@fortawesome/free-solid-svg-icons';
import GameSkeleton from '@/app/components/GameSkeleton.js';
import GameHeader from '@/app/components/GameHeader.js';
import TeamLogo from '@/app/components/TeamLogo';
import { getTeamDataByAbbreviation } from '@/app/utils/teamData';
import { PENALTY_DESCRIPTIONS, PENALTY_TYPES, PERIOD_DESCRIPTORS } from '@/app/utils/constants';
import { render } from 'react-dom';

dayjs.extend(utc);

const PlayByPlay = ({ params }) => {
  const { id } = use(params);
  const logos = {};

  // Initial state for the game data
  const [gameData, setGameData] = useState(null);
  const [gameState, setGameState] = useState(null);

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
        <span className="p-1 border rounded text-xs">#{player.sweaterNumber}</span> <Link href={`/player/${player.playerId}`} className="font-bold">{player.firstName.default} {player.lastName.default}</Link>
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
      switch (play.details.reason) {
      case 'icing':
        return (
          <div className="">
            <div className="">
                Icing
            </div>
          </div>
        );
      case 'goalie-stopped-after-sog':
        return (
          <div className="">
            <div className="">
                Goalie freezes puck after a shot on goal
            </div>
          </div>
        );
      }
      case 'puck-in-crowd':
        return (
          <div className="">
            <div className="">
                Puck in crowd
            </div>
          </div>
        );
      default:
        return (
          <div className="">
            <div className="">
                Stoppage
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
        <div className="p-1">
          <div className="leading-5">
            <div className="py-1 font-medium text-lg">{renderPlayer(play.details.scoringPlayerId)} ({play.details.scoringPlayerTotal}) scored a goal on a {play.details.shotType} shot</div>
            {play.details.assist1PlayerId && (
              <div className="py-1">Primary assist: {renderPlayer(play.details.assist1PlayerId)} ({play.details.assist1PlayerTotal})</div>
            )}
            {play.details.assist2PlayerId && (
              <div className="py-1">Secondary assist: {renderPlayer(play.details.assist2PlayerId)} ({play.details.assist2PlayerTotal})</div>
            )}
            {!play.details.assist1PlayerId && !play.details.assist2PlayerId && (
              <div className="py-1">Unassisted</div>
            )}
          </div>
        </div>
      );
    case 'penalty':
      return (
        <div className="p-1">
          <div className="leading-5">
            {play.details.committedByPlayerId ? (
              <div className="py-1 font-bold text-lg">{renderPlayer(play.details.committedByPlayerId)}</div>
            ) : (
              <div className="py-1 font-bold text-lg">Team Penalty</div>
            )}
            <div>{play.details.duration} minute {PENALTY_TYPES[play.details.typeCode]} penalty for {PENALTY_DESCRIPTIONS[play.details.descKey]}</div>
            {play.details.servedByPlayerId && (
              <div className="py-1">Served by: {renderPlayer(play.details.servedByPlayerId)}</div>
            )}
            {play.details.drawnByPlayerId && (
              <div className="py-1">Drawn By: {renderPlayer(play.details.drawnByPlayerId)}</div>
            )}
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

      <div className="text-center my-3 text-xs font-bold">
        <Link
          href={`/game/${id}`}
          className="text-sm underline"
        >
          <FontAwesomeIcon icon={faHockeyPuck} fixedWidth className="mr-1" />
          Back to Gamecenter
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="text-xs min-w-full table-auto">
          <thead>
            <tr className="bg-slate-200 dark:bg-slate-800 text-black dark:text-white">
              <th className="p-2 border text-center">Time</th>
              <th className="p-2 border text-center">Event Type</th>
              <th className="p-2 border text-center">Details</th>
              <th className="p-2 border text-center">Highlight</th>
            </tr>
          </thead>
          <tbody>
            {playByPlay.plays?.map((play) => (
              <tr key={play.eventId} className="border-b">
                <td className="p-2 text-center">
                  <span className="m-1 border rounded p-1 text-xs">{play.timeRemaining}</span>
                  <div className="p-2">{PERIOD_DESCRIPTORS[play.periodDescriptor.number]}</div>
                </td>
                <td className="p-2 text-sm flex flex-wrap gap-2 items-center">
                  <div className="w-10">
                    {play.details?.eventOwnerTeamId && renderTeamLogo(play.details?.eventOwnerTeamId)}
                  </div>
                  <div>
                    <span className="p-1 border rounded bg-gray-300 text-black text-xs uppercase">{play.typeDescKey}</span>
                  </div>
                </td>
                <td className="p-2text-sm">
                  {renderPlayByPlayEvent(play)}
                </td>
                <td className="p-2 text-sm">
                  {play.details?.highlightClipSharingUrl ? (
                    <a
                      href={play.details.highlightClipSharingUrl}
                      className="text-blue-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                Watch Highlight
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayByPlay;
