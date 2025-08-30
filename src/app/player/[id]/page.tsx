'use client';

import React, { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Headshot from '@/app/components/Headshot';
import {
  formatStat,
  formatSeason,
  formatOrdinalNumber,
  formatLocalizedDate,
  formatTextColorByBackgroundColor,
  formatHeadTitle,
} from '@/app/utils/formatters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faTrophy, faUser } from '@fortawesome/free-solid-svg-icons';
import { getTeamDataByAbbreviation } from '@/app/utils/teamData';
import TeamLogo from '@/app/components/TeamLogo';
import GameBodySkeleton from '@/app/components/GameBodySkeleton';
import LeagueToggle from '@/app/components/LeagueToggle';
import StoryCard from '@/app/components/StoryCard';
import PlayerDropdown from '@/app/components/PlayerDropdown';
import statsStyles from '@/app/components/StatsTable.module.scss';
import ContentCustomEntity from '@/app/components/ContentCustomEntity';
import { STAT_CONTEXT } from '@/app/utils/constants';
import LoadMoreButton from '@/app/components/LoadMoreButton';
import ContentPhoto from '@/app/components/ContentPhoto';
import { StoryItem, PaginatedContentResponse, LocalizedString } from '@/app/types/content';

// --- Domain Types (partial shapes focusing on accessed fields) ---
interface DraftDetails {
  round?: number;
  pickInRound?: number;
  overallPick?: number;
  year?: number;
  teamAbbrev?: string;
}
// Stats container; dynamic keys for various stat metrics (numbers) while preserving known fields
interface PlayerSeasonTotals {
  season: string | number;
  leagueAbbrev: string;
  gameTypeId: number; // 2 regular, 3 playoffs
  teamName?: LocalizedString;
  // Dynamically keyed stat metrics (goalie or skater); values numeric or undefined
  [stat: string]: string | number | LocalizedString | undefined;
}
interface PlayerGameSummary {
  gameId: string | number;
  gameDate: string;
  homeRoadFlag: 'H' | 'A';
  teamAbbrev: string;
  opponentAbbrev: string;
  [k: string]: unknown;
}
interface PlayerBadge {
  logoUrl: LocalizedString;
  title: LocalizedString;
}
interface PlayerFeaturedStatsSubSeason {
  [stat: string]: number | undefined;
}
interface PlayerFeaturedStats {
  season?: string | number;
  regularSeason?: { subSeason?: PlayerFeaturedStatsSubSeason };
  playoffs?: { subSeason?: PlayerFeaturedStatsSubSeason };
  [k: string]: unknown;
}
interface PlayerCareerTotals {
  regularSeason?: Record<string, number>;
  playoffs?: Record<string, number>;
}
interface PlayerAwardSeason {
  seasonId: string | number;
  [k: string]: unknown;
}
interface PlayerAward {
  trophy: LocalizedString;
  seasons: PlayerAwardSeason[];
  [k: string]: unknown;
}
interface PlayerPhoto {
  [k: string]: unknown;
}
interface PlayerEntityContent {
  _entityId: string | number;
  fields?: { biography?: unknown };
  [k: string]: unknown;
}

interface PlayerLandingResponse {
  playerId: number | string;
  firstName: LocalizedString;
  lastName: LocalizedString;
  heightInInches: number;
  weightInPounds: number;
  birthDate: string;
  birthCity: LocalizedString;
  birthStateProvince?: LocalizedString;
  birthCountry?: string;
  badges: PlayerBadge[];
  shootsCatches?: string;
  draftDetails?: DraftDetails;
  sweaterNumber?: number | string;
  currentTeamAbbrev: string;
  position: string;
  headshot?: string;
  teamLogo?: string;
  heroImage?: string;
  seasonTotals: PlayerSeasonTotals[];
  last5Games?: PlayerGameSummary[];
  featuredStats?: PlayerFeaturedStats;
  careerTotals?: PlayerCareerTotals;
  awards?: PlayerAward[];
  isActive?: boolean;
  currentTeamRoster?: unknown[];
  [k: string]: unknown;
}

interface PlayerNewsResponse extends PaginatedContentResponse<StoryItem> {}

const SEASON_TYPES: Record<number, 'regularSeason' | 'playoffs'> = {
  2: 'regularSeason',
  3: 'playoffs',
};

const statHeaders = [
  { key: 'gamesPlayed', label: 'GP', title: 'Games Played' },
  { key: 'gamesStarted', label: 'GS', title: 'Games Started', unit: 'start' },
  { key: 'decision', label: 'D', title: 'Decision' },
  { key: 'wins', label: 'W', title: 'Wins' },
  { key: 'losses', label: 'L', title: 'Losses' },
  { key: 'otLosses', label: 'OT', title: 'Overtime Losses', altKey: 'overtimeLosses' },
  { key: 'shotsAgainst', label: 'SA', title: 'Shots Against' },
  { key: 'saves', label: 'SV', title: 'Saves' },
  { key: 'goalsAgainst', label: 'GA', title: 'Goals Against' },
  {
    key: 'savePctg',
    label: 'SV%',
    title: 'Save Percentage',
    altKey: 'savePercentage',
    precision: 3,
  },
  {
    key: 'goalsAgainstAvg',
    label: 'GAA',
    title: 'Goals Against Average',
    altKey: 'goalsAgainstAverage',
    precision: 3,
  },
  { key: 'shutouts', label: 'SO', title: 'Shutouts' },
  { key: 'goals', label: 'G', title: 'Goals Scored' },
  { key: 'assists', label: 'A', title: 'Assists' },
  { key: 'points', label: 'P', title: 'Points' },
  { key: 'plusMinus', label: '+/-', title: 'Plus/Minus' },
  { key: 'pim', label: 'PIM', title: 'Penalty Minutes', altKey: 'penaltyMinutes' },
  { key: 'powerPlayGoals', label: 'PPG', title: 'Power Play Goals' },
  { key: 'gameWinningGoals', label: 'GWG', title: 'Game-Winning Goals' },
  { key: 'shots', label: 'S', title: 'Shots on Goal', altKey: 'sog' },
  { key: 'hits', label: 'H', title: 'Hits' },
  { key: 'shifts', label: 'SH', title: 'Shifts' },
  { key: 'takeaways', label: 'TA', title: 'Takeaways' },
  { key: 'giveaways', label: 'GA', title: 'Giveaways' },
  { key: 'avgTimeOnIce', label: 'TOI/G', title: 'Time On Ice per Game' },
  {
    key: 'FOW%',
    label: 'FO%',
    title: 'Faceoff Win Percentage',
    altKey: 'faceoffWinningPctg',
    precision: 3,
  },
  { key: 'powerPlayPoints', label: 'PPP', title: 'Power Play Points' },
  { key: 'shootingPctg', label: 'S%', title: 'Shooting Percentage', precision: 3 },
  { key: 'shorthandedGoals', label: 'SHG', title: 'Shorthanded Goals' },
  { key: 'shorthandedPoints', label: 'SHP', title: 'Shorthanded Points' },
  { key: 'S', label: 'S', title: 'Shots' },
  { key: 'timeOnIce', label: 'TOI', title: 'Time On Ice', altKey: 'toi' },
] as const;

type StatHeader = (typeof statHeaders)[number];

// Helper narrow functions for optional properties (runtime presence varies per header)
function getAltKey(h: StatHeader): string | undefined {
  return (h as any).altKey;
}
function getPrecision(h: StatHeader): number | undefined {
  return (h as any).precision;
}
function getUnit(h: StatHeader): string | undefined {
  return (h as any).unit;
}

export default function PlayerPage() {
  const { id } = useParams<{ id: string }>();
  const filteredId = id.replace(/[a-z-]/gi, '');

  const [player, setPlayer] = useState<PlayerLandingResponse | null>(null);
  const [photoOffset, setPhotoOffset] = useState(0);
  const [hasMorePhotos, setHasMorePhotos] = useState(true);
  const [playerContent, setPlayerContent] = useState<PaginatedContentResponse<PlayerEntityContent>>(
    { items: [] }
  );
  const [playerNews, setPlayerNews] = useState<PlayerNewsResponse>({ items: [] });
  const [playerPhotos, setPlayerPhotos] = useState<PlayerPhoto[]>([]);
  const [activeLeague, setActiveLeague] = useState<'nhl' | 'other'>('nhl');
  const [seasonType, setSeasonType] = useState<2 | 3>(2); // [2: Regular season, 3: Post-season]

  useEffect(() => {
    const fetchPlayer = async () => {
      const playerResponse = await fetch(`/api/nhl/player/${filteredId}/landing`, {
        cache: 'no-store',
      });
      if (!playerResponse.ok) {
        return notFound();
      }
      const playerData: PlayerLandingResponse = await playerResponse.json();
      setPlayer(playerData);

      const playerContentResponse = await fetch(
        `https://forge-dapi.d3.nhle.com/v2/content/en-us/players?tags.slug=playerid-${playerData.playerId}`,
        { cache: 'no-store' }
      );
      const playerContentJson: PaginatedContentResponse<PlayerEntityContent> =
        await playerContentResponse.json();
      setPlayerContent(playerContentJson);

      const topStoriesResponse = await fetch(
        `https://forge-dapi.d3.nhle.com/v2/content/en-us/stories?tags.slug=playerid-${playerData.playerId}&context.slug=nhl&$limit=4`,
        { cache: 'no-store' }
      );
      const topStoriesJson: PlayerNewsResponse = await topStoriesResponse.json();
      setPlayerNews(topStoriesJson);

      const photosResponse = await fetch(
        `https://forge-dapi.d3.nhle.com/v2/content/en-us/photos/?tags.slug=playerid-${playerData.playerId}&$skip=${photoOffset}&$limit=8`,
        { cache: 'no-store' }
      );
      const photosJson: PaginatedContentResponse<PlayerPhoto> = await photosResponse.json();
      setPlayerPhotos((prevPhotos) => [...prevPhotos, ...photosJson.items]);

      if (!photosJson.pagination?.nextUrl) {
        setHasMorePhotos(false);
      }

      formatHeadTitle(
        `${playerData.firstName?.default} ${playerData.lastName?.default} | #${playerData.sweaterNumber} | ${playerData.position}`
      );
    };

    fetchPlayer();
  }, [filteredId, photoOffset]);

  // Loading state
  if (!player) {
    return <GameBodySkeleton />;
  }

  const {
    firstName,
    lastName,
    heightInInches,
    weightInPounds,
    birthDate,
    birthCity,
    birthStateProvince,
    birthCountry,
    badges,
    shootsCatches,
    draftDetails,
    sweaterNumber,
    currentTeamAbbrev,
    position,
    headshot,
    teamLogo,
    seasonTotals,
    last5Games,
    featuredStats,
    careerTotals,
    awards,
    isActive,
  } = player;

  const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
  const formattedHeight = `${Math.floor(heightInInches / 12)}′${heightInInches % 12}″`;
  const formattedWeight = `${weightInPounds} lb`;
  const formattedBirthDate = new Date(birthDate).toLocaleDateString();

  let draft: React.ReactNode = 'Undrafted';
  if (draftDetails) {
    const formattedRound = formatOrdinalNumber(draftDetails?.round);
    const formattedPickInRound = formatOrdinalNumber(draftDetails?.pickInRound);
    const formattedOverallPick = formatOrdinalNumber(draftDetails?.overallPick);
    draft = (
      <>
        {draftDetails.year}, {draftDetails.teamAbbrev} ({formattedOverallPick} overall),{' '}
        {formattedRound} round, {formattedPickInRound} pick
      </>
    );
  }

  const renderStatBox = (stat: string, value: number | string | undefined) => {
    const statMeta = statHeaders.find((s) => s.key === stat || getAltKey(s) === stat) as any;
    const title = statMeta?.title ?? stat;
    const precision = getPrecision(statMeta) ?? 0;

    return (
      <div
        key={stat}
        className="p-2 bg-transparent text-center border rounded content-center"
        style={{ minWidth: '7rem' }}
      >
        <div className="text-2xl capitalize">{formatStat(value, precision)}</div>
        <div className="text-xs font-light">{title}</div>
      </div>
    );
  };

  // Current team if present
  const team = getTeamDataByAbbreviation(player.currentTeamAbbrev, true);
  let headerColorClass = 'bg-slate-200 dark:bg-slate-800';
  let headerStyle: React.CSSProperties = {};
  if (team && team.teamColor) {
    headerColorClass = '';
    headerStyle = {
      backgroundColor: team.teamColor,
      color: formatTextColorByBackgroundColor(team.teamColor),
    };
  }

  const nhlStats = seasonTotals.filter(
    (l) => l.leagueAbbrev === 'NHL' && l.gameTypeId === seasonType
  );
  const otherLeagueStats = seasonTotals.filter(
    (l) => l.leagueAbbrev !== 'NHL' && l.gameTypeId === seasonType
  );

  const renderStatsTable = ({
    stats,
    showLeague,
  }: {
    stats: PlayerSeasonTotals[];
    showLeague: boolean;
  }) => {
    return (
      <div className="overflow-x-auto">
        <table className={statsStyles.statsTable}>
          <thead>
            <tr className={`text-xs border ${headerColorClass}`}>
              <th className={'p-2 text-center'} style={headerStyle}>
                Season
              </th>
              <th className={'p-2 text-left'} style={headerStyle}>
                Team
              </th>
              {showLeague && (
                <th className={'p-2 text-left'} style={headerStyle}>
                  League
                </th>
              )}
              {statHeaders.map((h) => {
                const key = h.key;
                const label = h.label;
                const title = (h as any).title;
                const altKey = getAltKey(h);
                const statExists = seasonTotals.some(
                  (season) =>
                    Object.prototype.hasOwnProperty.call(season, key) ||
                    (altKey && Object.prototype.hasOwnProperty.call(season, altKey))
                );
                if (!statExists) {
                  return null;
                }

                return (
                  <th
                    key={key}
                    className={`p-2 text-center ${headerColorClass}`}
                    style={headerStyle}
                  >
                    <abbr className="underline decoration-dashed" title={title}>
                      {label}
                    </abbr>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {stats.map((season, i) => (
              <tr key={i} className={`${i % 2 ? 'bg-slate-500/10' : ''}`}>
                <td className="p-2 border text-center">{formatSeason(season.season)}</td>
                <td className="">
                  <div className="flex gap-1 items-center">
                    {season.leagueAbbrev === 'NHL' && (
                      <TeamLogo
                        team={season.teamName?.default}
                        className="h-8 w-8 hidden md:block"
                        alt={String(season.teamName?.default || '')}
                      />
                    )}
                    {season.teamName?.default}
                  </div>
                </td>
                {showLeague && <td className="text-left">{season.leagueAbbrev}</td>}
                {statHeaders.map((h) => {
                  const key = h.key;
                  const altKey = getAltKey(h);
                  const precision = getPrecision(h);
                  const hasKey = Object.prototype.hasOwnProperty.call(season, key);
                  const hasAlt = altKey && Object.prototype.hasOwnProperty.call(season, altKey);
                  if (!hasKey && !hasAlt) {
                    return null;
                  }
                  const primaryVal = season[key];
                  const altVal = altKey ? season[altKey] : undefined;
                  const value =
                    typeof primaryVal === 'number' || typeof primaryVal === 'string'
                      ? primaryVal
                      : typeof altVal === 'number' || typeof altVal === 'string'
                        ? altVal
                        : undefined;
                  if (value === undefined) {
                    return <td key={key} className="p-2 border text-center text-xs" />;
                  }

                  return (
                    <td key={key} className="p-2 border text-center text-xs">
                      {formatStat(value as any, precision)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const handleChangeLeagues = (league: 'nhl' | 'other') => {
    setActiveLeague(league);
  };

  const handleLoadMoreButton = () => {
    setPhotoOffset(photoOffset + 8);
  };

  return (
    <div className="container pb-10 px-2 mx-auto">
      <div className="flex flex-wrap justify-center md:justify-between items-center mb-2">
        <div className="text-2xl md:text-4xl my-4 flex flex-wrap items-center">
          <span className="px-3 border-r">
            {firstName.default} <span className="font-bold">{lastName.default}</span>
          </span>
          {teamLogo && (
            <span className="px-3 border-r">
              <TeamLogo
                team={currentTeamAbbrev}
                src={teamLogo}
                alt={currentTeamAbbrev}
                className="h-10 w-10"
              />
            </span>
          )}
          <span className="px-3 border-r">#{sweaterNumber}</span>
          <span className="px-3">{position}</span>
        </div>
        <div>
          {player.currentTeamRoster && (
            <PlayerDropdown
              players={player.currentTeamRoster as any}
              activePlayer={player.playerId}
            />
          )}
        </div>
      </div>

      <div className="relative w-auto">
        <Image
          src={player.heroImage as string}
          alt={`${firstName.default} ${lastName.default}`}
          width={1080}
          height={960}
          className="w-full h-full lg:object-cover"
        />
        <div className="block lg:absolute bottom-0 w-full bg-black bg-opacity-100 lg:bg-opacity-60 text-white p-8">
          <div className="grid grid-cols-12">
            <div className="col-span-12 lg:col-span-5">
              <div className="flex flex-flow gap-2 items-center text-white">
                <div className="grow">
                  <Headshot
                    playerId={player.playerId}
                    src={headshot}
                    alt={`Headshot of ${firstName.default} ${lastName.default}`}
                    size={8}
                    className="w-100 mx-auto"
                    team={currentTeamAbbrev}
                  />
                </div>
                <div className="text-sm px-4">
                  <dl className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                    <dt className="col-span-1 font-bold">Height:</dt>
                    <dd className="col-span-2">{formattedHeight}</dd>
                    <dt className="col-span-1 font-bold col">Weight:</dt>
                    <dd className="col-span-2">{formattedWeight}</dd>
                    <dt className="col-span-1 font-bold col">Born:</dt>
                    <dd className="col-span-2">
                      {formattedBirthDate} {isActive && <> (Age: {age})</>}
                    </dd>
                    <dt className="col-span-1 font-bold col">Birthplace:</dt>
                    <dd className="col-span-2">
                      {birthStateProvince ? (
                        <>
                          {birthCity.default}, {birthStateProvince?.default}, {birthCountry}
                        </>
                      ) : (
                        <>
                          {birthCity.default}, {birthCountry}
                        </>
                      )}
                    </dd>
                    <dt className="col-span-1 font-bold col">
                      {position !== 'G' ? 'Shoots' : 'Catches'}:
                    </dt>
                    <dd className="col-span-2">{shootsCatches}</dd>
                    <dt className="col-span-1 font-bold col">Draft:</dt>
                    <dd className="col-span-2">{draft}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-7 relative">
              <div className="relative md:absolute md:right-5 md:-top-20 py-5 flex gap-5">
                {badges.length > 0 &&
                  badges.map((badge, i) => (
                    <div key={i}>
                      <Image
                        src={badge.logoUrl.default as string}
                        alt={badge.title.default as string}
                        title={badge.title.default as string}
                        width={1024}
                        height={1024}
                        className="w-20 h-20"
                      />
                    </div>
                  ))}
              </div>
              {featuredStats?.season && seasonType === 2 && (
                <div className="my-1 text-xl font-bold">{formatSeason(featuredStats.season)}</div>
              )}
              {featuredStats?.[SEASON_TYPES[seasonType]]?.subSeason && (
                <div className="gap-2 flex flex-nowrap overflow-x-auto scrollbar-hidden">
                  {statHeaders.map((stat) => {
                    const val = featuredStats?.[SEASON_TYPES[seasonType]]?.subSeason?.[stat.key];
                    if (val === undefined) {
                      return null;
                    }

                    return renderStatBox(stat.key, val);
                  })}
                </div>
              )}
              {careerTotals && (
                <div className="my-1 text-xl font-bold">
                  {seasonType === 3 ? 'Career Playoffs' : 'Career Regular Season'}
                </div>
              )}
              {careerTotals?.[SEASON_TYPES[seasonType]] ? (
                <div className="gap-2 flex flex-nowrap overflow-x-auto scrollbar-hidden">
                  {statHeaders.map((stat) => {
                    const val = careerTotals?.[SEASON_TYPES[seasonType]]?.[stat.key];
                    if (val === undefined) {
                      return null;
                    }

                    return renderStatBox(stat.key, val);
                  })}
                </div>
              ) : (
                <>
                  No NHL statistics recorded for {seasonType === 3 ? 'playoffs' : 'regular season'}.
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {playerContent.items.length > 0 && !!playerContent.items[0].fields?.biography && (
        <details className="mb-5 p-5 border border-t-0" id="biography">
          <summary className="text-2xl font-bold my-1 cursor-pointer">
            <FontAwesomeIcon icon={faNewspaper} fixedWidth /> Player Bio
          </summary>
          <hr className="my-5" />
          {playerContent.items.map((item) => (
            <ContentCustomEntity key={item._entityId} part={item as any} />
          ))}
        </details>
      )}

      <div className="my-5 flex justify-center gap-5 items-center">
        <div className="text-xs font-bold">
          <FontAwesomeIcon icon={faUser} fixedWidth className="mr-1" />
          <Link href={`https://www.nhl.com/player/${player.playerId}`} className="underline">
            NHL.com Player Profile
          </Link>
        </div>
      </div>

      {playerNews.items?.length > 0 && (
        <div className="my-5">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold mb-4">Latest News</h1>
            <Link className="block text-sm" href={`/news/topic/playerid-${player.playerId}`}>
              <FontAwesomeIcon icon={faNewspaper} fixedWidth />{' '}
              <span className="font-bold underline">Player News</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
            {playerNews.items.map((item) => (
              <div key={item._entityId} className="col-span-4 md:col-span-1">
                <StoryCard item={item} showDate />
              </div>
            ))}
          </div>
        </div>
      )}

      {last5Games && last5Games.length > 0 && (
        <div className="my-5">
          <div className="text-3xl font-bold my-3">{STAT_CONTEXT['last_5_games']}</div>
          <div className="overflow-x-auto">
            <table className="text-sm w-full">
              <thead>
                <tr className={`text-xs border ${headerColorClass}`} style={headerStyle}>
                  <th className="p-2 text-center w-10">Date</th>
                  <th className="p-2 text-left">Opponent</th>
                  {statHeaders.map((h) => {
                    const key = h.key;
                    const altKey = getAltKey(h);
                    const title = (h as any).title;
                    const label = h.label;
                    const show =
                      Object.prototype.hasOwnProperty.call(last5Games[0], key) ||
                      (altKey && Object.prototype.hasOwnProperty.call(last5Games[0], altKey));
                    if (!show) {
                      return null;
                    }

                    return (
                      <th key={key} className="p-2 text-center">
                        <abbr className="underline decoration-dashed" title={title}>
                          {label}
                        </abbr>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {last5Games.map((g, i) => (
                  <tr key={i} className={`${i % 2 ? 'bg-slate-500/10' : ''}`}>
                    <td className="p-2 border text-center">{formatLocalizedDate(g.gameDate)}</td>
                    <td className="p-2 border text-left">
                      <div className="font-bold">
                        {g.homeRoadFlag !== 'H' ? (
                          <div className="flex items-center gap-2">
                            <TeamLogo
                              team={g.teamAbbrev}
                              className="hidden md:block h-8 w-8"
                              alt={g.teamAbbrev}
                            />
                            <Link href={`/game/${g.gameId}`} className="font-bold underline">
                              {g.teamAbbrev}@{g.opponentAbbrev}
                            </Link>
                            <TeamLogo
                              team={g.opponentAbbrev}
                              className="hidden md:block h-8 w-8"
                              alt={g.opponentAbbrev}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <TeamLogo
                              team={g.opponentAbbrev}
                              className="hidden md:block h-8 w-8"
                              alt={g.opponentAbbrev}
                            />
                            <Link href={`/game/${g.gameId}`} className="font-bold underline">
                              {g.opponentAbbrev}@{g.teamAbbrev}
                            </Link>
                            <TeamLogo
                              team={g.teamAbbrev}
                              className="hidden md:block h-8 w-8"
                              alt={g.teamAbbrev}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    {statHeaders.map((h) => {
                      const key = h.key;
                      const altKey = getAltKey(h);
                      const precision = getPrecision(h);
                      const unit = getUnit(h);
                      const show =
                        Object.prototype.hasOwnProperty.call(last5Games[0], key) ||
                        (altKey && Object.prototype.hasOwnProperty.call(last5Games[0], altKey));
                      if (!show) {
                        return null;
                      }

                      return (
                        <td key={key} className="p-2 border text-center text-xs">
                          {g[key] !== undefined &&
                          (typeof g[key] === 'number' || typeof g[key] === 'string') ? (
                            <>{formatStat(g[key] as any, precision, unit)}</>
                          ) : altKey &&
                            g[altKey] !== undefined &&
                            (typeof g[altKey] === 'number' || typeof g[altKey] === 'string') ? (
                            <>{formatStat(g[altKey] as any, precision, unit)}</>
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {seasonTotals && (
        <div id="seasonTotals">
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold my-3">
              {seasonType === 2 ? 'Season Totals' : 'Playoff Totals'}
            </div>
            <div className="text-sm">
              <button
                className={`p-2 border border-e-0 rounded-l-md ${seasonType === 2 ? headerColorClass : ''}`}
                style={seasonType === 2 ? headerStyle : undefined}
                onClick={() => setSeasonType(2)}
              >
                Regular Season
              </button>
              <button
                className={`p-2 border border-s-0 rounded-r-md ${seasonType === 3 ? headerColorClass : ''}`}
                style={seasonType === 3 ? headerStyle : undefined}
                onClick={() => setSeasonType(3)}
              >
                Playoffs
              </button>
            </div>
            {nhlStats.length > 0 && otherLeagueStats.length > 0 && (
              <LeagueToggle
                handleChangeLeagues={handleChangeLeagues}
                activeLeague={activeLeague}
                activeColor={team.teamColor}
              />
            )}
          </div>
          {nhlStats.length > 0 && (
            <div
              className={
                otherLeagueStats.length === 0 || activeLeague === 'nhl' ? 'block' : 'hidden'
              }
            >
              {renderStatsTable({ stats: nhlStats, showLeague: false })}
            </div>
          )}
          {otherLeagueStats.length > 0 && (
            <div className={nhlStats.length === 0 || activeLeague === 'other' ? 'block' : 'hidden'}>
              {renderStatsTable({ stats: otherLeagueStats, showLeague: true })}
            </div>
          )}
          {nhlStats.length === 0 && otherLeagueStats.length === 0 && (
            <div className="my-4 text-gray-500">No statistics available.</div>
          )}
        </div>
      )}

      {awards && awards.length > 0 && (
        <div className="my-5">
          <div className="text-3xl font-bold my-3">Awards</div>
          <div className="">
            {awards.map((a) => (
              <div key={a.trophy.default} className="py-4 border-t first:border-t-0">
                <div className="py-4 text-2xl font-bold text-left">
                  <FontAwesomeIcon icon={faTrophy} fixedWidth /> {a.trophy.default}
                </div>
                {a.seasons.map((s, i) => (
                  <div key={s.seasonId} className={i % 2 ? 'p-1 bg-slate-500/10' : 'p-1'}>
                    <div className="my-2 grid grid-cols-4 md:grid-cols-8 gap-2 justify-between items-center">
                      <div className="col-span-1 text-center row-span-3 md:row-span-2 font-bold">
                        {formatSeason(s.seasonId)}
                      </div>
                      {statHeaders.map((stat) => {
                        const val = (s as any)[stat.key];
                        if (val === undefined) {
                          return null;
                        }

                        return (
                          <div key={stat.key} className="col-span-1">
                            {renderStatBox(stat.key, val)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {playerPhotos?.length > 0 && (
        <div className="my-5">
          <div className="text-3xl font-bold my-3">Photos</div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {playerPhotos.map((item, i) => (
              <div key={i} className="col-span-4 md:col-span-1">
                <ContentPhoto part={item as any} />
              </div>
            ))}
          </div>
          {hasMorePhotos && <LoadMoreButton handleClick={handleLoadMoreButton} />}
        </div>
      )}
    </div>
  );
}
