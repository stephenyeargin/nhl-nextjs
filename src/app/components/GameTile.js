'use client';

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faWarning } from '@fortawesome/free-solid-svg-icons';
import { PropTypes } from 'prop-types';
import { formatLocalizedTime, formatLocalizedDate, formatPeriodLabel } from '@/app/utils/formatters';
import TeamLogo from '@/app/components/TeamLogo';

const GameTile = ({game, hideDate, style}) => {
  game.awayTeam.defeated = game.awayTeam.score < game.homeTeam.score && ['FINAL', 'OFF'].includes(game.gameState);
  game.homeTeam.defeated = game.homeTeam.score < game.awayTeam.score && ['FINAL', 'OFF'].includes(game.gameState);

  return (
    <Link
      href={`/game/${game.id}`}
      key={game.id} 
      className={`border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow ${game.gameScheduleState === 'CNCL' ? 'opacity-40' : ''} ${game.gameState === 'CRIT' ? 'border-red-900' : ''}`}
      style={style}
    >
      <div className="text-lg">
        {game.gameType === 1 && (
          <span className="text-sm font-medium px-2 py-1 bg-slate-100 dark:text-black rounded mr-1 uppercase">Preseason</span>
        )}
        {game.gameScheduleState === 'CNCL' && (
          <span className="text-sm font-medium px-2 py-1 bg-slate-900 text-white rounded mr-1 uppercase"><FontAwesomeIcon icon={faBan} fixedWidth /> Cancelled</span>
        )}
        {game.gameScheduleState === 'PPD' && (
          <span className="text-sm font-medium px-2 py-1 bg-yellow-500 text-black rounded mr-1 uppercase"><FontAwesomeIcon icon={faWarning} fixedWidth /> Postponed</span>
        )} 
      </div>

      <div className="space-y-2">
        {/* Away Team */}
        <div className={`flex items-center justify-between ${game.awayTeam.defeated ? 'opacity-50' : ''}`}>
          <div className="flex items-center">
            <TeamLogo 
              src={game.awayTeam.logo} 
              alt={`${game.awayTeam.placeName?.default} logo`}
              className="w-8 h-8 mr-3"
            />
            <div>
              <span className="font-light">{game.awayTeam.placeNameWithPreposition?.default}</span>{' '}
              <span className="font-bold">{game.awayTeam.commonName?.default.replace(game.awayTeam.placeNameWithPreposition?.default, '')}</span>
            </div>
          </div>
          {game.gameState !== 'FUT' ? (
            <span className="text-lg font-semibold">{game.awayTeam.score}</span>
          ) : (
            <span className="text-sm font-light">{game.awayTeam.record}</span>
          )}
        </div>

        {/* Home Team */}
        <div className={`flex items-center justify-between ${game.homeTeam.defeated ? 'opacity-50' : ''}`}>
          <div className="flex items-center">
            <TeamLogo 
              src={game.homeTeam.logo} 
              alt={`${game.homeTeam.placeName?.default} logo`}
              className="w-8 h-8 mr-3"
            />
            <div>
              <span className="font-light">{game.homeTeam.placeNameWithPreposition?.default}</span>{' '}
              <span className="font-bold">{game.homeTeam.commonName?.default.replace(game.homeTeam.placeNameWithPreposition?.default, '')}</span>
            </div>
          </div>
          {game.gameState !== 'FUT' ? (
            <span className="text-lg font-semibold">{game.homeTeam.score}</span>
          ) : (
            <span className="text-sm font-light">{game.homeTeam.record}</span>
          )}
        </div>
      </div>

      <div className="mt-2 pt-3 border-t">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">{game.venue.default}</span>
          {(game.gameState === 'FINAL' || game.gameState === 'OFF') && (
            <div>
              <span className="text-sm mr-2" suppressHydrationWarning>{hideDate ? null : formatLocalizedDate(game.startTimeUTC)}</span>
              <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:text-black rounded">
                FINAL{(game.gameOutcome?.lastPeriodType !== 'REG' && game.periodDescriptor?.periodType !== 'REG') ? `/${game.gameOutcome?.lastPeriodType ?? game.periodDescriptor?.periodType}` : ''}
              </span>
            </div>
          )}
          {(game.gameState === 'LIVE' || game.gameState === 'CRIT') && (
            <span>
              <span className="text-xs font-medium px-2 py-1 bg-red-900 text-white rounded uppercase mr-2">
                {formatPeriodLabel(game.periodDescriptor)}{game.clock?.inIntermission ? ' INT' : ''}
              </span>
              <span className="text-sm font-bold">
                {game.clock?.timeRemaining}
              </span>
            </span>
          )}
          {game.gameState === 'FUT' && (
            <span className="p-1 text-xs">
              <span suppressHydrationWarning>{formatLocalizedTime(game.startTimeUTC)}</span>
              {' '}
              {hideDate ? null : formatLocalizedDate(game.startTimeUTC)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

GameTile.propTypes = {
  game: PropTypes.object.isRequired,
  hideDate: PropTypes.bool,
  style: PropTypes.object,
};

GameTile.defaultProps = {
  hideDate: false,
  style: {},
};

export default GameTile;
