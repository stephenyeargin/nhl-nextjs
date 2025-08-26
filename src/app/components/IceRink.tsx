'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import RinkSvg from '@/app/assets/rink.svg';
import TeamLogo from './TeamLogo';
import { Skater } from './Skater';
import { GAME_EVENTS } from '../utils/constants';
import { formatPeriodLabel } from '../utils/formatters';
import type { PeriodDescriptor } from '@/app/types/game';

interface TeamDataColors {
  teamColor?: string;
  secondaryTeamColor?: string;
  abbreviation?: string;
}

interface BasicTeamInfo {
  abbrev: string;
  logo?: string;
  id?: number | string;
  data?: TeamDataColors;
}

interface PlayDetails {
  xCoord?: number;
  yCoord?: number;
  eventOwnerTeamId?: number | string;
}

interface RinkPlay {
  eventId: number | string;
  sortOrder: number;
  details: PlayDetails;
  typeDescKey: string;
  timeRemaining?: string;
  timeInPeriod?: string;
  periodDescriptor: PeriodDescriptor;
  homeTeamDefendingSide?: string; // present on first play
}

interface IceSurfaceRosterPlayer {
  playerId: number;
}

interface IceSurfaceTeamGroup {
  goalies: IceSurfaceRosterPlayer[];
  defensemen: IceSurfaceRosterPlayer[];
  forwards: IceSurfaceRosterPlayer[];
  penaltyBox: IceSurfaceRosterPlayer[];
}

interface IceSurfaceSummary {
  awayTeam: IceSurfaceTeamGroup;
  homeTeam: IceSurfaceTeamGroup;
}

interface GameSummary {
  iceSurface?: IceSurfaceSummary;
}

interface IceRinkGame {
  summary?: GameSummary;
}

interface IceRinkProps {
  game: IceRinkGame;
  plays?: RinkPlay[];
  homeTeam: BasicTeamInfo;
  awayTeam: BasicTeamInfo;
  renderPlayByPlayEvent: (_play: RinkPlay) => React.ReactNode;
  renderTeamLogo: (_teamId?: number | string) => React.ReactNode;
}

