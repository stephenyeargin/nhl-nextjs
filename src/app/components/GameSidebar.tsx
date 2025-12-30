'use client';

import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useGameContext } from '../contexts/GameContext';
import Scoreboard from './Scoreboard';
import TeamLogo from './TeamLogo';
import { getTeamDataByAbbreviation } from '../utils/teamData';
import {
  GAME_STATES,
  GAME_REPORT_NAMES,
  NHL_BRIGHTCOVE_ACCOUNT,
  STAT_CONTEXT,
} from '../utils/constants';
import {
  formatSeriesStatus,
  formatLocalizedTime,
  formatPeriodLabel,
  formatSeason,
} from '../utils/formatters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faPlayCircle, faWarning } from '@fortawesome/free-solid-svg-icons';
import GameSidebarSkeleton from './GameSidebarSkeleton';
import StatComparisonRow from './StatComparisonRow';
import FloatingVideoPlayer from './FloatingVideoPlayer';

interface SimpleGame {
  gameState: string;
  periodDescriptor?: any;
  clock?: any;
}
const gameIsInProgress = (game: SimpleGame) => {
  const state = GAME_STATES[game.gameState as keyof typeof GAME_STATES];

  return [GAME_STATES.PRE, GAME_STATES.LIVE, GAME_STATES.CRIT].includes(state);
};

interface SimplePlayer {
  id: string | number;
  firstName?: { default?: string };
  lastName?: { default?: string };
}
const renderPlayer = (player: SimplePlayer) => (
  <Link href={`/player/${player.id}`}>
    {player.firstName?.default} {player.lastName?.default}
  </Link>
);

