import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faWarning } from '@fortawesome/free-solid-svg-icons';
import { formatBroadcasts, formatLocalizedTime, formatLocalizedDate } from '../utils/formatters';
import TeamLogo from './TeamLogo';
import { PropTypes } from 'prop-types';

const GameTile = ({game}) => {

  game.awayTeam.defeated = game.awayTeam.score < game.homeTeam.score && ['FINAL', 'OFF'].includes(game.gameState);
  game.homeTeam.defeated = game.homeTeam.score < game.awayTeam.score && ['FINAL', 'OFF'].includes(game.gameState);

  return (
    <Link
      href={`/game/${game.id}`}
      key={game.id} 
      className={`border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow ${game.gameScheduleState === 'CNCL' ? 'opacity-40' : ''}`}
    >
      <div className="flex justify-between items-center mb-4">
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
          {(game.gameState === 'LIVE' || game.gameState === 'CRIT') && (
            <span className="text-sm font-medium px-2 py-1 bg-red-900 text-white rounded mr-1">LIVE</span>
          )}         
        </div>
        {game.gameState === 'FUT' && (
          <div className="text-sm text-right text-slate-600">
            {formatBroadcasts(game.tvBroadcasts)}
          </div>
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
          <span className="text-lg font-semibold">
            {game.gameState !== 'FUT' ? game.awayTeam.score : ''}
          </span>
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
          <span className="text-lg font-semibold">
            {game.homeTeam.score}
          </span>
        </div>
      </div>

      <div className="mt-2 pt-3 border-t">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">{game.venue.default}</span>
          {(game.gameState === 'FINAL' || game.gameState === 'OFF') && (
            <div>
              <span className="text-sm mr-2">{formatLocalizedDate(game.gameDate)}</span>
              <span className="text-sm font-medium px-2 py-1 bg-slate-100 dark:text-black rounded">
                FINAL{(game.gameOutcome?.lastPeriodType !== 'REG' && game.periodDescriptor?.periodType !== 'REG') ? `/${game.gameOutcome?.lastPeriodType ?? game.periodDescriptor?.periodType}` : ''}
              </span>
            </div>
          )}
          {(game.gameState === 'LIVE' || game.gameState === 'CRIT' && (
            <span className="text-sm font-medium px-2 py-1 bg-red-900 text-white rounded">
              {game.periodDescriptor?.number}
              {game.clock?.inIntermission ? ' INT' : ''}
              {' '}
              {game.clock?.timeRemaining}
            </span>
          ))}
          {game.gameState === 'FUT' && (
            <span className="text-sm">
              {formatLocalizedTime(game.startTimeUTC)}
              {' '}
              {formatLocalizedDate(game.gameDate)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

GameTile.propTypes = {
  game: PropTypes.object.isRequired,
};

export default GameTile;
