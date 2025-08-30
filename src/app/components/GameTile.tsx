'use client';

import React from 'react';
import type { PeriodDescriptor } from '@/app/types/game';
import type { TeamSide } from '@/app/types/team';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faWarning } from '@fortawesome/free-solid-svg-icons';
import {
  formatLocalizedTime,
  formatLocalizedDate,
  formatPeriodLabel,
} from '@/app/utils/formatters';
import TeamLogo from '@/app/components/TeamLogo';

interface SeriesStatus {
  topSeedWins: number;
  bottomSeedWins: number;
  topSeedTeamAbbrev: string;
  bottomSeedTeamAbbrev: string;
  seriesAbbrev?: string;
  game?: number;
  gameNumberOfSeries?: number;
}

interface GameOutcome {
  lastPeriodType?: string;
}
interface GameClock {
  timeRemaining?: string;
  inIntermission?: boolean;
}

interface Venue {
  default: string;
}

interface GameTileGame {
  id: string | number;
  awayTeam: TeamSide;
  homeTeam: TeamSide;
  gameState: string;
  gameScheduleState?: string;
  gameType: number;
  startTimeUTC: string;
  venue: Venue;
  ifNecessary?: boolean;
  seriesStatus?: SeriesStatus;
  gameOutcome?: GameOutcome;
  periodDescriptor?: PeriodDescriptor | string;
  clock?: GameClock;
  situation?: {
    awayTeam?: { situationDescriptions?: string[] };
    homeTeam?: { situationDescriptions?: string[] };
  };
}

interface GameTileProps {
  game: GameTileGame;
  logos?: Record<string | number, string>;
  hideDate?: boolean;
  style?: React.CSSProperties;
}

