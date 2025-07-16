'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPauseCircle, faWarning, faBan, faClock } from '@fortawesome/free-solid-svg-icons';
import GameClock from './GameClock';
import { formatLocalizedDate, formatLocalizedTime, formatPeriodLabel } from '../utils/formatters';
import TeamLogo from './TeamLogo';
import { PropTypes } from 'prop-types';
import SirenOnSVG from '@/app/assets/siren-on-solid.svg';
import Image from 'next/image';
import { useGameContext } from '../contexts/GameContext';
import { getTeamDataByAbbreviation } from '../utils/teamData';
import GameHeaderSkeleton from './GameHeaderSkeleton';

const GameHeader = () => {
  const [isSticky, setIsSticky] = useState(false);
  const stickyRef = useRef(null);

  const { gameData } = useGameContext();

  useEffect(() => {
    const handleScroll = () => {
      if (stickyRef.current) {
        const { top } = stickyRef.current.getBoundingClientRect();
        setIsSticky(top <= 0); // If the element's top is less than or equal to 0, it's sticky
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!gameData || !gameData.game) {
    return <GameHeaderSkeleton />;
  }

  // Destructure data for rendering
  const { game } = gameData;
  const { venue, venueLocation, awayTeam, homeTeam, gameState, gameScheduleState, ifNecessary, periodDescriptor, situation, clock, startTimeUTC } = game;

  awayTeam.data = getTeamDataByAbbreviation(awayTeam.abbrev, false);
  homeTeam.data = getTeamDataByAbbreviation(homeTeam.abbrev, true);

  let gameHeaderClass = 'grid grid-cols-12 my-5 border rounded-lg shadow-sm py-4 items-center';
  if (isSticky) {
    gameHeaderClass = 'grid grid-cols-12 items-center md:sticky top-0 pt-5 z-10 border rounded-b-lg shadow-md pb-5';
  }
  if (gameState === 'CRIT') {
    gameHeaderClass += ' border-red-900';
  }

  const gameHeaderStyle = { background: 'var(--background)' };
  gameHeaderStyle.borderLeft = `solid 10px ${awayTeam.data.teamColor}`;
  gameHeaderStyle.borderRight = `solid 10px ${homeTeam.data.teamColor}`;

  const teamHasRecentGoal = (teamAbbrev, game) => {
    // No goals if game isn't live
    if (!['LIVE', 'CRIT'].includes(game.gameState)) {
      return false;
    }

    // No goals during intermission
    if (game.clock.inIntermission) {
      return false;
    }

    // Retrieve the current period number
    const currentPeriod = game.periodDescriptor.number;

    // Find the most recent goal scored by the specified team in the current period
    const currentPeriodGoals = game.summary.scoring
      .filter(period => period.periodDescriptor.number === currentPeriod)
      .flatMap(period => period.goals)
      .filter(goal => goal.teamAbbrev.default === teamAbbrev);

    if (currentPeriodGoals.length === 0) {
      return false; // No goals scored by the specified team in the current period
    }

    // Get the most recent goal's time in the period
    const mostRecentGoal = currentPeriodGoals[currentPeriodGoals.length - 1];
    const goalTimeStr = mostRecentGoal.timeInPeriod;
    const [goalMinutes, goalSeconds] = goalTimeStr.split(':').map(Number);
    const goalTime = goalMinutes * 60 + goalSeconds; // Convert to total seconds

    // Get the remaining time in the period
    const remainingTimeStr = game.clock.timeRemaining;
    const [remainingMinutes, remainingSeconds] = remainingTimeStr.split(':').map(Number);
    const remainingTime = remainingMinutes * 60 + remainingSeconds; // Convert to total seconds

    // Calculate the elapsed time in the period
    const totalPeriodTime = 20 * 60; // Assume a 20-minute period in seconds
    const elapsedTime = totalPeriodTime - remainingTime;

    // Check if the goal time is within 5 seconds of the elapsed time
    const timeDifference = Math.abs(elapsedTime - goalTime);

    return timeDifference <= 5;
  };

  return (
    <>
      {game.specialEvent && (
        <>
          {game.specialEvent.lightLogoUrl?.default ? (
            <div className="flex justify-center py-5">
              <Image
                src={game.specialEvent.lightLogoUrl.default}
                width={300}
                height={100}
                alt="Event Logo"
                title={game.specialEvent.name.default}
                className="w-full md:w-1/3"
              />
            </div>
          ) : (
            <div className="my-4 text-center font-bold text-gray-500">&#9734;&#9734;&#9734; {game.specialEvent.name.default} &#9734;&#9734;&#9734;</div>
          )}
        </>
      )}
      <div className={gameHeaderClass} ref={stickyRef} style={gameHeaderStyle}>
        <div className="col-span-3 flex flex-wrap mx-auto gap-2 items-center justify-center">
          <div>
            <TeamLogo
              team={awayTeam.abbrev}
              src={awayTeam.logo}
              alt={awayTeam.commonName.default}
              className="w-20 h-20 mx-auto"
            />
          </div>
          <div>
            <Link href={`/team/${awayTeam.abbrev}`}>
              <div className="text-xl font-black block md:hidden">{awayTeam.abbrev}</div>
              <div className="text-lg hidden md:block">
                <div className="text-sm">{awayTeam.placeName.default}</div>
                <div className="text-xl font-black">{awayTeam.commonName.default.replace(awayTeam.placeName.default, '')}</div>
              </div>
            </Link>
            {gameState !== 'FUT' ? (
              <div className="text-sm">SOG: {awayTeam.sog || 0}</div>
            ) : (
              <div className="text-sm">{awayTeam.record}</div>
            )}
          </div>
        </div>
        <div className={`col-span-2 flex flex-wrap justify-center items-center text-center text-5xl md:text-7xl font-black ${awayTeam.score < homeTeam.score && ['FINAL', 'OFF'].includes(gameState) ? 'opacity-50' : ''}`}>
          {situation?.awayTeam.situationDescriptions?.map((code) => (
            <span key={code} className="mx-1 text-lg rounded text-white bg-red-900 p-1 uppercase">{code}</span>
          ))}
          <span>{awayTeam.score}</span>
          {teamHasRecentGoal(awayTeam.abbrev, game) && (
            <Image src={SirenOnSVG} height="256" width="256" className="h-10 w-10 ml-2 animate-pulse" alt="Goal" />
          )}
        </div>
        <div className="col-span-2 text-center content-middle">
          {game.gameType === 1 && (
            <div className="text-xs my-1 p-1 border rounded font-bold uppercase">Preseason</div>
          )}
          {game.gameType === 3 && (
            <div className="text-xs my-1 p-1 border rounded font-bold uppercase">Stanley Cup Playoffs</div>
          )}
          <div className="text-xs my-1">{venue.default}, {venueLocation.default}</div>
          {(gameState === 'LIVE' || gameState === 'CRIT') && (
            <div className="my-3 flex flex-wrap justify-center">
              <span className="font-md font-medium px-2 py-1 bg-red-900 text-white rounded mr-2 uppercase text-nowrap">
                {formatPeriodLabel(periodDescriptor)}
                {clock.inIntermission ? ' INT' : ''}
              </span>
              {periodDescriptor.periodType !== 'SO' && (
                <span className="font-bold text-xl">
                  <GameClock timeRemaining={clock.timeRemaining} running={clock?.inIntermission || clock?.running} />
                  {!clock.inIntermission && !clock.running && (<FontAwesomeIcon icon={faPauseCircle} className="ml-1" />)}
                </span>
              )}
            </div>
          )}
          {(gameState === 'FINAL' || gameState === 'OFF') && (
            <div className="text-center my-2 uppercase">
              <span className="text-xs md:text-sm font-medium px-2 py-1 bg-slate-100 dark:text-black text-nowrap rounded">
              Final
                {periodDescriptor.periodType	!== 'REG' && `/${periodDescriptor.periodType}`}
              </span>
            </div>
          )}
          {['FUT', 'PRE'].includes(gameState) && (
            <div className="my-1">
              {gameScheduleState !== 'TBD' ? (
                <span className="text-xs md:text-sm font-medium px-2 py-1 bg-slate-100 text-black rounded uppercase text-nowrap">{formatLocalizedTime(startTimeUTC)}</span>
              ) : (
                <span className="text-xs md:text-sm font-medium px-2 py-1 bg-slate-100 text-black rounded uppercase text-nowrap">
                  {ifNecessary ? (
                    <span className="text-xs md:text-sm font-medium px-2 py-1 bg-slate-100 text-black rounded uppercase text-nowrap">(If Necessary)</span>
                  ) : (
                    <span className="text-xs md:text-sm font-medium px-2 py-1 bg-slate-100 text-black rounded uppercase text-nowrap">TBD</span>
                  )}
                </span>
              )}
            </div>
          )}
          {gameState === 'PRE' && (
            <div className="my-1 text-nowrap">
              <span className="text-sm font-medium px-2 py-1 bg-slate-900 text-white rounded uppercase"><FontAwesomeIcon icon={faClock} fixedWidth /> Pregame</span>
            </div>
          )}
          {gameScheduleState === 'CNCL' && (
            <div className="my-1 text-nowrap">
              <span className="text-sm font-medium px-2 py-1 bg-yellow-500 text-black rounded uppercase"><FontAwesomeIcon icon={faBan} fixedWidth /> Cancelled</span>
            </div>
          )}
          {gameScheduleState === 'PPD' && (
            <div className="my-1 text-nowrap">
              <span className="text-sm font-medium px-2 py-1 bg-yellow-500 text-black rounded uppercase"><FontAwesomeIcon icon={faWarning} fixedWidth /> Postponed</span>
            </div>
          )}
          {(situation && (situation.awayTeam.strength !== 5 || situation?.homeTeam.strength) !== 5) && (
            <div className="my-2">
              {situation?.timeRemaining && (
                <div>
                  <span className="text-sm font-medium px-2 py-1 border text-slate-900 dark:text-slate-100 rounded">
                    <GameClock timeRemaining={situation?.timeRemaining} running={clock?.running && !clock?.inIntermission} />
                  </span>
                </div>
              )}
              <span className="text-sm md:text-sm font-bold px-2 py-1 text-red-900 rounded uppercase text-nowrap">
                {situation?.awayTeam.strength}-on-{situation?.homeTeam.strength}
              </span>
            </div>
          )}
          {!['LIVE', 'CRIT'].includes(gameState) && (
            <div className="text-xs my-2">
              <div>{formatLocalizedDate(startTimeUTC, 'MMMM D, YYYY')}</div>
            </div>
          )}
        </div>
        <div className={`col-span-2 flex flex-wrap justify-center items-center text-center text-5xl md:text-7xl font-black ${awayTeam.score > homeTeam.score && ['FINAL', 'OFF'].includes(gameState) ? 'opacity-50' : ''}`}>
          {teamHasRecentGoal(homeTeam.abbrev, game) && (
            <Image src={SirenOnSVG} height="256" width="256" className="h-10 w-10 mr-2 animate-pulse" alt="Goal" />
          )}
          <span>{homeTeam.score}</span>
          {situation?.homeTeam.situationDescriptions?.map((code) => (
            <span key={code} className="mx-2 text-lg rounded text-white bg-red-900 p-1 uppercase">{code}</span>
          ))}
        </div>
        <div className="col-span-3 flex flex-wrap mx-auto gap-2 items-center justify-center">
          <div className="text-right order-2 sm:order-1">
            <Link href={`/team/${homeTeam.abbrev}`}>
              <div className="text-xl font-black block md:hidden">{homeTeam.abbrev}</div>
              <div className="text-lg hidden md:block">
                <div className="text-sm">{homeTeam.placeName.default}</div>
                <div className="text-xl font-black">{homeTeam.commonName.default.replace(homeTeam.placeName.default, '')}</div>
              </div>
            </Link>
            {gameState !== 'FUT' ? (
              <div className="text-sm">SOG: {homeTeam.sog || 0}</div>
            ) : (
              <div className="text-sm">{homeTeam.record}</div>
            )}
          </div>
          <div className="text-right order-1 sm:order-2">
            <TeamLogo
              team={homeTeam.abbrev}
              src={homeTeam.logo}
              alt={homeTeam.commonName.default}
              className="w-20 h-20 mx-auto"
            />
          </div>
        </div>
      </div>
    </>
  );
};

GameHeader.propTypes = {
  game: PropTypes.object.isRequired,
};

export default GameHeader;
