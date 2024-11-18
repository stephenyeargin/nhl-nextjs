'use client';

import Image from 'next/image'
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Link from 'next/link.js';
import utc from 'dayjs/plugin/utc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan, faCheckCircle, faHockeyPuck, faPlayCircle, faRadio, faTelevision, faTrophy, faWarning, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import GameSkeleton from '@/app/components/GameSkeleton.js';
import Headshot from '@/app/components/Headshot';
import RadioLink from '@/app/components/RadioLink.js';
import GameHeader from '@/app/components/GameHeader.js';
import PreGameSummary from '@/app/components/PreGameSummary';
import IceSurface from '@/app/components/IceSurface';
import { PERIOD_DESCRIPTORS, PENALTY_TYPES, PENALTY_DESCRIPTIONS, TEAM_STATS, GAME_STATES, SHOOTOUT_RESULT } from '@/app/utils/constants';
import { formatBroadcasts, formatGameTime, formatSeriesStatus, formatStatValue } from '@/app/utils/formatters';
import Scoreboard from '@/app/components/Scoreboard';

dayjs.extend(utc);

const gameIsInProgress = (game) => {
  switch (GAME_STATES[game.gameState]) {
    case GAME_STATES.PRE:
    case GAME_STATES.LIVE:
    case GAME_STATES.CRIT:
      return true;
    default:
      return false;
  }
}