const GameTile = ({ game, logos = {}, hideDate = false, style }: GameTileProps) => {
  const awayScore = game.awayTeam.score ?? 0;
  const homeScore = game.homeTeam.score ?? 0;
  game.awayTeam.defeated = awayScore < homeScore && ['FINAL', 'OFF'].includes(game.gameState);
  game.homeTeam.defeated = homeScore < awayScore && ['FINAL', 'OFF'].includes(game.gameState);

  let playoffSeriesStatus = '';
  if (game.seriesStatus && game.gameType === 3) {
    if (game.seriesStatus.topSeedWins === game.seriesStatus.bottomSeedWins) {
      playoffSeriesStatus = `TIED ${game.seriesStatus.bottomSeedWins}-${game.seriesStatus.topSeedWins}`;
    }
    if (
      game.seriesStatus.topSeedWins > game.seriesStatus.bottomSeedWins &&
      game.seriesStatus.topSeedWins < 4
    ) {
      playoffSeriesStatus = `${game.seriesStatus.topSeedTeamAbbrev} ${game.seriesStatus.topSeedWins}-${game.seriesStatus.bottomSeedWins}`;
    }
    if (
      game.seriesStatus.topSeedWins < game.seriesStatus.bottomSeedWins &&
      game.seriesStatus.bottomSeedWins < 4
    ) {
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
        <div
          className={`flex items-center justify-between ${game.awayTeam.defeated ? 'opacity-50' : ''}`}
        >
          <div className="flex items-center">
            <TeamLogo
              team={game.awayTeam.abbrev}
              noLink={true}
              src={
                game.awayTeam.logo ||
                (game.awayTeam.id !== undefined ? logos[game.awayTeam.id] : undefined)
              }
              alt={`${game.awayTeam.placeName?.default || game.awayTeam.abbrev} logo`}
              className="hidden lg:block w-8 h-8 mr-3"
            />
            <div>
              <span className="font-light">
                {game.awayTeam.placeNameWithPreposition?.default ||
                  game.awayTeam.placeName?.default}
              </span>{' '}
              <span className="font-bold">
                {game.awayTeam.commonName?.default &&
                game.awayTeam.placeNameWithPreposition?.default
                  ? game.awayTeam.commonName.default.replace(
                      game.awayTeam.placeNameWithPreposition.default,
                      ''
                    )
                  : game.awayTeam.commonName?.default || game.awayTeam.name?.default}
              </span>
              {game.situation?.awayTeam?.situationDescriptions?.map((situation, i) => (
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
        <div
          className={`flex items-center justify-between ${game.homeTeam.defeated ? 'opacity-50' : ''}`}
        >
          <div className="flex items-center">
            <TeamLogo
              team={game.homeTeam.abbrev}
              noLink={true}
              src={
                game.homeTeam.logo ||
                (game.homeTeam.id !== undefined ? logos[game.homeTeam.id] : undefined)
              }
              alt={`${game.homeTeam.placeName?.default || game.homeTeam.abbrev} logo`}
              className="hidden lg:block w-8 h-8 mr-3"
            />
            <div>
              <span className="font-light">
                {game.homeTeam.placeNameWithPreposition?.default ||
                  game.homeTeam.placeName?.default}
              </span>{' '}
              <span className="font-bold">
                {game.homeTeam.commonName?.default &&
                game.homeTeam.placeNameWithPreposition?.default
                  ? game.homeTeam.commonName.default.replace(
                      game.homeTeam.placeNameWithPreposition.default,
                      ''
                    )
                  : game.homeTeam.commonName?.default || game.homeTeam.name?.default}
              </span>
              {game.situation?.homeTeam?.situationDescriptions?.map((situation, i) => (
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
          {['CNCL', 'PPD'].includes(game.gameScheduleState || '') ? (
            <div className="text-sm">
              {game.gameScheduleState === 'CNCL' && (
                <span className="text-sm font-medium px-2 py-1 bg-slate-900 text-white rounded mr-1 uppercase">
                  <FontAwesomeIcon icon={faBan} fixedWidth /> Cancelled
                </span>
              )}
              {game.gameScheduleState === 'PPD' && (
                <span className="text-sm font-medium px-2 py-1 bg-yellow-500 text-black rounded mr-1 uppercase">
                  <FontAwesomeIcon icon={faWarning} fixedWidth /> Postponed
                </span>
              )}
            </div>
          ) : (
            <>
              {game.gameType === 1 && (
                <span className="text-xs font-medium p-1 uppercase">Preseason</span>
              )}
              <span
                className="text-xs text-slate-600 line-clamp-1 text-ellipsis"
                style={{ maxWidth: '230px' }}
              >
                {game.seriesStatus?.seriesAbbrev && (
                  <span>
                    {game.seriesStatus.seriesAbbrev}/GM{' '}
                    {game.seriesStatus.game || game.seriesStatus.gameNumberOfSeries} |{' '}
                    {playoffSeriesStatus} |{' '}
                  </span>
                )}
                {game.venue.default}
              </span>
            </>
          )}
          {(game.gameState === 'FINAL' || game.gameState === 'OFF') && (
            <div>
              <span className="text-sm mr-2" suppressHydrationWarning>
                {hideDate ? null : formatLocalizedDate(game.startTimeUTC)}
              </span>
              <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:text-black rounded text-nowrap">
                {(() => {
                  const pd = game.periodDescriptor;
                  const periodType = typeof pd === 'string' ? pd : pd?.periodType;

                  return (
                    <>
                      FINAL
                      {game.gameOutcome?.lastPeriodType !== 'REG' && periodType !== 'REG'
                        ? `/${game.gameOutcome?.lastPeriodType ?? periodType}`
                        : ''}
                    </>
                  );
                })()}
              </span>
            </div>
          )}
          {(game.gameState === 'LIVE' || game.gameState === 'CRIT') && (
            <span>
              <span className="text-xs font-medium px-2 py-1 bg-red-900 text-white rounded uppercase mr-2">
                {formatPeriodLabel(game.periodDescriptor)}
                {game.clock?.inIntermission ? ' INT' : ''}
              </span>
              {game.periodDescriptor !== 'SO' && (
                <span className="text-sm font-bold">{game.clock?.timeRemaining}</span>
              )}
            </span>
          )}
          {['FUT', 'PRE'].includes(game.gameState) && (
            <span
              className={`p-1 text-xs ${game.gameState === 'PRE' ? 'bg-red-900 rounded text-white' : ''}`}
            >
              {game.gameScheduleState !== 'TBD' ? (
                <span suppressHydrationWarning>{formatLocalizedTime(game.startTimeUTC)}</span>
              ) : (
                'TBD'
              )}{' '}
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

export default GameTile;
