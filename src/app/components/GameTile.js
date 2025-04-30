'use client';

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faWarning } from '@fortawesome/free-solid-svg-icons';
import { PropTypes } from 'prop-types';
import { formatLocalizedTime, formatLocalizedDate, formatPeriodLabel } from '@/app/utils/formatters';
import TeamLogo from '@/app/components/TeamLogo';

const GameTile = ({game, logos, hideDate, style}) => {
  game.awayTeam.defeated = game.awayTeam.score < game.homeTeam.score && ['FINAL', 'OFF'].includes(game.gameState);
  game.homeTeam.defeated = game.homeTeam.score < game.awayTeam.score && ['FINAL', 'OFF'].includes(game.gameState);

  let playoffSeriesStatus = '';
  if (game.seriesStatus && game.gameType === 3) {
    if (game.seriesStatus.topSeedWins === game.seriesStatus.bottomSeedWins) {
      playoffSeriesStatus = `TIED ${game.seriesStatus.bottomSeedWins}-${game.seriesStatus.topSeedWins}`;
    }
    if (game.seriesStatus.topSeedWins > game.seriesStatus.bottomSeedWins && game.seriesStatus.topSeedWins < 4) {
      playoffSeriesStatus = `${game.seriesStatus.topSeedTeamAbbrev} ${game.seriesStatus.topSeedWins}-${game.seriesStatus.bottomSeedWins}`;
    }
    if (game.seriesStatus.topSeedWins < game.seriesStatus.bottomSeedWins && game.seriesStatus.bottomSeedWins < 4) {
      playoffSeriesStatus = `${game.seriesStatus.bottomSeedTeamAbbrev} ${game.seriesStatus.bottomSeedWins}-${game.seriesStatus.topSeedWins}`;
    }
    if (game.seriesStatus.topSeedWins === 4) {
      playoffSeriesStatus = `${game.seriesStatus.topSeedTeamAbbrev} WINS ${game.seriesStatus.topSeedWins}-${game.seriesStatus.bottomSeedWins}`;
    }
    if (game.seriesStatus.bottomSeedWins === 4) {
      playoffSeriesStatus = `${game.seriesStatus.bottomSeedTeamAbbrev} WINS ${game.seriesStatus.bottomSeedWins}-${game.seriesStatus.topSeedWins}`;
    }
  }

  return (
    <Link
      href={`/game/${game.id}`}
      key={game.id}
      className={`border rounded-lg shadow-sm p-2 hover:shadow-md transition-shadow ${game.gameScheduleState === 'CNCL' ? 'opacity-40' : ''} ${game.gameState === 'CRIT' ? 'border-red-900' : ''}`}
      style={style}
    >
      <div className="">
        {/* Away Team */}
        <div className={`flex items-center justify-between ${game.awayTeam.defeated ? 'opacity-50' : ''}`}>
          <div className="flex items-center">
            <TeamLogo
              team={game.awayTeam.abbrev}
              noLink={true}
              src={game.awayTeam.logo || logos[game.awayTeam.id]}
              alt={`${game.awayTeam.placeName?.default} logo`}
              className="hidden lg:block w-8 h-8 mr-3"
            />
            <div>
              <span className="font-light">{game.awayTeam.placeNameWithPreposition?.default || game.awayTeam.placeName?.default}</span>{' '}
              <span className="font-bold">{game.awayTeam.commonName?.default.replace(game.awayTeam.placeNameWithPreposition?.default, '') || game.awayTeam.name?.default}</span>
              {game.situation?.awayTeam.situationDescriptions?.map((situation, i) => (
                <span key={i} className="text-xs font-bold bg-red-900 text-white p-1 rounded ms-1">
                  {situation}
                </span>
              ))}
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
              team={game.homeTeam.abbrev}
              noLink={true}
              src={game.homeTeam.logo || logos[game.homeTeam.id]}
              alt={`${game.homeTeam.placeName?.default} logo`}
              className="hidden lg:block w-8 h-8 mr-3"
            />
            <div>
              <span className="font-light">{game.homeTeam.placeNameWithPreposition?.default || game.homeTeam.placeName?.default}</span>{' '}
              <span className="font-bold">{game.homeTeam.commonName?.default.replace(game.homeTeam.placeNameWithPreposition?.default, '') || game.homeTeam.name?.default}</span>
              {game.situation?.homeTeam.situationDescriptions?.map((situation, i) => (
                <span key={i} className="text-xs font-bold bg-red-900 text-white p-1 rounded mx-1">
                  {situation}
                </span>
              ))}
            </div>
          </div>
          {game.gameState !== 'FUT' ? (
            <span className="text-lg font-semibold">{game.homeTeam.score}</span>
          ) : (
            <span className="text-sm font-light">{game.homeTeam.record}</span>
          )}
        </div>
      </div>

      <div className="mt-1 pt-1 border-t">
        <div className="flex flex-wrap justify-between items-center">
          {(['CNCL', 'PPD'].includes(game.gameScheduleState) || game.gameType === 1) ? (
            <div className="text-sm">
              {game.gameScheduleState === 'CNCL' && (
                <span className="text-sm font-medium px-2 py-1 bg-slate-900 text-white rounded mr-1 uppercase"><FontAwesomeIcon icon={faBan} fixedWidth /> Cancelled</span>
              )}
              {game.gameScheduleState === 'PPD' && (
                <span className="text-sm font-medium px-2 py-1 bg-yellow-500 text-black rounded mr-1 uppercase"><FontAwesomeIcon icon={faWarning} fixedWidth /> Postponed</span>
              )}
            </div>
          ) : (
            <>
              <span className="text-xs text-slate-600">
                {game.seriesStatus?.seriesAbbrev && (
                  <span>{game.seriesStatus.seriesAbbrev}/GM {game.seriesStatus.game || game.seriesStatus.gameNumberOfSeries} | {playoffSeriesStatus} | </span>
                )}
                {game.venue.default}
              </span>
              {game.gameType === 1 && (
                <span className="text-sm font-medium px-2 py-1 bg-slate-100 dark:text-black rounded mr-1 uppercase">Preseason</span>
              )}
            </>
          )}
          {(game.gameState === 'FINAL' || game.gameState === 'OFF') && (
            <div>
              <span className="text-sm mr-2" suppressHydrationWarning>{hideDate ? null : formatLocalizedDate(game.startTimeUTC)}</span>
              <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:text-black rounded text-nowrap">
                FINAL{(game.gameOutcome?.lastPeriodType !== 'REG' && game.periodDescriptor?.periodType !== 'REG') ? `/${game.gameOutcome?.lastPeriodType ?? game.periodDescriptor?.periodType}` : ''}
              </span>
            </div>
          )}
          {(game.gameState === 'LIVE' || game.gameState === 'CRIT') && (
            <span>
              <span className="text-xs font-medium px-2 py-1 bg-red-900 text-white rounded uppercase mr-2">
                {formatPeriodLabel(game.periodDescriptor)}{game.clock?.inIntermission ? ' INT' : ''}
              </span>
              {game.periodDescriptor !== 'SO' && (
                <span className="text-sm font-bold">
                  {game.clock?.timeRemaining}
                </span>
              )}
            </span>
          )}
          {['FUT', 'PRE'].includes(game.gameState) && (
            <span className={`p-1 text-xs ${game.gameState === 'PRE' ? 'bg-red-900 rounded text-white' : '' }`}>
              {game.gameScheduleState !== 'TBD' && (
                <span suppressHydrationWarning>{formatLocalizedTime(game.startTimeUTC)}</span>
              )}
              {' '}
              {hideDate ? null : formatLocalizedDate(game.startTimeUTC)}
              {game.gameType === 3 && game.ifNecessary && (
                <span>
                  {' '}
                  <span className="font-bold">(If Necessary)</span>
                </span>
              )}
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
  logos: PropTypes.object,
};

GameTile.defaultProps = {
  hideDate: false,
  style: {},
};

export default GameTile;