const GameSidebar = () => {
  const [videoPlayerLabel, setVideoPlayerLabel] = useState<string | null>(null);
  const [videoPlayerUrl, setVideoPlayerUrl] = useState<string | null>(null);
  const [isVideoPlayerVisible, setVideoPlayerVisible] = useState<boolean>(false);

  const { gameData } = useGameContext();

  // Hide the video player if escape key pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setVideoPlayerVisible(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (
    !gameData ||
    !gameData.homeTeam ||
    !gameData.awayTeam ||
    !gameData.game ||
    !gameData.rightRail ||
    !gameData.story
  ) {
    return <GameSidebarSkeleton />;
  }

  // Destructure data for rendering
  const { homeTeam, awayTeam, game, rightRail, story } = gameData;
  const { gameVideo } = rightRail;

  // Enrich team objects (mutating like original implementation to preserve downstream expectations)
  homeTeam.data = getTeamDataByAbbreviation(game.homeTeam.abbrev, true) || {
    teamColor: '#999',
    secondaryTeamColor: '#000',
  };
  awayTeam.data = getTeamDataByAbbreviation(game.awayTeam.abbrev, false) || {
    teamColor: '#999',
    secondaryTeamColor: '#000',
  };

  // Logos map
  const logos: Record<string, string> = {
    [homeTeam.abbrev as string]: homeTeam.logo as string,
    [awayTeam.abbrev as string]: awayTeam.logo as string,
  };

  // Flatten game stats for quick lookup
  const gameStats: Record<string, { awayValue: number | string; homeValue: number | string }> = {};
  story.summary?.teamGameStats?.forEach(
    (s: { category?: string; awayValue?: number | string; homeValue?: number | string }) => {
      if (s?.category && s.awayValue !== undefined && s.homeValue !== undefined) {
        gameStats[s.category] = { awayValue: s.awayValue, homeValue: s.homeValue };
      }
    }
  );

  const gameStatRows = [
    { stat: 'sog' },
    { stat: 'faceoffWinningPctg' },
    { stat: 'powerPlayPctg', rank: 'powerPlay' },
    { stat: 'pim' },
    { stat: 'hits' },
    { stat: 'blockedShots' },
    { stat: 'giveaways' },
    { stat: 'takeaways' },
  ];

  const seasonStatRows = [
    { stat: 'ppPctg' },
    { stat: 'pkPctg' },
    { stat: 'faceoffWinningPctg' },
    { stat: 'goalsForPerGamePlayed' },
    { stat: 'goalsAgainstPerGamePlayed' },
  ];

  const handleOpenVideo = (videoId: string | undefined, label: string) => {
    if (!videoId) {
      return;
    }
    setVideoPlayerUrl(
      `https://players.brightcove.net/${NHL_BRIGHTCOVE_ACCOUNT}/default_default/index.html?videoId=${videoId}`
    );
    setVideoPlayerLabel(label);
    setVideoPlayerVisible(true);
  };

  const handleVideoPlayerClose = () => {
    setVideoPlayerVisible(false);
    setVideoPlayerLabel(null);
    setVideoPlayerUrl(null);
  };

  if (homeTeam.abbrev === 'TBD' || awayTeam.abbrev === 'TBD') {
    return <></>;
  }

  return (
    <div>
      {(gameVideo?.threeMinRecap || gameVideo?.condensedGame) && (
        <div className="flex justify-items-end gap-2 mb-3">
          {gameVideo?.threeMinRecap && (
            <button
              onClick={() => handleOpenVideo(gameVideo.threeMinRecap, 'Recap')}
              className="block p-1 rounded text-sm flex-1 text-center bg-blue-900 text-white font-bold hover:shadow hover:bg-blue-600"
            >
              <FontAwesomeIcon icon={faPlayCircle} fixedWidth /> Recap
            </button>
          )}
          {gameVideo?.condensedGame && (
            <button
              onClick={() => handleOpenVideo(gameVideo.condensedGame, 'Condensed Game')}
              className="block p-1 rounded text-sm flex-1 text-center bg-blue-900 text-white font-bold hover:shadow hover:bg-blue-600"
            >
              <FontAwesomeIcon icon={faPlayCircle} fixedWidth /> Condensed Game
            </button>
          )}
        </div>
      )}

      {rightRail.linescore?.byPeriod && rightRail.linescore?.totals && game.periodDescriptor && (
        <div className="mb-5">
          <Scoreboard game={game as any} linescore={rightRail.linescore as any} />
        </div>
      )}
      {rightRail.shotsByPeriod && (
        <div className="mb-5">
          <div className="flex text-center items-center">
            <div className="w-1/4 p-2 text-bold flex justify-center">
              <TeamLogo
                src={logos[awayTeam.abbrev]}
                team={awayTeam.abbrev}
                alt={awayTeam.abbrev}
                className="h-12 w-12"
              />
            </div>
            <div className="w-1/2 p-2 text-2xl font-bold">Shots</div>
            <div className="w-1/4 p-2 text-bold flex justify-center">
              <TeamLogo
                src={logos[homeTeam.abbrev]}
                team={homeTeam.abbrev}
                alt={homeTeam.abbrev}
                className="h-12 w-12"
              />
            </div>
          </div>
          {rightRail.shotsByPeriod.map((period: any, index: number) => (
            <div key={index} className={`flex text-center ${index % 2 ? '' : 'bg-slate-500/10'}`}>
              <div className="w-1/4 p-2">{period.away}</div>
              <div className="w-1/2 p-3 text-xs">
                {formatPeriodLabel({
                  ...game.periodDescriptor,
                  number: period.periodDescriptor?.number,
                })}
              </div>
              <div className="w-1/4 p-2">{period.home}</div>
            </div>
          ))}
        </div>
      )}
      {story.summary?.teamGameStats && (
        <div className="mb-5">
          <div>
            <div className="flex text-center items-center justify-between">
              <div className="w-1/4 p-2 text-bold flex justify-center">
                <TeamLogo
                  src={logos[awayTeam.abbrev]}
                  team={awayTeam.abbrev}
                  alt={awayTeam.abbrev}
                  className="h-12 w-12"
                />
              </div>
              <div className="w-1/2 p-2 text-2xl font-bold">Game Stats</div>
              <div className="w-1/4 p-2 text-bold flex justify-center">
                <TeamLogo
                  src={logos[homeTeam.abbrev]}
                  team={homeTeam.abbrev}
                  alt={homeTeam.abbrev}
                  className="h-12 w-12"
                />
              </div>
            </div>
            {gameStatRows.map(({ stat, rank }) => (
              <StatComparisonRow
                key={stat}
                awayStat={
                  typeof gameStats?.[stat]?.awayValue === 'number'
                    ? gameStats[stat].awayValue
                    : Number(gameStats?.[stat]?.awayValue) || 0
                }
                homeStat={
                  typeof gameStats?.[stat]?.homeValue === 'number'
                    ? gameStats[stat].homeValue
                    : Number(gameStats?.[stat]?.homeValue) || 0
                }
                awayStatRank={
                  rank && gameStats?.[rank]?.awayValue ? gameStats[rank].awayValue : undefined
                }
                homeStatRank={
                  rank && gameStats?.[rank]?.homeValue ? gameStats[rank].homeValue : undefined
                }
                awayTeam={awayTeam as any}
                homeTeam={homeTeam as any}
                stat={stat as any}
              />
            ))}
          </div>
        </div>
      )}
      {rightRail.teamSeasonStats?.awayTeam && rightRail.teamSeasonStats?.homeTeam && (
        <div className="mb-5">
          <div className="flex text-center items-center justify-between">
            <div className="w-1/4 p-2 text-bold flex justify-center">
              <TeamLogo src={logos[awayTeam.abbrev]} alt={awayTeam.abbrev} className="h-12 w-12" />
            </div>
            <div className="w-1/2 p-3">
              <div className="text-2xl font-bold">Season Stats</div>
              {rightRail.teamSeasonStats?.contextLabel && (
                <div className="text-xs text-center text-gray-500">
                  {formatSeason(rightRail.teamSeasonStats?.contextSeason)}{' '}
                  {
                    STAT_CONTEXT[
                      rightRail.teamSeasonStats?.contextLabel as keyof typeof STAT_CONTEXT
                    ]
                  }
                </div>
              )}
            </div>
            <div className="w-1/4 p-2 text-bold flex justify-center">
              <TeamLogo src={logos[homeTeam.abbrev]} alt={homeTeam.abbrev} className="h-12 w-12" />
            </div>
          </div>

          {(() => {
            const seasonStats = rightRail.teamSeasonStats; // already truthy due to outer conditional
            const awaySeason: any = seasonStats.awayTeam;
            const homeSeason: any = seasonStats.homeTeam;

            return seasonStatRows.map(({ stat }) => (
              <StatComparisonRow
                key={stat}
                awayStat={awaySeason?.[stat] || 0}
                homeStat={homeSeason?.[stat] || 0}
                awayStatRank={awaySeason?.[`${stat}Rank`]}
                homeStatRank={homeSeason?.[`${stat}Rank`]}
                awayTeam={awayTeam as any}
                homeTeam={homeTeam as any}
                stat={stat as any}
              />
            ));
          })()}
        </div>
      )}

      {rightRail.last10Record?.awayTeam && rightRail.last10Record?.homeTeam && (
        <div className="mb-5">
          <div className="flex text-center items-center justify-between">
            <div className="w-1/4 p-2 text-bold flex justify-center">
              <TeamLogo src={logos[awayTeam.abbrev]} alt={awayTeam.abbrev} className="h-12 w-12" />
            </div>
            <div className="w-1/2 p-2 text-2xl font-bold">Last 10 Games</div>
            <div className="w-1/4 p-2 text-bold flex justify-center">
              <TeamLogo src={logos[homeTeam.abbrev]} alt={homeTeam.abbrev} className="h-12 w-12" />
            </div>
          </div>
          <div className="flex text-center">
            <div className="w-1/2">
              {rightRail.last10Record.awayTeam?.record} (
              {rightRail.last10Record.awayTeam?.streakType}
              {rightRail.last10Record.awayTeam?.streak})
            </div>
            <div className="w-1/2">
              {rightRail.last10Record.homeTeam?.record} (
              {rightRail.last10Record.homeTeam?.streakType}
              {rightRail.last10Record.homeTeam?.streak})
            </div>
          </div>
          {rightRail.last10Record?.awayTeam?.pastGameResults?.map((_g: any, i: number) => (
            <div
              key={i}
              className={`flex text-center text-xs my-1 gap-1 ${i % 2 ? '' : 'bg-slate-500/10'}`}
            >
              <div
                className={`p-2 w-1/2 ${['W', 'OTW', 'SOW'].includes(rightRail.last10Record?.awayTeam?.pastGameResults?.[i]?.gameResult || '') ? 'font-bold' : 'opacity-50'}`}
                style={{ borderWidth: '1pt', borderColor: awayTeam.data?.teamColor || '#000' }}
              >
                {rightRail.last10Record?.awayTeam?.pastGameResults?.[i]?.opponentAbbrev} (
                {rightRail.last10Record?.awayTeam?.pastGameResults?.[i]?.gameResult})
              </div>
              <div
                className={`p-2 w-1/2 ${['W', 'OTW', 'SOW'].includes(rightRail.last10Record?.homeTeam?.pastGameResults?.[i]?.gameResult || '') ? 'font-bold' : 'opacity-50'}`}
                style={{ borderWidth: '1pt', borderColor: homeTeam.data?.teamColor || '#000' }}
              >
                {rightRail.last10Record?.homeTeam?.pastGameResults?.[i]?.opponentAbbrev} (
                {rightRail.last10Record?.homeTeam?.pastGameResults?.[i]?.gameResult})
              </div>
            </div>
          ))}
        </div>
      )}

      {rightRail.seasonSeries && rightRail.seasonSeries.length > 0 && (
        <div className="mb-5">
          <div className="p-2 text-2xl font-bold text-center">
            {rightRail.seasonSeries[0]?.gameType === 3 ? 'Playoff Series' : 'Season Series'}
          </div>
          <div className="text-center text-xs">{formatSeriesStatus(game, rightRail)}</div>
          <div className="grid grid-cols-12 gap-3 py-4 items-center">
            {rightRail.seasonSeries.map((g: any, i: number) => (
              <Link
                href={`/game/${g.id}`}
                key={i}
                className={`col-span-12 lg:col-span-6 p-1 mb-1 border rounded ${g.gameState === 'CRIT' ? 'border-red-900' : ''}`}
              >
                <div
                  className={`flex justify-between ${g.awayTeam.score < g.homeTeam.score && !gameIsInProgress(g) ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center font-bold gap-1">
                    <TeamLogo src={g.awayTeam.logo} alt="Logo" className="w-8 h-8" />
                    {g.awayTeam.abbrev}
                  </div>
                  <div className="text-lg font-bold">{g.awayTeam.score}</div>
                </div>
                <div
                  className={`flex justify-between ${g.awayTeam.score > g.homeTeam.score && !gameIsInProgress(g) ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center font-bold gap-1">
                    <TeamLogo src={g.homeTeam.logo} alt="Logo" className="w-8 h-8" />
                    {g.homeTeam.abbrev}
                  </div>
                  <div className="text-lg font-bold">{g.homeTeam.score}</div>
                </div>
                {!['OFF', 'FUT', 'FINAL', 'PRE'].includes(g.gameState) ? (
                  <div className="flex justify-between">
                    <div>
                      <span className="text-xs font-medium px-2 py-1 bg-red-900 text-white rounded mr-1 uppercase">
                        {formatPeriodLabel(g.periodDescriptor)}
                        {g.clock?.inIntermission ? ' INT' : ''}
                      </span>
                      <span className="text-xs font-bold">{g.clock?.timeRemaining}</span>
                    </div>
                    <div className="text-xs py-1 text-right">
                      {dayjs(g.startTimeUTC).format('MMM D')}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <div>
                      {['OFF', 'FINAL'].includes(g.gameState) && g.gameScheduleState === 'OK' && (
                        <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-black rounded mr-1 uppercase">
                          Final
                        </span>
                      )}
                      {['FUT', 'PRE'].includes(g.gameState) && g.gameScheduleState === 'OK' && (
                        <span className="text-xs py-1">
                          {formatLocalizedTime(game.startTimeUTC)}
                        </span>
                      )}
                      {g.gameScheduleState === 'CNCL' && (
                        <span className="text-xs font-medium px-2 py-1 bg-slate-900 text-white rounded mr-1 uppercase">
                          <FontAwesomeIcon icon={faBan} fixedWidth /> Cancelled
                        </span>
                      )}
                      {g.gameScheduleState === 'PPD' && (
                        <span className="text-xs font-medium px-2 py-1 bg-yellow-500 text-black rounded mr-1 uppercase">
                          <FontAwesomeIcon icon={faWarning} fixedWidth /> Postponed
                        </span>
                      )}
                      {g.gameScheduleState === 'TBD' && (
                        <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-black rounded mr-1 uppercase">
                          TBD
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-xs py-1">{dayjs(g.startTimeUTC).format('MMM D')}</span>
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {rightRail.gameInfo && (
        <div className="mb-5 text-xs">
          <div className="p-2 text-2xl font-bold text-center">Game Info</div>
          {Array.isArray(rightRail.gameInfo.referees) &&
            rightRail.gameInfo.referees.length > 0 &&
            Array.isArray(rightRail.gameInfo.linesmen) &&
            rightRail.gameInfo.linesmen.length > 0 && (
              <div className="flex">
                <div className="w-full p-2">
                  <div className="font-bold">Officials</div>
                  <div>
                    Referees:{' '}
                    {rightRail.gameInfo.referees.map((o: any, i: number) => (
                      <span key={i}>
                        {i > 0 && ', '}
                        {o.default}
                      </span>
                    ))}
                  </div>
                  <div>
                    Linesmen:{' '}
                    {rightRail.gameInfo.linesmen.map((o: any, i: number) => (
                      <span key={i}>
                        {i > 0 && ', '}
                        {o.default}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          <div className="flex">
            <div className="w-1/2 p-2">
              <div className="my-2">
                <div className="font-bold">{awayTeam.abbrev} Head Coach</div>
                {rightRail.gameInfo.awayTeam?.headCoach?.default}
              </div>
              <div className="my-2">
                <div className="font-bold">{awayTeam.abbrev} Scratches</div>
                {rightRail.gameInfo.awayTeam?.scratches?.length === 0 && <>No players listed.</>}
                {rightRail.gameInfo.awayTeam?.scratches?.map((p: any, i: number) => (
                  <span key={p.id}>
                    {i > 0 && ', '}
                    {renderPlayer(p)}
                  </span>
                ))}
              </div>
            </div>
            <div className="w-1/2 p-2">
              <div className="my-2">
                <div className="font-bold">{homeTeam.abbrev} Head Coach</div>
                {rightRail.gameInfo.homeTeam?.headCoach?.default}
              </div>
              <div className="my-2">
                <div className="font-bold">{homeTeam.abbrev} Scratches</div>
                {rightRail.gameInfo.homeTeam?.scratches?.length === 0 && <>No players listed.</>}
                {rightRail.gameInfo.homeTeam?.scratches?.map((p: any, i: number) => (
                  <span key={p.id}>
                    {i > 0 && ', '}
                    {renderPlayer(p)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {rightRail.gameReports && (
        <div>
          <div className="p-2 text-2xl font-bold text-center">Game Reports</div>
          <ul className="text-xs flex flex-wrap mt-2">
            {Object.keys(rightRail.gameReports || {}).map((reportKey) => (
              <li key={reportKey} className="p-1 w-1/2 text-center">
                <Link
                  href={rightRail.gameReports?.[reportKey] || '#'}
                  className="font-bold underline"
                >
                  {GAME_REPORT_NAMES[reportKey as keyof typeof GAME_REPORT_NAMES] || reportKey}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <FloatingVideoPlayer
        isVisible={isVideoPlayerVisible}
        url={videoPlayerUrl || ''}
        label={videoPlayerLabel || ''}
        onClose={handleVideoPlayerClose}
      />
    </div>
  );
};

export default GameSidebar;