const GamePage = ({ params }) => {
  const { id } = params;
  const logos = {};

  // Initial state for the game data
  const [gameData, setGameData] = useState(null);
  const [gameState, setGameState] = useState(null);

  // Function to fetch the live game data
  const fetchGameData = async () => {
    let game, rightRail, story;

    try {
      const gameResponse = await fetch(`/api/nhl/gamecenter/${id}/landing`, { cache: 'no-store' });
      const rightRailResponse = await fetch(`/api/nhl/gamecenter/${id}/right-rail`, { cache: 'no-store' });
      const storyResponse = await fetch(`/api/nhl/wsc/game-story/${id}`, { cache: 'no-store' });

      game = await gameResponse.json();
      rightRail = await rightRailResponse.json();
      story = await storyResponse.json();
    } catch (error) {
      console.error('Error fetching game data:', error);
      return;
    }

    // Extract relevant parts of the game data
    const { homeTeam, awayTeam, gameDate, venue, venueLocation, summary, matchup } = game;
    setGameData({ homeTeam, awayTeam, gameDate, venue, venueLocation, summary, matchup, game, rightRail, story });
    setGameState(game.gameState);
  };

  // Use `useEffect` to run once on initial render and set up polling
  useEffect(() => {
    // Initial fetch on page load
    fetchGameData();

    if (!['PRE', 'LIVE', 'CRIT'].includes(gameState)) {
      return;
    }

    // Set up polling every 30 seconds to update game data
    const intervalId = setInterval(() => {
      fetchGameData();
    }, 20000); // 20 seconds polling interval

    // Cleanup the interval when component unmounts
    return () => clearInterval(intervalId);
  }, [ id, gameState ]); // Only re-run the effect if the `id` changes

  // If game data is loading, show loading indicator
  if (!gameData) {
    return <GameSkeleton />
  }

  // Destructure data for rendering
  const { homeTeam, awayTeam, summary, matchup, game, rightRail, story } = gameData;

  // Update logo map
  logos[homeTeam.abbrev] = homeTeam.logo;
  logos[awayTeam.abbrev] = awayTeam.logo;

  return (
    <div className="container mx-auto">
      <GameHeader game={game} />

      <div className="text-center my-3 text-xs font-bold">
        <FontAwesomeIcon icon={faHockeyPuck} fixedWidth className="mr-1" />
        <Link href={`https://www.nhl.com/gamecenter/${game.id}`} target="_blank" className="underline">NHL.com GameCenter</Link>
        {game.tvBroadcasts.length > 0 && (
          <span className="ml-5">
            <FontAwesomeIcon icon={faTelevision} fixedWidth className="mr-1" /> {formatBroadcasts(game.tvBroadcasts)}
          </span>
        )}
        {game.homeTeam.radioLink && (
          <span className="ml-5">
            <FontAwesomeIcon icon={faRadio} fixedWidth className="mr-1" />
            {' '}{' '}
            <RadioLink m3u8Url={game.homeTeam.radioLink} label="Home" />
            {' '}|{' '}
            <RadioLink m3u8Url={game.awayTeam.radioLink} label="Away" />
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-4 gap-10">
        <div className="col-span-4 md:col-span-3">
          {matchup && (
            <PreGameSummary game={game} />
          )}
          {summary && (
            <div>
              <IceSurface game={game} />

              <div className="text-3xl font-bold underline my-4">Game Summary</div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold my-3">Scoring Summary</h3>
                {summary.scoring.map((period, index) => (
                  <div key={index} className="mb-2">
                    <h4 className="font-semibold">{PERIOD_DESCRIPTORS[period.periodDescriptor.number] || period.periodDescriptor.number}</h4>
                    {period.periodDescriptor.periodType === 'SO' ? (
                      <>
                        {game.summary?.shootout.length == 0 && (
                          <p className="text-slate-500">No shots taken.</p>
                        )}
                        {game.summary?.shootout.map((shot) => (
                          <div key={shot.sequence} className="border grid grid-cols-12 gap-2 my-5 p-2">
                            <div className="col-span-12 flex">
                              <Headshot
                                src={shot.headshot}
                                alt={`${shot.firstName} ${shot.lastName}`}
                                size="4"
                                className="mr-2"
                              />
                              <div className="grow">
                                <span className="font-bold">
                                  {shot.firstName} {shot.lastName || 'Unnamed'}
                                </span>
                                <div className="col-span-10 flex">
                                  <Image src={logos[shot.teamAbbrev]} alt="Logo" height={128} width={128} className="w-8 h-8 mr-2" />
                                  <span className="capitalize">
                                    {shot.shotType} • {SHOOTOUT_RESULT[shot.result] || shot.result}
                                  </span>
                                </div>
                              </div>
                              <div className="grow text-right p-5">
                                {shot.result === 'goal' ? (
                                  <>
                                    {shot.gameWinner ? (
                                      <FontAwesomeIcon icon={faTrophy} className="text-3xl text-green-500" />
                                    ) : (
                                      <FontAwesomeIcon icon={faCheckCircle} className="text-3xl text-green-500" />
                                    )}
                                  </>
                                ) : (
                                  <FontAwesomeIcon icon={faXmarkCircle} className="text-3xl text-slate-500" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <>{period.goals.length > 0 ? (
                        period.goals.map((goal, i) => (
                          <div key={i} className="border grid grid-cols-12 gap-2 my-5 p-2">
                            <div className="col-span-12 md:col-span-5 flex">
                              <Headshot
                                src={goal.headshot}
                                alt={`${goal.firstName.default} ${goal.lastName.default}`}
                                size="4"
                                className="mr-2"
                              />
                              <div>
                                <span className="font-bold">
                                  {goal.firstName.default} {goal.lastName.default} ({goal.goalsToDate})
                                </span>
                                {goal.strength !== 'ev' && (
                                  <span className="rounded text-xs ml-2 text-white bg-red-900 p-1 uppercase">{goal.strength}G</span>
                                )}
                                {goal.goalModifier == 'empty-net' && (
                                  <span className="rounded text-xs ml-2 text-white bg-blue-900 p-1 uppercase" title="Empty Net">EN</span>
                                )}
                                {goal.goalModifier == 'penalty-shot' && (
                                  <span className="rounded text-xs ml-2 text-white bg-blue-900 p-1 uppercase" title="Penalty Shot">PS</span>
                                )}
                                <br />
                                <div className="flex items-center">
                                  <Image
                                    src={logos[goal.teamAbbrev.default]}
                                    alt="Logo"
                                    height={128}
                                    width={128}
                                    className="w-8 h-8 mr-2"
                                  />
                                  <div className="text-sm"> {goal.assists.length > 0 ? (
                                    <>
                                      <strong>Assists:</strong>
                                      {' '}
                                      {goal.assists.map((assist, i) => (
                                        <span key={i}>{assist.firstName.default} {assist.lastName.default} ({assist.assistsToDate}){i !== goal.assists.length - 1 && ', '}</span>
                                      ))}
                                    </>
                                  ) : (
                                    <>Unassisted</>
                                  )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-4 md:col-span-2 p-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white rounded-md text-center">
                              <div className="font-black capitalize">{goal.awayScore}-{goal.homeScore}</div>
                              <div className="text-sm font-light">Score</div>
                            </div>
                            <div className="col-span-4 md:col-span-2 p-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white rounded-md text-center">
                              <div className="font-black capitalize">{goal.timeInPeriod}</div>
                              <div className="text-sm font-light">Time</div>
                            </div>
                            <div className="col-span-4 md:col-span-2 p-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white rounded-md text-center">
                              <div className="font-black capitalize">{goal.shotType ? goal.shotType : '-'}</div>
                              <div className="text-sm font-light">Shot</div>
                            </div>
                            {goal.highlightClipSharingUrl && (
                              <div className="col-span-12 md:col-span-1 md:py-5 rounded-md mx-4 text-center text-blue-500">
                                <a href={goal.highlightClipSharingUrl} target="_blank" rel="noopener noreferrer">
                                  <FontAwesomeIcon icon={faPlayCircle} size="2x" className="align-middle mr-2 md:mr-0" />
                                  <span className="md:hidden">Watch Highlight</span>
                                </a>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500 my-10">No goals scored this period.</p>
                      )}</>
                    )}
                  </div>
                ))}
              </div>
              {game.summary.penalties && (
                <div className="my-10">
                  <h3 className="text-xl font-semibold my-3">Penalties</h3>
                  {game.summary.penalties.map((period, index) => (
                    <div key={index} className="mb-5">
                      <h4 className="font-semibold">
                        {PERIOD_DESCRIPTORS[period.periodDescriptor.number]}
                      </h4>
                      {period.penalties.length === 0 ? (
                        <p className="text-slate-500 my-10">No penalties in this period.</p>
                      ) : (
                        <div className="min-w-full">
                          <div className="flex flex-col">
                            {period.penalties.map((penalty, penaltyIndex) => (
                              <div 
                                key={penaltyIndex} 
                                className={`my-1 flex ${penaltyIndex % 2 ? '' : 'bg-slate-500/10'}`}
                              >
                                <div className="w-20 p-4 text-right">
                                  {penalty.timeInPeriod}
                                </div>
                                <div className="w-1/3 p-2">
                                  <div className="flex">
                                    <Image
                                      src={logos[penalty.teamAbbrev.default]}
                                      alt="Logo"
                                      height={128}
                                      width={128}
                                      className="w-10 h-10 mr-2"
                                    />
                                    <div>
                                      <div className="font-bold">{penalty.committedByPlayer || penalty.teamAbbrev.default}</div>
                                      {penalty.drawnBy && (
                                        <div className="text-xs text-slate-600">
                                          Drawn by: {penalty.drawnBy}
                                        </div>
                                      )}
                                      {penalty.servedBy && (
                                        <div className="text-xs text-slate-600">
                                          Served by: {penalty.servedBy}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="w-40 p-4">
                                  {penalty.duration ? `${penalty.duration} mins` : '-'}
                                </div>
                                <div className="w-1/4 p-2">
                                  <div className="text-xs font-light text-slate-600">
                                    {PENALTY_TYPES[penalty.type] || penalty.type}
                                  </div>
                                  <div>
                                    {PENALTY_DESCRIPTIONS[penalty.descKey] || penalty.descKey.replace(/-/g, ' ')}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div>
                {summary.threeStars?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold my-4">Three Stars</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {summary.threeStars.map((p) => (
                        <div key={p.playerId} className="text-center">
                          <div className="relative inline-block">
                            <span className="absolute bottom-0 left-0 bg-white text-black rounded-full font-bold border border-slate-200 w-8 h-8 flex items-center justify-center">
                              {p.star}
                            </span>
                            <Headshot
                              src={p.headshot}
                              alt={p.name.default}
                              size="10"
                              className="mx-auto mb-2"
                            />
                          </div>
                          <h4 className="font-semibold">{p.name.default}</h4>
                          <p className="text-sm">#{p.sweaterNo} • {p.teamAbbrev} • {p.position}</p>
                          {Object(p).hasOwnProperty('goals') ? (
                            <p className="text-sm">G: {p.goals} | A: {p.assists} | P: {p.points}</p>
                          ) : (
                            <p className="text-sm">GAA: {p.goalsAgainstAverage} | SV%: {p.savePctg}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="col-span-4 md:col-span-1">
          {rightRail.linescore && (
            <div className="mb-5">
              <Scoreboard game={game} linescore={rightRail.linescore} />
            </div>
          )}
          {rightRail.shotsByPeriod && (
            <div className="mb-5">
              <div className="flex text-center items-center">
                <div className="w-1/4 p-2 text-bold flex justify-center"><Image src={logos[awayTeam.abbrev]} width={48} height={48} alt={awayTeam.abbrev} /></div>
                <div className="w-1/2 p-2 text-2xl font-bold">Shots</div>
                <div className="w-1/4 p-2 text-bold flex justify-center"><Image src={logos[homeTeam.abbrev]} width={48} height={48} alt={homeTeam.abbrev} /></div>
              </div>
              {rightRail.shotsByPeriod.map((period, index) => (
                <div key={index} className={`flex text-center ${index % 2 ? '' : 'bg-slate-500/10'}`}>
                  <div className="w-1/4 p-2">{period.away}</div>
                  <div className="w-1/2 p-3 text-xs">{PERIOD_DESCRIPTORS[period.periodDescriptor.number]}</div>
                  <div className="w-1/4 p-2">{period.home}</div>
                </div>
              ))}
            </div>
          )}
          {story.summary?.teamGameStats && (
            <div className="mb-5">
              <div>
                <div className="flex text-center items-center justify-between">
                  <div className="w-1/4 p-2 text-bold flex justify-center"><Image src={logos[awayTeam.abbrev]} width={48} height={48} alt={awayTeam.abbrev} /></div>
                  <div className="w-1/2 p-2 text-2xl font-bold">Game Stats</div>
                  <div className="w-1/4 p-2 text-bold flex justify-center"><Image src={logos[homeTeam.abbrev]} width={48} height={48} alt={homeTeam.abbrev} /></div>
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
          {rightRail.seasonSeries && (
            <div className="mb-5">
              <div className="text-3xl font-bold underline">Season Series</div>
              <div className="">
                {formatSeriesStatus(game, rightRail)}
              </div>
              <div className="grid grid-cols-12 gap-3 py-4 items-center">
                {rightRail.seasonSeries.map((g, i) => (
                  <Link href={`/game/${g.id}`} key={i} className={`col-span-12 lg:col-span-6 p-1 mb-1 border rounded ${g.gameState === 'CRIT' ? 'border-red-500' : ''}`}>
                    <div className={`flex justify-between ${g.awayTeam.score < g.homeTeam.score && !gameIsInProgress(g) ? 'opacity-50' : ''}`}>
                      <div className="flex items-center font-bold gap-1">
                        <Image src={g.awayTeam.logo} alt="Logo" height={128} width={128} className="w-8 h-8" />
                        {g.awayTeam.abbrev}
                      </div>
                      <div className="text-lg font-bold">{g.awayTeam.score}</div>
                    </div>
                    <div className={`flex justify-between ${g.awayTeam.score > g.homeTeam.score && !gameIsInProgress(g) ? 'opacity-50' : ''}`}>
                      <div className="flex items-center font-bold gap-1">
                        <Image src={g.homeTeam.logo} alt="Logo" height={128} width={128} className="w-8 h-8" />
                        {g.homeTeam.abbrev}
                      </div>
                      <div className="text-lg font-bold">{g.homeTeam.score}</div>
                    </div>
                    {!['OFF', 'FUT', 'FINAL', 'PRE'].includes(g.gameState) ? (
                      <div className="flex justify-between">
                        <div>
                          <span className="text-xs font-medium px-2 py-1 bg-red-900 text-white rounded mr-1 uppercase">
                            {PERIOD_DESCRIPTORS[g.periodDescriptor?.number]}
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
                            <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-black rounded mr-1 uppercase"> Final</span>
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
      </div>
    </div>
  );
};

export default GamePage;
