import React from 'react';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useGameContext } from '../contexts/GameContext';
import Scoreboard from './Scoreboard';
import TeamLogo from './TeamLogo';
import { getTeamDataByAbbreviation } from '../utils/teamData';
import { TEAM_STATS, GAME_STATES } from '../utils/constants';
import { formatStatValue, formatSeriesStatus, formatGameTime, formatPeriodLabel } from '../utils/formatters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faWarning } from '@fortawesome/free-solid-svg-icons';


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

const GameSidebar = () => {
  const { gameData } = useGameContext();

  if (!gameData) { 
    return <></>;
  }

  // Destructure data for rendering
  const { homeTeam, awayTeam, game, rightRail, story } = gameData;

  homeTeam.data = getTeamDataByAbbreviation(game.homeTeam.abbrev) || {};
  awayTeam.data = getTeamDataByAbbreviation(game.awayTeam.abbrev) || {};

  // Update logo map
  const logos = {};
  logos[homeTeam.abbrev] = homeTeam.logo;
  logos[awayTeam.abbrev] = awayTeam.logo;

  return (
    <div>
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
            {story.summary?.teamGameStats.map((stat, statIndex) => (
              <div key={stat.category} className={`flex text-center item-center ${statIndex % 2 ? '' : 'bg-slate-500/10'}`}>
                <div className="w-1/4 p-2 text-bold">{formatStatValue(stat.category, stat.awayValue)}</div>
                <div className="w-1/2 p-3 text-xs">{TEAM_STATS[stat.category] || stat.category}</div>
                <div className="w-1/4 p-2 text-bold">{formatStatValue(stat.category, stat.homeValue)}</div>
              </div>
            ))}
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
          {Object.keys(TEAM_STATS).map((stat, statIndex) => {
            if (rightRail.teamSeasonStats.awayTeam[stat] === undefined) {
              return false;
            }
            
            return (
              <div key={stat} className={`flex text-center item-center ${statIndex % 2 ? '' : 'bg-slate-500/10'}`}>
                <div className="w-1/4 p-2 text-bold">{formatStatValue(stat, rightRail.teamSeasonStats.awayTeam[stat])}</div>
                <div className="w-1/2 p-3 text-xs">{TEAM_STATS[stat] || stat}</div>
                <div className="w-1/4 p-2 text-bold">{formatStatValue(stat, rightRail.teamSeasonStats.homeTeam[stat])}</div>
              </div>
            );
          })}
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
              <Link href={`/game/${g.id}`} key={i} className={`col-span-12 lg:col-span-6 p-1 mb-1 border rounded ${g.gameState === 'CRIT' ? 'border-red-500' : ''}`}>
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
                        <span className="text-xs py-1">{formatGameTime(game.startTimeUTC)}</span>
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
    </div>
  );
};

export default GameSidebar;