'use client';

import React from 'react';
import dayjs from 'dayjs';
import Link from 'next/link.js';
import utc from 'dayjs/plugin/utc';
import PropTypes from 'prop-types';
import { notFound } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faPlayCircle, faTrophy, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { useGameContext } from '@/app/contexts/GameContext.js';
import GameSkeleton from '@/app/components/GameSkeleton.js';
import Headshot from '@/app/components/Headshot';
import GameHeader from '@/app/components/GameHeader.js';
import GamePreview from '@/app/components/GamePreview';
import IceSurface from '@/app/components/IceSurface';
import { PENALTY_TYPES, PENALTY_DESCRIPTIONS, SHOOTOUT_RESULT, GOAL_MODIFIERS } from '@/app/utils/constants';
import PageError from '@/app/components/PageError';
import TeamLogo from '@/app/components/TeamLogo';
import GameSidebar from '@/app/components/GameSidebar';
import GameSubPageNavigation from '@/app/components/GameSubPageNavigation';
import { formatPeriodLabel } from '@/app/utils/formatters';

dayjs.extend(utc);

const GamePage = () => {
  const { gameData, pageError } = useGameContext();

  if (!gameData) {
    return <GameSkeleton />;
  }

  const logos = {};

  // Error handling component
  const handleError = () => {
    if (pageError && pageError.error?.status === 404) {
      notFound();
    }
    
    return (
      <PageError pageError={pageError} handleRetry={() => {}} />
    );
  };

  // If error, handle
  if (pageError) {
    return handleError();
  }

  // Destructure data for rendering
  const { homeTeam, awayTeam, summary, matchup, game } = gameData;

  // Update logo map
  logos[homeTeam.abbrev] = homeTeam.logo;
  logos[awayTeam.abbrev] = awayTeam.logo;

  return (
    <div className="container mx-auto">
      <GameHeader game={game} />

      <GameSubPageNavigation game={game} />
      
      <div className="grid grid-cols-4 gap-10">
        <div className="col-span-4 md:col-span-3">
          {matchup && (
            <GamePreview game={game} />
          )}
          {summary && (
            <div>
              <IceSurface game={game} />

              <div className="text-3xl font-bold underline my-4">Game Summary</div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold my-3">Scoring Summary</h3>
                {summary.scoring.map((period, index) => (
                  <div key={index} className="mb-2">
                    <h4 className="font-semibold">{formatPeriodLabel({ ...game.periodDescriptor, number: period.periodDescriptor.number }, true)}</h4>
                    {period.periodDescriptor.periodType === 'SO' ? (
                      <>
                        {game.summary?.shootout.length === 0 && (
                          <p className="text-slate-500">No shots taken.</p>
                        )}
                        {game.summary?.shootout.map((shot) => (
                          <div key={shot.sequence} className="border grid grid-cols-12 gap-2 my-5 p-2">
                            <div className="col-span-12 flex">
                              <Headshot
                                playerId={shot.playerId}
                                src={shot.headshot}
                                alt={`${shot.firstName} ${shot.lastName}`}
                                size="4"
                                className="mr-2"
                              />
                              <div className="grow">
                                <span className="font-bold">
                                  {shot.playerId ? (
                                    <Link href={`/player/${shot.playerId}`}>{shot.firstName} {shot.lastName}</Link>
                                  ) : (
                                    <>Unnamed</>
                                  )}
                                </span>
                                <div className="col-span-10 flex">
                                  <TeamLogo
                                    src={logos[shot.teamAbbrev]}
                                    alt="Logo"
                                    className="w-8 h-8 mr-2"
                                  />
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
                                playerId={goal.playerId}
                                src={goal.headshot}
                                alt={`${goal.firstName.default} ${goal.lastName.default}`}
                                size="4"
                                className="mr-2"
                              />
                              <div>
                                <span className="font-bold">
                                  <Link href={`/player/${goal.playerId}`}>{goal.firstName.default} {goal.lastName.default}</Link> ({goal.goalsToDate})
                                </span>
                                {goal.strength !== 'ev' && (
                                  <span className="rounded text-xs ml-2 text-white bg-red-900 p-1 uppercase">{goal.strength}G</span>
                                )}
                                {goal.goalModifier !== 'none' && (
                                  <span className="rounded text-xs ml-2 text-white bg-blue-900 p-1 uppercase" title={GOAL_MODIFIERS[goal.goalModifier]?.title}>{GOAL_MODIFIERS[goal.goalModifier]?.label}</span>
                                )}
                                <br />
                                <div className="flex items-center">
                                  <TeamLogo
                                    src={logos[goal.teamAbbrev.default]}
                                    alt="Logo"
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
                                <Link href={goal.highlightClipSharingUrl} rel="noopener noreferrer">
                                  <FontAwesomeIcon icon={faPlayCircle} size="2x" className="align-middle mr-2 md:mr-0" />
                                  <span className="md:hidden">Watch Highlight</span>
                                </Link>
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
                        {formatPeriodLabel({...game.periodDescriptor, number: index + 1}, true)}
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
                                    <TeamLogo
                                      src={logos[penalty.teamAbbrev.default]}
                                      alt="Logo"
                                      className="w-10 h-10 mr-2"
                                    />
                                    <div>
                                      <div className="font-bold">
                                        {penalty.committedByPlayer || penalty.teamAbbrev.default}
                                      </div>
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
                              playerId={p.playerId}
                              src={p.headshot}
                              alt={p.name.default}
                              size="8"
                              className="mx-auto mb-2"
                            />
                          </div>
                          <h4 className="font-semibold">
                            <Link href={`/player/${p.playerId}`}>{p.name.default}</Link></h4>
                          <p className="text-sm">#{p.sweaterNo} • {p.teamAbbrev} • {p.position}</p>
                          {Object.prototype.hasOwnProperty.call(p, 'goals') ? (
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
          <GameSidebar />
        </div>
      </div>
    </div>
  );
};

GamePage.propTypes = {
  params: PropTypes.object.isRequired,
};

export default GamePage;
