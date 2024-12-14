'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faPlayCircle} from '@fortawesome/free-solid-svg-icons';
import TeamLogo from '@/app/components/TeamLogo';
import { getTeamDataByAbbreviation } from '@/app/utils/teamData';
import { GAME_EVENTS, MISS_TYPES, PENALTY_DESCRIPTIONS, PENALTY_TYPES, ZONE_DESCRIPTIONS } from '@/app/utils/constants';
import SirenOnSVG from '@/app/assets/siren-on-solid.svg';
import PeriodSelector from '@/app/components/PeriodSelector';
import Image from 'next/image';
import Headshot from '@/app/components/Headshot';
import { PropTypes } from 'prop-types';
import { useGameContext } from '@/app/contexts/GameContext';
import GameSkeleton from '@/app/components/GameSkeleton';
import { notFound } from 'next/navigation';
import { formatPeriodLabel } from '@/app/utils/formatters';
import IceRink from '@/app/components/IceRink';

const PlayByPlay = ({ params }) => {
  const { gameData } = useGameContext();

  const { id } = use(params);
  const logos = {};

  // Initial state for the game data
  const [playByPlay, setPlayByPlay] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [activePeriod, setActivePeriod] = useState(null);
  const [eventFilter, setEventFilter] = useState(null);

  // Use `useEffect` to run once on initial render and set up polling
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const playByPlayResponse = await fetch(`/api/nhl/gamecenter/${id}/play-by-play`, { cache: 'no-store' });
        const playByPlayData = await playByPlayResponse.json();

        setPlayByPlay(playByPlayData);
        setGameState(playByPlayData.gameState);
        if (activePeriod === null) {
          setActivePeriod(playByPlayData.periodDescriptor?.number);
        }
      } catch (error) {
        console.error('Error fetching game data:', error);

        return;
      }
    };

    fetchGameData();

    // Only set up polling if gameState is one of the following values: 'PRE', 'LIVE', 'CRIT'
    if (['PRE', 'LIVE', 'CRIT'].includes(gameState)) {
      const intervalId = setInterval(() => {
        fetchGameData();
      }, 20000); // 20 seconds polling interval

      // Cleanup the interval when component unmounts or gameState changes
      return () => clearInterval(intervalId);
    }
  }, [ id, gameState, activePeriod ]);

  // If no boxscore available, redirect back up
  if (!gameData || !playByPlay) {
    return <GameSkeleton hideGameHeader />;
  }

  // No reason to render future games
  if (['PRE', 'FUT'].includes(gameState)) {
    return notFound();
  }

  // Destructure data for rendering
  const { homeTeam, awayTeam, game } = gameData;

  homeTeam.data = getTeamDataByAbbreviation(game.homeTeam.abbrev) || {};
  awayTeam.data = getTeamDataByAbbreviation(game.awayTeam.abbrev) || {};

  // Update logo map
  logos[homeTeam.abbrev] = homeTeam.logo;
  logos[awayTeam.abbrev] = awayTeam.logo;

  const filteredPlays = playByPlay.plays?.filter((p) => {
    if (activePeriod && p.periodDescriptor.number !== activePeriod) {
      return false;
    }

    if (eventFilter && eventFilter !== 'all') {
      return p.typeDescKey === eventFilter;
    }
    
    return true;
  });
  let sortedPlays = filteredPlays;
  if (['LIVE', 'CRIT'].includes(playByPlay.gameState)) {
    sortedPlays = filteredPlays.sort((a, b) => b.sortOrder - a.sortOrder);
  }

  const lookupPlayerData = (playerId) => {
    const defaultPlayer = { firstName: { default: 'Unnamed' }, lastName: { default: 'Player' }};

    return playByPlay.rosterSpots.find((player) => player.playerId === playerId) || defaultPlayer;
  };

  const lookupTeamDataByTeamId = (teamId) => {
    if (teamId === awayTeam.id) {
      return getTeamDataByAbbreviation(awayTeam.abbrev);
    }
    if (teamId === homeTeam.id) {
      return getTeamDataByAbbreviation(homeTeam.abbrev);
    }

    return {};
  };

  const renderTeamLogo = (teamId, size, theme) => {
    let className = 'h-10 w-10';
    if (size) {
      className = `h-${size} w-${size}`;
    }

    if (teamId === awayTeam.id) {
      return (
        <TeamLogo
          src={logos[awayTeam.abbrev]}
          alt={awayTeam.abbrev}
          className={className}
          colorMode={theme}
        />
      );
    }
    if (teamId === homeTeam.id) {
      return (
        <TeamLogo
          src={logos[homeTeam.abbrev]}
          alt={homeTeam.abbrev}
          className={className}
          colorMode={theme}
        />
      );
    }
  };

  const renderPlayer = (playerId) => {
    const player = lookupPlayerData(playerId);

    if (!player.playerId) {
      return (
        <>
          <span href={`/player/${player.playerId}`} className="font-bold">{player.firstName.default} {player.lastName.default}</span>
        </>
      );
    }

    return (
      <>
        <span className="p-1 border rounded text-xs mx-1">#{player.sweaterNumber}</span>{' '}
        <Link href={`/player/${player.playerId}`} className="font-bold">{player.firstName.default} {player.lastName.default}</Link>
      </>
    );
  };

  const renderPlayByPlayEvent = (play) => {

    const e = play.details || {};
    const eventTeamData = lookupTeamDataByTeamId(e.eventOwnerTeamId);

    switch (play.typeDescKey) {
    case 'period-start':
      return (
        <div className="">
          Start of {formatPeriodLabel({ ...game.periodDescriptor, number: play.periodDescriptor.number }, true)}
        </div>
      );
    case 'faceoff':
      return (
        <div className="">
          {renderPlayer(e.winningPlayerId)} won a faceoff against {renderPlayer(e.losingPlayerId)} {e.zoneCode ? `in the ${ZONE_DESCRIPTIONS[e.zoneCode]}` : '' }
        </div>
      );
    case 'blocked-shot':
      return (
        <div className="">
          {renderPlayer(e.shootingPlayerId)}&apos;s shot was blocked by {e.reason === 'teammate-blocked' ? 'teammate' : ''} {renderPlayer(e.blockingPlayerId)}
        </div>
      );
    case 'shot-on-goal':
      return (
        <div className="">
          {renderPlayer(e.shootingPlayerId)} took a shot on {renderPlayer(e.goalieInNetId)}
        </div>
      );
    case 'stoppage':
      return (
        <div className="">
          {GAME_EVENTS[e.reason]}{(e.secondaryReason && e.secondaryReason !== e.reason) ? `, ${GAME_EVENTS[e.secondaryReason]}` : ''}
        </div>
      );
    case 'hit':
      return (
        <div className="">
          {renderPlayer(e.hittingPlayerId)} hit {renderPlayer(e.hitteePlayerId)} {e.zoneCode ? `in the ${ZONE_DESCRIPTIONS[e.zoneCode]}` : '' }
        </div>
      );
    case 'giveaway':
      return (
        <div className="">
          {renderPlayer(e.playerId)} gave the puck away {e.zoneCode ? `in the ${ZONE_DESCRIPTIONS[e.zoneCode]}` : '' }
        </div>
      );
    case 'takeaway':
      return (
        <div className="">
          {renderPlayer(e.playerId)} took the puck away {e.zoneCode ? `in the ${ZONE_DESCRIPTIONS[e.zoneCode]}` : '' }
        </div>
      );
    case 'missed-shot':
      return (
        <div className="">
          {renderPlayer(e.shootingPlayerId)} missed a {e.shotType} shot {e.reason ? `(${MISS_TYPES[e.reason] || e.reason})` : '' }
        </div>
      );
    case 'goal':
      return (
        <div className="p-2 gap-4 rounded-lg flex flex-wrap justify-center md:justify-between items-center bg-red-900/80 text-white" style={{ borderLeft: `solid 25px ${eventTeamData.teamColor}` }}>
          <div className="flex gap-4 items-center justify-start">
            <Headshot
              playerId={e.scoringPlayerId}
              src={(lookupPlayerData(e.scoringPlayerId)).headshot}
              alt="Player Headshot"
              className="h-16 w-16 hidden lg:block"
            />
            <div className="">
              <div className="font-medium text-lg mb-3">{renderPlayer(e.scoringPlayerId)} ({e.scoringPlayerTotal}) scored {e.shotType ? `(${GAME_EVENTS[e.shotType]?.toLowerCase()})` : ''}</div>
              {(e.assist1PlayerId || e.assist2PlayerId) && (
                <span>Assisted By: </span>
              )}
              {e.assist1PlayerId && (
                <span>{renderPlayer(e.assist1PlayerId)} ({e.assist1PlayerTotal})</span>
              )}
              {e.assist2PlayerId && (
                <span> and {renderPlayer(e.assist2PlayerId)} ({e.assist2PlayerTotal})</span>
              )}
              {!e.assist1PlayerId && !e.assist2PlayerId && (
                <span>Unassisted</span>
              )}
            </div>
          </div>
          <div className="w-10">
            {play.periodDescriptor?.periodType === 'SO' ? (
              <div className="text-2xl text-yellow-500"><FontAwesomeIcon icon={faCheckCircle} /></div>
            ) : (
              <div className="text-2xl font-bold">{e.awayScore}-{e.homeScore}</div>
            )}
            
          </div>
          {play.details?.highlightClipSharingUrl && (
            <div className="text-center text-white">
              <Link href={play.details?.highlightClipSharingUrl} rel="noopener noreferrer">
                <FontAwesomeIcon icon={faPlayCircle} size="2x" className="align-middle mx-auto" />
              </Link>
            </div>
          )}
        </div>
      );
    case 'penalty':
      return (
        <div className="p-2 gap-4 rounded-lg flex flex-wrap justify-center md:justify-start items-center bg-slate-500/80 text-white" style={{ borderLeft: `solid 25px ${eventTeamData.teamColor}`}}>
          {e.committedByPlayerId ? (
            <Headshot
              playerId={e.committedByPlayerId}
              src={(lookupPlayerData(e.committedByPlayerId)).headshot}
              alt="Player Headshot"
              className="h-16 w-16 hidden lg:block"
            />
          ) : (
            <div className="bg-slate-100 rounded-full h-16 w-16 hidden lg:block">
              {renderTeamLogo(play.details?.eventOwnerTeamId, 16, 'light')}
            </div>
          )}
          <div className="">
            {e.committedByPlayerId ? (
              <div className="font-medium text-lg mb-3">{renderPlayer(e.committedByPlayerId)}</div>
            ) : (
              <div className="font-medium text-lg mb-3">Team Penalty</div>
            )}
            {e.servedByPlayerId && (
              <div className="text-xs my-2">Served by: {renderPlayer(e.servedByPlayerId)}</div>
            )}
            {e.drawnByPlayerId && (
              <div className="text-xs my-2">Drawn By: {renderPlayer(e.drawnByPlayerId)}</div>
            )}
          </div>
          <div className="">
            <div className="text-xs font-light">Duration</div>
            <div>{e.duration} minutes</div>
          </div>
          <div className="">
            <div className="text-xs font-light">{PENALTY_TYPES[e.typeCode]}</div>
            <div>{PENALTY_DESCRIPTIONS[e.descKey]}</div>
          </div>
        </div>
      );
    case 'period-end':
      return (
        <div className="">
          End of {formatPeriodLabel({ ...game.periodDescriptor, number: play.periodDescriptor.number }, true)}
        </div>
      );
    case 'shootout-complete':
      return (
        <div className="">
          Shootout complete
        </div>
      );
    case 'delayed-penalty':
      return (
        <div className="">
          Delayed penalty
        </div>
      );
    case 'game-end':
      return (
        <div className="">
          End of game
        </div>
      );
    }
  };

  const handleFilterChange = (e) => {
    setEventFilter(e.target.value);
  };

  return (
    <div>
      <div className="flex justify-center items-center my-5">
        <PeriodSelector periodData={game.periodDescriptor} activePeriod={activePeriod} handlePeriodChange={setActivePeriod} includeAll={true} />
        <div className="mx-5">
          <select 
            className="p-2 text-sm min-w-[200px] border rounded text-black dark:text-white bg-white dark:bg-black" 
            value={eventFilter || 'all'}
            onChange={handleFilterChange}
          >
            <option value="all">All Events</option>
            <option value="goal">Goals</option>
            <option value="shot-on-goal">Shots on Goal</option>
            <option value="missed-shot">Missed Shots</option>
            <option value="blocked-shot">Blocked Shots</option>
            <option value="hit">Hits</option>
            <option value="giveaway">Giveaways</option>
            <option value="takeaway">Takeaways</option>
            <option value="penalty">Penalties</option>
            <option value="faceoff">Faceoffs</option>
            <option value="stoppage">Stoppage</option>
          </select>
        </div>

      </div>

      <IceRink game={game} plays={filteredPlays} homeTeam={homeTeam} awayTeam={awayTeam} renderPlayByPlayEvent={renderPlayByPlayEvent} renderTeamLogo={renderTeamLogo} />

      <div className="overflow-x-auto">
        <table className="text-xs min-w-full table-auto">
          <thead>
            <tr className="hidden">
              <th className="p-2 text-center">Time</th>
              <th className="p-2 text-center">Event Type</th>
              <th className="p-2 text-center">Details</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlays.length === 0 && (
              <tr>
                <td colSpan={3} className="p-2 text-center">No matching plays.</td>
              </tr>
            )}
            {sortedPlays.map((play, i) => {
              return(
                <tr key={play.eventId} className={i % 2 === 0 ? 'bg-slate-500/10' : ''}>
                  <td className="p-2 text-xs text-center">
                    <div className="mt-1">
                      <span className="p-1 mx-auto font-bold border rounded">{play.timeRemaining}</span>
                    </div>
                    {activePeriod === 0 && (
                      <div className="p-2">{formatPeriodLabel(play.periodDescriptor, true)}</div>
                    )}
                  </td>
                  <td className="p-2 flex flex-wrap gap-2 items-center">
                    <div className="w-10 h-10">
                      {play.details?.eventOwnerTeamId && renderTeamLogo(play.details?.eventOwnerTeamId)}
                    </div>
                    <div>
                      <span className="hidden lg:block p-1 border rounded font-bold text-xs uppercase">
                        {GAME_EVENTS[play.typeDescKey]}
                      </span>
                      {play.typeDescKey === 'goal' && (
                        <div>
                          <Image
                            src={SirenOnSVG}
                            className="p-2 w-12 h-12 animate-pulse mx-auto"
                            width={200}
                            heigh={200}
                            alt="Goal"
                          />
                        </div>
                      )}
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
