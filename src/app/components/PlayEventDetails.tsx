'use client';

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import Headshot from './Headshot';
import TeamLogo from './TeamLogo';
import {
  GAME_EVENTS,
  MISS_TYPES,
  NHL_BRIGHTCOVE_ACCOUNT,
  PENALTY_DESCRIPTIONS,
  PENALTY_TYPES,
  ZONE_DESCRIPTIONS,
} from '@/app/utils/constants';
import { formatPeriodLabel } from '@/app/utils/formatters';

type RosterPlayer = {
  playerId?: number;
  sweaterNumber?: number;
  headshot?: string;
  firstName?: { default?: string };
  lastName?: { default?: string };
};

type TeamColors = {
  teamColor?: string;
  abbreviation?: string;
};

export interface PlayEventDetailsProps {
  play: any;
  game: any;
  rosterSpots: RosterPlayer[];
  lookupTeamDataByTeamId: (_teamId: number) => TeamColors;
  onOpenHighlight?: (_payload: { url: string; label: string }) => void;
}

const PlayEventDetails: React.FC<PlayEventDetailsProps> = ({
  play,
  game,
  rosterSpots,
  lookupTeamDataByTeamId,
  onOpenHighlight,
}) => {
  const e = play.details || {};

  const lookupPlayerData = (playerId: number): RosterPlayer => {
    const defPlayer = { firstName: { default: 'Unnamed' }, lastName: { default: 'Player' } };
    const found = rosterSpots.find((pl: any) => pl.playerId === playerId);

    return (found || (defPlayer as RosterPlayer)) as RosterPlayer;
  };

  const renderPlayer = (playerId: number) => {
    const player = lookupPlayerData(playerId);
    if (!player.playerId) {
      return (
        <>
          <span className="font-bold">
            {player.firstName?.default} {player.lastName?.default}
          </span>
        </>
      );
    }

    return (
      <>
        <span className="p-1 border rounded text-xs mx-1">#{player.sweaterNumber}</span>{' '}
        <Link href={`/player/${player.playerId}`} className="font-bold">
          {player.firstName?.default} {player.lastName?.default}
        </Link>
      </>
    );
  };

  const eventTeamData: any = lookupTeamDataByTeamId(e.eventOwnerTeamId);

  switch (play.typeDescKey) {
    case 'period-start':
      return (
        <div>
          Start of{' '}
          {formatPeriodLabel(
            { ...game.periodDescriptor, number: play.periodDescriptor.number },
            true
          )}
        </div>
      );
    case 'faceoff':
      return (
        <div>
          {renderPlayer(e.winningPlayerId)} won a faceoff against {renderPlayer(e.losingPlayerId)}{' '}
          {e.zoneCode ? `in the ${(ZONE_DESCRIPTIONS as Record<string, string>)[e.zoneCode]}` : ''}
        </div>
      );
    case 'blocked-shot':
      return (
        <div>
          {renderPlayer(e.shootingPlayerId)}&apos;s shot was blocked by{' '}
          {e.reason === 'teammate-blocked' ? 'teammate' : ''} {renderPlayer(e.blockingPlayerId)}
        </div>
      );
    case 'shot-on-goal':
      return (
        <div>
          {renderPlayer(e.shootingPlayerId)} took a shot on {renderPlayer(e.goalieInNetId)}
        </div>
      );
    case 'stoppage':
      return (
        <div>
          {(GAME_EVENTS as Record<string, string>)[e.reason]}
          {e.secondaryReason && e.secondaryReason !== e.reason
            ? `, ${(GAME_EVENTS as Record<string, string>)[e.secondaryReason]}`
            : ''}
        </div>
      );
    case 'hit':
      return (
        <div>
          {renderPlayer(e.hittingPlayerId)} hit {renderPlayer(e.hitteePlayerId)}{' '}
          {e.zoneCode ? `in the ${(ZONE_DESCRIPTIONS as Record<string, string>)[e.zoneCode]}` : ''}
        </div>
      );
    case 'giveaway':
      return (
        <div>
          {renderPlayer(e.playerId)} gave the puck away{' '}
          {e.zoneCode ? `in the ${(ZONE_DESCRIPTIONS as Record<string, string>)[e.zoneCode]}` : ''}
        </div>
      );
    case 'takeaway':
      return (
        <div>
          {renderPlayer(e.playerId)} took the puck away{' '}
          {e.zoneCode ? `in the ${(ZONE_DESCRIPTIONS as Record<string, string>)[e.zoneCode]}` : ''}
        </div>
      );
    case 'missed-shot':
      return (
        <div>
          {renderPlayer(e.shootingPlayerId)} missed a {e.shotType} shot{' '}
          {e.reason ? `(${(MISS_TYPES as Record<string, string>)[e.reason] || e.reason})` : ''}
        </div>
      );
    case 'goal':
      return (
        <div
          className="p-2 gap-5 rounded-lg flex flex-wrap justify-center md:justify-between items-center bg-red-900/80 text-white"
          style={{ borderLeft: `solid 25px ${eventTeamData.teamColor}` }}
        >
          <div className="flex gap-5 items-center justify-start">
            <Headshot
              playerId={e.scoringPlayerId}
              src={lookupPlayerData(e.scoringPlayerId).headshot}
              alt="Player Headshot"
              className="h-16 w-16 hidden lg:block"
              team={eventTeamData.abbreviation}
            />
            <div>
              <div className="font-medium text-lg mb-3">
                {renderPlayer(e.scoringPlayerId)}{' '}
                {e.scoringPlayerTotal ? `(${e.scoringPlayerTotal})` : ''} scored{' '}
                {e.shotType
                  ? `(${(GAME_EVENTS as Record<string, string>)[e.shotType]?.toLowerCase()})`
                  : ''}
              </div>
              {(e.assist1PlayerId || e.assist2PlayerId) && <span>Assisted By: </span>}
              {e.assist1PlayerId && (
                <span>
                  {renderPlayer(e.assist1PlayerId)} ({e.assist1PlayerTotal})
                </span>
              )}
              {e.assist2PlayerId && (
                <span>
                  {' '}
                  and {renderPlayer(e.assist2PlayerId)} ({e.assist2PlayerTotal})
                </span>
              )}
              {!e.assist1PlayerId && !e.assist2PlayerId && <span>Unassisted</span>}
            </div>
          </div>
          <div className="w-10">
            {play.periodDescriptor?.periodType === 'SO' ? (
              <div className="text-2xl text-yellow-500">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
            ) : (
              <div className="text-2xl font-bold">
                {e.awayScore}-{e.homeScore}
              </div>
            )}
          </div>
          {play.details?.highlightClip && (
            <div className="text-center text-white">
              <button
                onClick={() => {
                  if (!onOpenHighlight) {
                    return;
                  }
                  const player = lookupPlayerData(e.scoringPlayerId);
                  const url = `https://players.brightcove.net/${NHL_BRIGHTCOVE_ACCOUNT}/default_default/index.html?videoId=${play.details.highlightClip}`;
                  const label = `${eventTeamData.abbreviation} | ${play.timeInPeriod} ${formatPeriodLabel(play.periodDescriptor)} | ${player.firstName?.default} ${player.lastName?.default}`;
                  onOpenHighlight({ url, label });
                }}
              >
                <FontAwesomeIcon icon={faPlayCircle} size="2x" className="align-middle mx-auto" />
              </button>
            </div>
          )}
        </div>
      );
    case 'penalty':
      return (
        <div
          className="p-2 gap-5 rounded-lg flex flex-wrap justify-center md:justify-start items-center bg-slate-500/80 text-white"
          style={{ borderLeft: `solid 25px ${eventTeamData.teamColor}` }}
        >
          {e.committedByPlayerId ? (
            <Headshot
              playerId={e.committedByPlayerId}
              src={lookupPlayerData(e.committedByPlayerId).headshot}
              alt="Player Headshot"
              className="h-16 w-16 hidden lg:block"
              team={eventTeamData.abbreviation}
            />
          ) : (
            <div className="bg-slate-100 rounded-full h-16 w-16 hidden lg:block">
              <TeamLogo team={eventTeamData.abbreviation} className="h-16 w-16" />
            </div>
          )}
          <div>
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
          <div>
            <div className="text-xs font-light">Duration</div>
            <div>{e.duration} minutes</div>
          </div>
          <div>
            <div className="text-xs font-light">
              {(PENALTY_TYPES as Record<string, string>)[e.typeCode]}
            </div>
            <div>{(PENALTY_DESCRIPTIONS as Record<string, string>)[e.descKey]}</div>
          </div>
        </div>
      );
    case 'period-end':
      return (
        <div>
          End of{' '}
          {formatPeriodLabel(
            { ...game.periodDescriptor, number: play.periodDescriptor.number },
            true
          )}
        </div>
      );
    case 'shootout-complete':
      return <div>Shootout complete</div>;
    case 'delayed-penalty':
      return <div>Delayed penalty</div>;
    case 'game-end':
      return <div>End of game</div>;
    default:
      return null;
  }
};

export default PlayEventDetails;