const IceRink: React.FC<IceRinkProps> = ({
  game,
  plays = [],
  homeTeam,
  awayTeam,
  renderPlayByPlayEvent,
  renderTeamLogo,
}) => {
  const [playBoxContent, setPlayBoxContent] = useState<React.ReactNode>(null);
  const [activePlay, setActivePlay] = useState<number | string | null>(null);
  const [hoverPlay, setHoverPlay] = useState<RinkPlay | null>(null);

  let mappedPlays: RinkPlay[] =
    plays.filter((p) => p.details?.xCoord !== undefined && p.details?.yCoord !== undefined) || [];
  mappedPlays = mappedPlays.sort((a, b) => b.sortOrder - a.sortOrder);

  const mappedPlayMostRecent = mappedPlays[0]?.eventId;

  useEffect(() => {
    setPlayBoxContent(null);
  }, [mappedPlayMostRecent]);

  const logos: Record<string, string | undefined> = {};
  logos[homeTeam.abbrev] = homeTeam.logo;
  logos[awayTeam.abbrev] = awayTeam.logo;

  const handleMarkerAction = (e: React.MouseEvent<HTMLDivElement>) => {
    const marker = (e.target as HTMLElement).closest('div');
    if (!marker) {
      return;
    }
    const indexAttr = marker.getAttribute('data-index');
    if (indexAttr === null) {
      return;
    }
    const play = mappedPlays[Number(indexAttr)];
    if (!play) {
      return;
    }
    setActivePlay(play.eventId);

    setPlayBoxContent(
      <div className="flex gap-2 items-center">
        <div className="mt-3 text-xs text-center">
          <div>
            <span className="p-1 font-bold border rounded">{play.timeRemaining}</span>
          </div>
          <div className="p-2">{formatPeriodLabel(play.periodDescriptor, true)}</div>
        </div>
        <TeamLogo
          team={
            play.details.eventOwnerTeamId === homeTeam.id
              ? homeTeam.data?.abbreviation || homeTeam.abbrev
              : awayTeam.data?.abbreviation || awayTeam.abbrev
          }
          className="h-16 w-16"
        />
        {renderPlayByPlayEvent(play)}
      </div>
    );
  };

  const isHomeDefendingLeft = !!plays && plays[0]?.homeTeamDefendingSide !== 'left';

  let hoverTimeOut: ReturnType<typeof setTimeout> | undefined;

  const handleHoverEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hoverTimeOut) {
      clearTimeout(hoverTimeOut);
    }
    const marker = (e.target as HTMLElement).closest('div');
    if (!marker) {
      return;
    }
    const indexAttr = marker.getAttribute('data-index');
    if (indexAttr === null) {
      return;
    }
    const play = mappedPlays[Number(indexAttr)];
    if (!play) {
      return;
    }
    setHoverPlay(play);
  };

  const handleHoverLeave = () => {
    hoverTimeOut = setTimeout(() => {
      if (hoverPlay) {
        setHoverPlay(null);
      }
    }, 2500);
  };

  const handleRinkClick = () => {
    setPlayBoxContent(null);
    setActivePlay(null);
  };

  return (
    <div id="iceRink">
      <div className="relative m-4">
        <Image
          src={RinkSvg}
          alt="Rink"
          width={2000}
          height={850}
          className="my-4 dark:invert dark:grayscale opacity-25"
          onClick={handleRinkClick}
        />
        <TeamLogo
          src={logos[homeTeam.abbrev]}
          alt="Center Ice"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 opacity-50"
        />
        <div className="text-lg md:text-2xl font-bold text-center opacity-25">
          <div
            className={`absolute ${isHomeDefendingLeft ? '-rotate-90' : 'rotate-90'}`}
            style={{
              width: '40%',
              top: '45.5%',
              left: isHomeDefendingLeft ? '-17.5%' : 'unset',
              right: !isHomeDefendingLeft ? '-17.5%' : 'unset',
            }}
          >
            {awayTeam.abbrev}
          </div>
          <div
            className={`absolute ${isHomeDefendingLeft ? 'rotate-90' : '-rotate-90'}`}
            style={{
              width: '40%',
              top: '45.5%',
              left: !isHomeDefendingLeft ? '-17.5%' : 'unset',
              right: isHomeDefendingLeft ? '-17.5%' : 'unset',
            }}
          >
            {homeTeam.abbrev}
          </div>
        </div>
        {mappedPlays.map((play, index) => (
          <div
            key={index}
            className={`absolute ${activePlay === play.eventId ? 'animate-pulse border-2 border-slate-800 dark:border-slate-200 rounded-full' : ''}`}
            style={{
              top: `${-1 * ((play.details?.yCoord ?? 0) / 0.88) + 50}%`,
              left: `${(play.details?.xCoord ?? 0) / 2.02 + 50}%`,
              transform: 'translate(-50%, -50%)',
              opacity: index < 3 || play.typeDescKey === 'goal' ? 1 : 0.75,
              zIndex: index < 3 || play.typeDescKey === 'goal' ? 1 : 0,
              cursor: 'pointer',
            }}
            data-debug={`Event #${play.eventId}: ${(GAME_EVENTS as Record<string, string>)[play.typeDescKey] || play.typeDescKey} @ ${play.timeInPeriod} (${play.details?.xCoord},${play.details?.yCoord})`}
            data-index={index}
            onClick={handleMarkerAction}
            onMouseEnter={handleHoverEnter}
            onMouseOut={handleHoverLeave}
          >
            <svg
              width={play.typeDescKey !== 'goal' ? 20 : 25}
              height={play.typeDescKey !== 'goal' ? 20 : 25}
              viewBox="0 0 10 10"
            >
              {play.typeDescKey === 'goal' ? (
                <>
                  <circle
                    cx="5"
                    cy="5"
                    r="5"
                    fill={
                      play.details.eventOwnerTeamId === homeTeam.id
                        ? homeTeam.data?.teamColor
                        : awayTeam.data?.teamColor
                    }
                  />
                  <text x={1} y={8} className="fill-white font-sans" style={{ fontSize: '6pt' }}>
                    {play.periodDescriptor?.periodType !== 'SO' ? '★' : '✓'}
                  </text>
                </>
              ) : (
                <>
                  <circle
                    cx="5"
                    cy="5"
                    r="4"
                    strokeWidth="2"
                    stroke={
                      play.details.eventOwnerTeamId === homeTeam.id
                        ? homeTeam.data?.secondaryTeamColor
                        : awayTeam.data?.secondaryTeamColor
                    }
                  />
                  <circle
                    cx="5"
                    cy="5"
                    r="4"
                    strokeWidth="1"
                    stroke={
                      play.details.eventOwnerTeamId === homeTeam.id
                        ? homeTeam.data?.teamColor
                        : awayTeam.data?.teamColor
                    }
                  />
                  <text
                    x={5}
                    y={6.5}
                    fontFamily="Arial"
                    fontWeight="bold"
                    fontSize="4pt"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    className="font-bold uppercase fill-white"
                  >
                    {play.typeDescKey.substr(0, 1)}
                  </text>
                </>
              )}
            </svg>
          </div>
        ))}
        {hoverPlay && (
          <div
            className="absolute m-20"
            style={{
              top: `${-1 * ((hoverPlay.details?.yCoord ?? 0) / 0.88) + 45}%`,
              left: `${(hoverPlay.details?.xCoord ?? 0) / 2.02 + 45}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
            }}
          >
            <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-lg shadow-lg flex gap-2 items-center">
              <div className="text-xs text-center">
                <div className="p-1" style={{ width: '75px' }}>
                  <span className="text-xs p-1 border rounded font-bold">
                    {hoverPlay.timeRemaining}
                  </span>
                </div>
                <div className="mt-1">{formatPeriodLabel(hoverPlay.periodDescriptor, true)}</div>
              </div>
              <div style={{ width: '50px' }}>
                {renderTeamLogo(hoverPlay.details?.eventOwnerTeamId)}
              </div>
              <div className="text-lg font-bold" style={{ minWidth: '100px' }}>
                {(GAME_EVENTS as Record<string, string>)[hoverPlay.typeDescKey]}
              </div>
            </div>
          </div>
        )}
        {!plays.length && game?.summary?.iceSurface && (
          <div className="absolute top-1 bottom-2 left-0 right-0 grid grid-cols-6 items-center">
            <div className="col-span-1 text-center">
              {game.summary.iceSurface.awayTeam.goalies.map((p) => (
                <Skater key={p.playerId} player={p} isHomeTeam={false} team={awayTeam.abbrev} />
              ))}
            </div>
            <div className="col-span-1 text-center">
              {game.summary.iceSurface.awayTeam.defensemen.map((p) => (
                <Skater key={p.playerId} player={p} isHomeTeam={false} team={awayTeam.abbrev} />
              ))}
            </div>
            <div className="col-span-1 text-center">
              {game.summary.iceSurface.awayTeam.forwards.map((p) => (
                <Skater key={p.playerId} player={p} isHomeTeam={false} team={awayTeam.abbrev} />
              ))}
            </div>
            <div className="col-span-1 text-center">
              {game.summary.iceSurface.homeTeam.forwards.map((p) => (
                <Skater key={p.playerId} player={p} isHomeTeam={true} team={homeTeam.abbrev} />
              ))}
            </div>
            <div className="col-span-1 text-center">
              {game.summary.iceSurface.homeTeam.defensemen.map((p) => (
                <Skater key={p.playerId} player={p} isHomeTeam={true} team={homeTeam.abbrev} />
              ))}
            </div>
            <div className="col-span-1 text-center">
              {game.summary.iceSurface.homeTeam.goalies.map((p) => (
                <Skater key={p.playerId} player={p} isHomeTeam={true} team={homeTeam.abbrev} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div id="playBox" className="my-2 text-sm flex items-center justify-center">
        <div>{playBoxContent || <span className="leading-10">&nbsp;</span>}</div>
        {!plays.length &&
          game?.summary?.iceSurface &&
          (() => {
            const awayPen = game.summary?.iceSurface?.awayTeam.penaltyBox || [];
            const homePen = game.summary?.iceSurface?.homeTeam.penaltyBox || [];
            if (!awayPen.length && !homePen.length) {
              return null;
            }

            return (
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-1 flex gap-2 justify-end">
                  {awayPen.map((p, i) => (
                    <Skater
                      key={`${p.playerId}-${i}`}
                      player={p}
                      isHomeTeam={false}
                      team={awayTeam.abbrev}
                    />
                  ))}
                </div>
                <div className="col-span-1 flex gap-2 justify-start">
                  {homePen.map((p, i) => (
                    <Skater
                      key={`${p.playerId}-${i}`}
                      player={p}
                      isHomeTeam={true}
                      team={homeTeam.abbrev}
                    />
                  ))}
                </div>
              </div>
            );
          })()}
      </div>
    </div>
  );
};

export default IceRink;
