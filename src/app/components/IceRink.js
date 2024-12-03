'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import RinkSvg from '@/app/assets/rink.svg';
import { PropTypes } from 'prop-types';
import TeamLogo from './TeamLogo';
import { Skater } from './Skater';
import { GAME_EVENTS } from '../utils/constants';

const IceRink = ({ game, plays, homeTeam, awayTeam, renderPlayByPlayEvent }) => {
  const [playBoxContent, setPlayBoxContent] = useState(null);
  const [activePlay, setActivePlay] = useState(null);

  let mappedPlays = plays.filter((p) => p.details?.xCoord !== undefined && p.details?.yCoord !== undefined) || [];
  mappedPlays = mappedPlays.sort((a, b) => b.sortOrder - a.sortOrder);

  const mappedPlayMostRecent = mappedPlays[0]?.eventId;

  useEffect(() => {
    setActivePlay(mappedPlayMostRecent);
    setPlayBoxContent(null);
  }, [mappedPlayMostRecent]);

  const logos = {};
  logos[homeTeam.abbrev] = homeTeam.logo;
  logos[awayTeam.abbrev] = awayTeam.logo;

  const handleMarkerAction = (e) => {
    const play = mappedPlays[e.target.closest('div').getAttribute('data-index')] || {};

    setPlayBoxContent(
      <div className="flex gap-2 items-center">
        <div className="">
          <span className="p-1 text-xs font-bold border rounded">{play.timeRemaining}</span>
        </div>
        <div className="">
          <TeamLogo
            team={play.details.eventOwnerTeamId === homeTeam.id
              ? homeTeam.data.abbreviation
              : awayTeam.data.abbreviation}
            className="h-16 w-16"
          />
        </div>
        <div className="">{renderPlayByPlayEvent(play)}</div>
      </div>
    );
  };

  return (
    <div>
      <div className="relative m-4">
        <TeamLogo
          src={logos[homeTeam.abbrev]}
          alt="Center Ice"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 opacity-50"
        />

        <Image
          src={RinkSvg}
          alt="Rink"
          width={2000}
          height={850}
          className="my-4 dark:invert dark:grayscale opacity-25"
        />
        {mappedPlays.map((play, index) => (
          <div
            key={index}
            className={`absolute ${activePlay === play.eventId ? 'animate-pulse border-2 border-slate-800 dark:border-slate-200 rounded-full' : ''}`}
            style={{
              top: `${play.details?.yCoord + 50}%`,
              left: `${play.details?.xCoord/2.1 + 50}%`,
              transform: 'translate(-50%, -50%)',
              opacity: index < 3 || play.typeDescKey === 'goal' ? 1 : 0.5,
              zIndex: index < 3 || play.typeDescKey === 'goal' ? 1 : 0
            }}
            title={`${GAME_EVENTS[play.typeDescKey] || play.typeDescKey} @ ${play.timeInPeriod} (${play.details.xCoord},${play.details.yCoord})`}
            data-index={index}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" onClick={handleMarkerAction} onMouseOver={handleMarkerAction} onMouseOut={() => setPlayBoxContent(null)} style={{ cursor: 'pointer' }}>
              {play.typeDescKey	 === 'goal' ? (
                <circle cx="5" cy="5" r="5" fill={play.details.eventOwnerTeamId === homeTeam.id ? homeTeam.data.teamColor : awayTeam.data.teamColor} />
              ) : (
                <path d="M5 0C2.24 0 0 2.24 0 5C0 7.76 2.24 10 5 10C7.76 10 10 7.76 10 5C10 2.24 7.76 0 5 0ZM5 8C3.34 8 2 6.66 2 5C2 3.34 3.34 2 5 2C6.66 2 8 3.34 8 5C8 6.66 6.66 8 5 8Z" fill={play.details.eventOwnerTeamId === homeTeam.id ? homeTeam.data.teamColor : awayTeam.data.teamColor} />
              )}
            </svg>
          </div>
        ))}
        {!plays.length > 0 && game?.summary?.iceSurface && (
          <div className="absolute top-2 bottom-2 left-0 right-0 grid grid-cols-6 items-center">
            <div className="col-span-1 text-center">
              {game.summary.iceSurface.awayTeam.goalies.map((p) => (
                <Skater key={p.playerId} player={p} isHomeTeam={false} teamColor={awayTeam.data.teamColor} />
              ))}
            </div>
            <div className="col-span-1 text-center">
              {game.summary.iceSurface.awayTeam.defensemen.map((p) => (
                <Skater key={p.playerId} player={p} isHomeTeam={false} teamColor={awayTeam.data.teamColor} />
              ))}
            </div>
            <div className="col-span-1 text-center">
              {game.summary.iceSurface.awayTeam.forwards.map((p) => (
                <Skater key={p.playerId} player={p} isHomeTeam={false} teamColor={awayTeam.data.teamColor} />
              ))}
            </div>
            <div className="col-span-1 text-center">
              {game.summary.iceSurface.homeTeam.forwards.map((p) => (
                <Skater key={p.playerId} player={p} isHomeTeam={true} teamColor={homeTeam.data.teamColor} />
              ))}
            </div>
            <div className="col-span-1 text-center">
              {game.summary.iceSurface.homeTeam.defensemen.map((p) => (
                <Skater key={p.playerId} player={p} isHomeTeam={true} teamColor={homeTeam.data.teamColor} />
              ))}
            </div>
            <div className="col-span-1 text-center">
              {game.summary.iceSurface.homeTeam.goalies.map((p) => (
                <Skater key={p.playerId} player={p} isHomeTeam={true} teamColor={homeTeam.data.teamColor} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div id="playBox" className="my-2 text-sm flex items-center justify-center">
        <div>{playBoxContent || <span className="leading-10">&nbsp;</span>}</div>
        {!plays.length > 0 && (game?.summary.iceSurface?.awayTeam.penaltyBox.length > 0 || game?.summary.iceSurface?.homeTeam.penaltyBox.length > 0) && (
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-1 flex gap-2 justify-end">
              {game.summary.iceSurface?.awayTeam.penaltyBox.map((p, i) => (
                <Skater key={`${p.playerId}-${i}`} player={p} game={game} isHomeTeam={false} teamColor={awayTeam.data.teamColor} />
              ))}
            </div>
            <div className="col-span-1 flex gap-2 justify-start">
              {game.summary.iceSurface?.homeTeam.penaltyBox.map((p, i) => (
                <Skater key={`${p.playerId}-${i}`} player={p} game={game} isHomeTeam={true} teamColor={homeTeam.data.teamColor} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

IceRink.propTypes = {
  game: PropTypes.object.isRequired,
  plays: PropTypes.array,
  homeTeam: PropTypes.object.isRequired,
  awayTeam: PropTypes.object.isRequired,
  renderPlayByPlayEvent: PropTypes.func.isRequired
};

IceRink.defaultProps = {
  plays: [],
  players: []
};

export default IceRink;