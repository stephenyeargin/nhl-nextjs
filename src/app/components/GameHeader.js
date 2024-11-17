import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPauseCircle, faWarning, faBan } from '@fortawesome/free-solid-svg-icons';
import GameClock from './GameClock';
import { formatGameTime } from '../utils/formatters';
import { PERIOD_DESCRIPTORS } from '../utils/constants';

const GameHeader = ({ game }) => {

  const { venue, venueLocation, awayTeam, homeTeam, gameState, gameScheduleState, periodDescriptor, situation, clock, startTimeUTC } = game;

  let gameHeaderClass = 'grid grid-cols-12 my-5 border py-4 items-center';
  if (gameState === 'CRIT') {
    gameHeaderClass = 'grid grid-cols-12 my-5 border border-red-500 py-4 items-center';
  }

  return (
    <div className={gameHeaderClass}>
      <div className="col-span-3 flex mx-auto gap-2">
        <div>
          <Link href={`/team/${awayTeam.abbrev}`}>
            <Image
            src={awayTeam.logo}
            alt={awayTeam.name.default}
            className="w-20 h-20 mx-auto mb-2"
            width="100"
            height="100"
          />
          </Link>
        </div>
        <div>
          <Link href={`/team/${awayTeam.abbrev}`}>
            <div className="text-xl font-black block md:hidden">{awayTeam.abbrev}</div>
            <div className="text-lg hidden md:block">
              <div className="text-sm">{awayTeam.placeName.default}</div>
              <div className="text-xl font-black">{awayTeam.name.default.replace(awayTeam.placeName.default, '')}</div>
            </div>
          </Link>
          {gameState !== 'FUT' ? (
            <div className="text-sm">SOG: {awayTeam.sog || 0}</div>
          ) : (
            <div className="text-sm">{awayTeam.record}</div>
          )}
        </div>
      </div>
      <div className={`col-span-2 text-center text-5xl md:text-7xl font-black ${awayTeam.score < homeTeam.score && ['FINAL', 'OFF'].includes(gameState) ? 'opacity-50' : ''}`}>
        {situation?.awayTeam.situationDescriptions?.map((code) => (
          <span key={code} className="mx-1 text-lg rounded text-white bg-red-900 p-1 uppercase">{code}</span>
        ))}
        {awayTeam.score}
      </div>
      <div className="col-span-2 text-center content-middle">
        <div className="text-xs my-1">{venue.default}, {venueLocation.default}</div>
        {(gameState === 'LIVE' || gameState === 'CRIT') && (
          <div className="my-3">
            <span className="font-md font-medium px-2 py-1 bg-red-900 text-white rounded mr-2 uppercase">
              {PERIOD_DESCRIPTORS[periodDescriptor.number]}
              {clock.inIntermission ? ' INT' : ''}
            </span>
            <span className="font-bold text-xl">
              <GameClock timeRemaining={clock.timeRemaining} running={clock?.inIntermission || clock?.running} />
              {!clock.inIntermission && !clock.running && (<FontAwesomeIcon icon={faPauseCircle} className="ml-1" />)}
            </span>
          </div>
        )}
        {(gameState === 'FINAL' || gameState === 'OFF') && (
          <div className="text-center my-2 uppercase">
            <span className="text-sm font-medium px-2 py-1 bg-slate-100 dark:text-black rounded">
              Final
              {periodDescriptor.periodType	!== 'REG' && `/${periodDescriptor.periodType}`}
            </span>
          </div>
        )}
        {['FUT', 'PRE'].includes(gameState) && (
          <span className="text-sm font-medium px-2 py-1 bg-slate-100 text-black rounded mr-1 uppercase">{formatGameTime(startTimeUTC)}</span>
        )}
        {gameScheduleState === 'CNCL' && (
          <span className="text-sm font-medium px-2 py-1 bg-slate-900 text-white rounded mr-1 uppercase"><FontAwesomeIcon icon={faBan} fixedWidth /> Cancelled</span>
        )}
        {gameScheduleState === 'PPD' && (
          <span className="text-sm font-medium px-2 py-1 bg-yellow-500 text-black rounded mr-1 uppercase"><FontAwesomeIcon icon={faWarning} fixedWidth /> Postponed</span>
        )}
        {(situation && (situation.awayTeam.strength != 5 || situation?.homeTeam.strength) != 5) && (
          <div className="my-2">
            {situation?.timeRemaining && (
              <span className="text-sm font-medium px-2 py-1 border text-slate-900 dark:text-slate-100 rounded">
                <GameClock timeRemaining={situation?.timeRemaining} running={clock?.running && !clock?.inIntermission} />
              </span>
            )}
            <span className="text-md font-bold px-2 py-1 text-red-900 rounded uppercase">
              {situation?.awayTeam.strength}-on-{situation?.homeTeam.strength}
            </span>
          </div>
        )}
        {!['LIVE', 'CRIT'].includes(gameState) && (
          <div className="text-xs my-2">
            <div>{dayjs(startTimeUTC).format('MMMM D, YYYY')}</div>
          </div>
        )}
      </div>
      <div className={`col-span-2 text-center text-5xl md:text-7xl font-black ${awayTeam.score > homeTeam.score && ['FINAL', 'OFF'].includes(gameState) ? 'opacity-50' : ''}`}>
        {homeTeam.score}
        {situation?.homeTeam.situationDescriptions?.map((code) => (
          <span key={code} className="mx-2 text-lg rounded text-white bg-red-900 p-1 uppercase">{code}</span>
        ))}
      </div>
      <div className="col-span-3 flex mx-auto gap-2">
        <div className="text-right">
          <Link href={`/team/${homeTeam.abbrev}`}>
            <div className="text-xl font-black block md:hidden">{homeTeam.abbrev}</div>
            <div className="text-lg hidden md:block">
              <div className="text-sm">{homeTeam.placeName.default}</div>
              <div className="text-xl font-black">{homeTeam.name.default.replace(homeTeam.placeName.default, '')}</div>
            </div>
          </Link>
          {gameState !== 'FUT' ? (
            <div className="text-sm">SOG: {homeTeam.sog || 0}</div>
          ) : (
            <div className="text-sm">{homeTeam.record}</div>
          )}
        </div>
        <div>
          <Link href={`/team/${homeTeam.abbrev}`}>
            <Image
              src={homeTeam.logo}
              alt={homeTeam.name.default}
              className="w-20 h-20 mx-auto mb-2"
              width="100"
              height="100"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
