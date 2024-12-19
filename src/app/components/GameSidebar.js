'use client';

import React, { useState } from 'react';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useGameContext } from '../contexts/GameContext';
import Scoreboard from './Scoreboard';
import TeamLogo from './TeamLogo';
import { getTeamDataByAbbreviation } from '../utils/teamData';
import { GAME_STATES, GAME_REPORT_NAMES, NHL_BRIGHTCOVE_ACCOUNT } from '../utils/constants';
import { formatSeriesStatus, formatLocalizedTime, formatPeriodLabel } from '../utils/formatters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faPlayCircle, faWarning } from '@fortawesome/free-solid-svg-icons';
import GameSidebarSkeleton from './GameSidebarSkeleton';
import StatComparisonRow from './StatComparisonRow';
import FloatingVideoPlayer from './FloatingVideoPlayer';

const gameIsInProgress = (game) => {
  switch (GAME_STATES[game.gameState]) {
  case GAME_STATES.PRE:
  case GAME_STATES.LIVE:
  case GAME_STATES.CRIT:
    return true;
  default:
    return false;
  }
};

const renderPlayer = (player) => {
  return (
    <>
      <Link href={`/player/${player.id}`}>{player.firstName.default} {player.lastName.default}</Link>
    </>
  );
};

const GameSidebar = () => {
  const [videoPlayerLabel, setVideoPlayerLabel] = useState(null);
  const [videoPlayerUrl, setVideoPlayerUrl] = useState(null);
  const [isVideoPlayerVisible, setVideoPlayerVisible] = useState(false);

  const { gameData } = useGameContext();

  if (!gameData) { 
    return <GameSidebarSkeleton />;
  }

  // Destructure data for rendering
  const { homeTeam, awayTeam, game, rightRail, story } = gameData;
  const { gameVideo } = rightRail;

  homeTeam.data = getTeamDataByAbbreviation(game.homeTeam.abbrev) || {};
  awayTeam.data = getTeamDataByAbbreviation(game.awayTeam.abbrev) || {};

  // Update logo map
  const logos = {};
  logos[homeTeam.abbrev] = homeTeam.logo;
  logos[awayTeam.abbrev] = awayTeam.logo;

  const gameStats = {};
  story.summary?.teamGameStats.map((s) => {
    gameStats[s.category] = { awayValue: s.awayValue, homeValue: s.homeValue };
  });

  const handleVideoPlayerClose = () => {
    setVideoPlayerVisible(false);
    setVideoPlayerLabel(null);
    setVideoPlayerUrl(null);
  };

  return (
    <div>
      {(gameVideo?.threeMinRecap || gameVideo?.condensedGame) && (
        <div className="flex justify-items-end gap-2 mb-3">
          {gameVideo?.threeMinRecap && (
            <button
              onClick={() => {
                setVideoPlayerUrl(`https://players.brightcove.net/${NHL_BRIGHTCOVE_ACCOUNT}/default_default/index.html?videoId=${gameVideo.threeMinRecap}`);
                setVideoPlayerLabel('3:00 Recap');
                setVideoPlayerVisible(true);
              }}
              className="block p-1 rounded text-sm flex-1 text-center bg-blue-900 text-white font-bold hover:shadow"
            >
              <FontAwesomeIcon icon={faPlayCircle} fixedWidth /> 3:00 Recap
            </button>
          )}
          {gameVideo?.condensedGame && (
            <button
              onClick={() => {
                setVideoPlayerUrl(`https://players.brightcove.net/${NHL_BRIGHTCOVE_ACCOUNT}/default_default/index.html?videoId=${gameVideo.condensedGame}`);
                setVideoPlayerLabel('Condensed Game');
                setVideoPlayerVisible(true);
              }}
              className="block p-1 rounded text-sm flex-1 text-center bg-blue-900 text-white font-bold hover:shadow"
            >
              <FontAwesomeIcon icon={faPlayCircle} fixedWidth /> Condensed Game
            </button>
          )}
        </div>
      )}

      {rightRail.linescore && (
        <div className="mb-5">
          <Scoreboard game={game} linescore={rightRail.linescore} />
        </div>
      )}
      {rightRail.shotsByPeriod && (
        <div className="mb-5">
          <div className="flex text-center items-center">
            <div className="w-1/4 p-2 text-bold flex justify-center">
              <TeamLogo
                src={logos[awayTeam.abbrev]}
                alt={awayTeam.abbrev}
                className="h-12 w-12"
              />
            </div>
            <div className="w-1/2 p-2 text-2xl font-bold">Shots</div>
            <div className="w-1/4 p-2 text-bold flex justify-center">
              <TeamLogo
                src={logos[homeTeam.abbrev]}
                alt={homeTeam.abbrev}
                className="h-12 w-12"
              />
            </div>
          </div>
          {rightRail.shotsByPeriod.map((period, index) => (
            <div key={index} className={`flex text-center ${index % 2 ? '' : 'bg-slate-500/10'}`}>
              <div className="w-1/4 p-2">{period.away}</div>
              <div className="w-1/2 p-3 text-xs">{formatPeriodLabel({ ...game.periodDescriptor, number: period.periodDescriptor?.number })}</div>
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
                  alt={awayTeam.abbrev}
                  className="h-12 w-12"
                />
              </div>
              <div className="w-1/2 p-2 text-2xl font-bold">Game Stats</div>
              <div className="w-1/4 p-2 text-bold flex justify-center">
                <TeamLogo
                  src={logos[homeTeam.abbrev]}
                  alt={homeTeam.abbrev}
                  className="h-12 w-12"
                />
              </div>
            </div>
            <StatComparisonRow
              awayStat={gameStats.sog.awayValue}
              awayTeam={awayTeam}
              homeStat={gameStats.sog.homeValue}
              homeTeam={homeTeam}
              stat="sog"
            />
            <StatComparisonRow
              awayStat={gameStats.faceoffWinningPctg.awayValue}
              awayTeam={awayTeam}
              homeStat={gameStats.faceoffWinningPctg.homeValue}
              homeTeam={homeTeam}
              stat="faceoffWinningPctg"
            />
            <StatComparisonRow
              awayStat={gameStats.powerPlayPctg.awayValue}
              awayStatRank={gameStats.powerPlay.awayValue}
              awayTeam={awayTeam}
              homeStat={gameStats.powerPlayPctg.homeValue}
              homeStatRank={gameStats.powerPlay.homeValue}
              homeTeam={homeTeam}
              stat="powerPlayPctg"
            />
            <StatComparisonRow
              awayStat={gameStats.pim.awayValue}
              awayTeam={awayTeam}
              homeStat={gameStats.pim.homeValue}
              homeTeam={homeTeam}
              stat="pim"
            />
            <StatComparisonRow
              awayStat={gameStats.hits.awayValue}
              awayTeam={awayTeam}
              homeStat={gameStats.hits.homeValue}
              homeTeam={homeTeam}
              stat="hits"
            />
            <StatComparisonRow
              awayStat={gameStats.blockedShots.awayValue}
              awayTeam={awayTeam}
              homeStat={gameStats.blockedShots.homeValue}
              homeTeam={homeTeam}
              stat="blockedShots"
            />
            <StatComparisonRow
              awayStat={gameStats.giveaways.awayValue}
              awayTeam={awayTeam}
              homeStat={gameStats.giveaways.homeValue}
              homeTeam={homeTeam}
              stat="giveaways"
            />
            <StatComparisonRow
              awayStat={gameStats.takeaways.awayValue}
              awayTeam={awayTeam}
              homeStat={gameStats.takeaways.homeValue}
              homeTeam={homeTeam}
              stat="takeaways"
            />
          </div>
        </div>
      )}
      {rightRail.teamSeasonStats !== undefined && (
        <div className="mb-5">
          <div className="flex text-center items-center justify-between">
            <div className="w-1/4 p-2 text-bold flex justify-center">
              <TeamLogo
                src={logos[awayTeam.abbrev]}
                alt={awayTeam.abbrev}
                className="h-12 w-12"
              />
            </div>
            <div className="w-1/2 p-2 text-2xl font-bold">Season Stats</div>
            <div className="w-1/4 p-2 text-bold flex justify-center">
              <TeamLogo
                src={logos[homeTeam.abbrev]}
                alt={homeTeam.abbrev}
                className="h-12 w-12"
              />
            </div>
          </div>

          <StatComparisonRow
            awayStat={rightRail.teamSeasonStats.awayTeam.ppPctg}
            awayStatRank={rightRail.teamSeasonStats.awayTeam.ppPctgRank}
            awayTeam={awayTeam}
            homeStat={rightRail.teamSeasonStats.homeTeam.ppPctg}
            homeStatRank={rightRail.teamSeasonStats.homeTeam.ppPctgRank}
            homeTeam={homeTeam}
            stat="ppPctg"
          />
          <StatComparisonRow
            awayStat={rightRail.teamSeasonStats.awayTeam.pkPctg}
            awayStatRank={rightRail.teamSeasonStats.awayTeam.pkPctgRank}
            awayTeam={awayTeam}
            homeStat={rightRail.teamSeasonStats.homeTeam.pkPctg}
            homeStatRank={rightRail.teamSeasonStats.homeTeam.pkPctgRank}
            homeTeam={homeTeam}
            stat="pkPctg"
          />
          <StatComparisonRow
            awayStat={rightRail.teamSeasonStats.awayTeam.faceoffWinningPctg}
            awayStatRank={rightRail.teamSeasonStats.awayTeam.faceoffWinningPctgRank}
            awayTeam={awayTeam}
            homeStat={rightRail.teamSeasonStats.homeTeam.faceoffWinningPctg}
            homeStatRank={rightRail.teamSeasonStats.homeTeam.faceoffWinningPctgRank}
            homeTeam={homeTeam}
            stat="faceoffWinningPctg"
          />
          <StatComparisonRow
            awayStat={rightRail.teamSeasonStats.awayTeam.goalsForPerGamePlayed}
            awayStatRank={rightRail.teamSeasonStats.awayTeam.goalsForPerGamePlayedRank}
            awayTeam={awayTeam}
            homeStat={rightRail.teamSeasonStats.homeTeam.goalsForPerGamePlayed}
            homeStatRank={rightRail.teamSeasonStats.homeTeam.goalsForPerGamePlayedRank}
            homeTeam={homeTeam}
            stat="goalsForPerGamePlayed"
          />
          <StatComparisonRow
            awayStat={rightRail.teamSeasonStats.awayTeam.goalsAgainstPerGamePlayed}
            awayStatRank={rightRail.teamSeasonStats.awayTeam.goalsAgainstPerGamePlayedRank}
            awayTeam={awayTeam}
            homeStat={rightRail.teamSeasonStats.homeTeam.goalsAgainstPerGamePlayed}
            homeStatRank={rightRail.teamSeasonStats.homeTeam.goalsAgainstPerGamePlayedRank}
            homeTeam={homeTeam}
            stat="goalsAgainstPerGamePlayed"
          />
        </div>
      )}

      {rightRail.last10Record && (
        <div className="mb-5">
          <div className="flex text-center items-center justify-between">
            <div className="w-1/4 p-2 text-bold flex justify-center">
              <TeamLogo
                src={logos[awayTeam.abbrev]}
                alt={awayTeam.abbrev}
                className="h-12 w-12"
              />
            </div>
            <div className="w-1/2 p-2 text-2xl font-bold">Last 10 Games</div>
            <div className="w-1/4 p-2 text-bold flex justify-center">
              <TeamLogo
                src={logos[homeTeam.abbrev]}
                alt={homeTeam.abbrev}
                className="h-12 w-12"
              />
            </div>
          </div>
          <div className="flex text-center">
            <div className="w-1/2">{rightRail.last10Record.awayTeam.record} ({rightRail.last10Record.awayTeam.streakType}{rightRail.last10Record.awayTeam.streak})</div>
            <div className="w-1/2">{rightRail.last10Record.homeTeam.record} ({rightRail.last10Record.homeTeam.streakType}{rightRail.last10Record.homeTeam.streak})</div>
          </div>
          {rightRail.last10Record.awayTeam.pastGameResults.map((_g, i) => (
            <div key={i} className={`flex text-center text-xs my-1 gap-1 ${i % 2 ? '' : 'bg-slate-500/10'}`}>
              <div className={`p-2 w-1/2 ${['W', 'OTW', 'SOW'].includes(rightRail.last10Record.awayTeam.pastGameResults[i].gameResult) ? 'font-bold' : 'opacity-50'}`} style={{ borderWidth: '1pt', borderColor:  awayTeam.data.teamColor }}>
                {rightRail.last10Record.awayTeam.pastGameResults[i].opponentAbbrev} ({rightRail.last10Record.awayTeam.pastGameResults[i].gameResult})
              </div>
              <div className={`p-2 w-1/2 ${['W', 'OTW', 'SOW'].includes(rightRail.last10Record.homeTeam.pastGameResults[i].gameResult) ? 'font-bold' : 'opacity-50'}`} style={{ borderWidth: '1pt', borderColor:  homeTeam.data.teamColor }}>
                {rightRail.last10Record.homeTeam.pastGameResults[i].opponentAbbrev} ({rightRail.last10Record.homeTeam.pastGameResults[i].gameResult})
              </div>
            </div>
          ))}
        </div>
      )}

      {rightRail.seasonSeries && (
        <div className="mb-5">
          <div className="p-2 text-2xl font-bold text-center">Season Series</div>
          <div className="text-center text-xs">
            {formatSeriesStatus(game, rightRail)}
          </div>
          <div className="grid grid-cols-12 gap-3 py-4 items-center">
            {rightRail.seasonSeries.map((g, i) => (
              <Link href={`/game/${g.id}`} key={i} className={`col-span-12 lg:col-span-6 p-1 mb-1 border rounded ${g.gameState === 'CRIT' ? 'border-red-900' : ''}`}>
                <div className={`flex justify-between ${g.awayTeam.score < g.homeTeam.score && !gameIsInProgress(g) ? 'opacity-50' : ''}`}>
                  <div className="flex items-center font-bold gap-1">
                    <TeamLogo
                      src={g.awayTeam.logo}
                      alt="Logo"
                      className="w-8 h-8"
                    />
                    {g.awayTeam.abbrev}
                  </div>
                  <div className="text-lg font-bold">{g.awayTeam.score}</div>
                </div>
                <div className={`flex justify-between ${g.awayTeam.score > g.homeTeam.score && !gameIsInProgress(g) ? 'opacity-50' : ''}`}>
                  <div className="flex items-center font-bold gap-1">
                    <TeamLogo
                      src={g.homeTeam.logo}
                      alt="Logo"
                      className="w-8 h-8"
                    />
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
                    <div className="text-xs py-1 text-right">{dayjs(g.startTimeUTC).format('MMM D')}</div>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <div>
                      {(['OFF', 'FINAL'].includes(g.gameState) && g.gameScheduleState === 'OK') && (
                        <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-black rounded mr-1 uppercase">Final</span>
                      )}
                      {(['FUT', 'PRE'].includes(g.gameState) && g.gameScheduleState === 'OK') && (
                        <span className="text-xs py-1">{formatLocalizedTime(game.startTimeUTC)}</span>
                      )}
                      {g.gameScheduleState === 'CNCL' && (
                        <span className="text-xs font-medium px-2 py-1 bg-slate-900 text-white rounded mr-1 uppercase"><FontAwesomeIcon icon={faBan} fixedWidth /> Cancelled</span>
                      )}
                      {g.gameScheduleState === 'PPD' && (
                        <span className="text-xs font-medium px-2 py-1 bg-yellow-500 text-black rounded mr-1 uppercase"><FontAwesomeIcon icon={faWarning} fixedWidth /> Postponed</span>
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
          {rightRail.gameInfo.referees.length > 0 && rightRail.gameInfo.linesmen.length > 0 && (
            <div className="flex">
              <div className="w-full p-2">
                <div className="font-bold">Officials</div>
                <div>Referees: {rightRail.gameInfo.referees.map((o, i) => <span key={i}>{i > 0 && ', '}{o.default}</span>)}</div>
                <div>Linesmen: {rightRail.gameInfo.linesmen.map((o, i) => <span key={i}>{i > 0 && ', '}{o.default}</span>)}</div>
              </div>
            </div>
          )}
          <div className="flex">
            <div className="w-1/2 p-2">
              <div className="my-2">
                <div className="font-bold">{awayTeam.abbrev} Head Coach</div>
                {rightRail.gameInfo.awayTeam.headCoach.default}
              </div>
              <div className="my-2">
                <div className="font-bold">{awayTeam.abbrev} Scratches</div>
                {rightRail.gameInfo.awayTeam.scratches.length === 0 && (<>No players listed.</>)}
                {rightRail.gameInfo.awayTeam.scratches.map((p, i) => <span key={p.id}>{i > 0 && ', '}{renderPlayer(p)}</span>)}
              </div>
            </div>
            <div className="w-1/2 p-2">
              <div className="my-2">
                <div className="font-bold">{homeTeam.abbrev} Head Coach</div>
                {rightRail.gameInfo.homeTeam.headCoach.default}
              </div>
              <div className="my-2">
                <div className="font-bold">{homeTeam.abbrev} Scratches</div>
                {rightRail.gameInfo.homeTeam.scratches.length === 0 && (<>No players listed.</>)}
                {rightRail.gameInfo.homeTeam.scratches.map((p, i) => <span key={p.id}>{i > 0 && ', '}{renderPlayer(p)}</span>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {rightRail.gameReports && (
        <div>
          <div className="p-2 text-2xl font-bold text-center">Game Reports</div>
          <ul className="text-xs flex flex-wrap mt-2">
            {Object.keys(rightRail.gameReports).map((reportKey) => (
              <li key={reportKey} className="p-1 w-1/2 text-center">
                <Link href={rightRail.gameReports[reportKey]} className="font-bold underline">{GAME_REPORT_NAMES[reportKey]}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <FloatingVideoPlayer isVisible={isVideoPlayerVisible} url={videoPlayerUrl} label={videoPlayerLabel} onClose={handleVideoPlayerClose} />
    </div>
  );
};

export default GameSidebar;