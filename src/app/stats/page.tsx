import React from 'react';
import StatLeaderboard from '@/app/components/StatLeaderboard';
import StatsFilterBar from '@/app/components/StatsFilterBar';
import type { StatsFilterOption } from '@/app/components/StatsFilterBar';
import {
  formatSeason,
  formatStat,
  formatStatValue,
  formatSecondsToGameTime,
} from '@/app/utils/formatters';
import { safeFetchJSON, noStoreInit } from '@/app/utils/fetchers';
import { getAllTeamsByDivision } from '@/app/utils/teamData';
import type { StatsLeaderPlayer, StatsLeaderResponse } from '@/app/types/player';

export const revalidate = 3600;

const FRANCHISE_FETCH_LIMIT = 1000;

interface StatCategory {
  key: string;
  heading: string;
  format?: (value: number) => string;
}

const SKATER_CATEGORIES: StatCategory[] = [
  { key: 'points', heading: 'Points' },
  { key: 'goals', heading: 'Goals' },
  { key: 'assists', heading: 'Assists' },
  {
    key: 'plusMinus',
    heading: 'Plus/Minus',
    format: (value) => String(formatStat(value, 0, 'plusMinus')),
  },
  { key: 'goalsPp', heading: 'Power-Play Goals' },
  { key: 'goalsSh', heading: 'Short-Handed Goals' },
  { key: 'penaltyMins', heading: 'Penalty Minutes' },
  {
    key: 'faceoffLeaders',
    heading: 'Faceoff %',
    format: (value) => String(formatStatValue('faceoffWinningPctg', value)),
  },
  { key: 'toi', heading: 'Time on Ice / Game', format: formatSecondsToGameTime },
];

const GOALIE_CATEGORIES: StatCategory[] = [
  { key: 'wins', heading: 'Wins' },
  { key: 'shutouts', heading: 'Shutouts' },
  { key: 'savePctg', heading: 'Save %', format: (value) => String(formatStat(value, 3)) },
  {
    key: 'goalsAgainstAverage',
    heading: 'Goals Against Average',
    format: (value) => String(formatStat(value, 3)),
  },
];

async function fetchLeaders(
  type: 'skater' | 'goalie',
  category: string,
  season: string,
  gameType: string,
  team: string
): Promise<StatsLeaderPlayer[]> {
  const limit = team === 'all' ? 5 : FRANCHISE_FETCH_LIMIT;

  try {
    const data = await safeFetchJSON<StatsLeaderResponse>(
      `https://api-web.nhle.com/v1/${type}-stats-leaders/${season}/${gameType}?categories=${category}&limit=${limit}`,
      noStoreInit()
    );
    const rows = data?.[category] ?? [];

    return team === 'all' ? rows : rows.filter((row) => row.teamAbbrev === team).slice(0, 5);
  } catch {
    return [];
  }
}

async function fetchCurrentSeason(): Promise<number | null> {
  try {
    const data = await safeFetchJSON<{ standings: { seasonId: number }[] }>(
      'https://api-web.nhle.com/v1/standings/now',
      noStoreInit()
    );

    return data?.standings[0]?.seasonId ?? null;
  } catch {
    return null;
  }
}

async function fetchSeasons(): Promise<string[]> {
  try {
    const [data, currentSeason] = await Promise.all([
      safeFetchJSON<number[]>('https://api-web.nhle.com/v1/season', noStoreInit()),
      fetchCurrentSeason(),
    ]);

    return (data ?? [])
      .filter((season) => !currentSeason || season <= currentSeason)
      .map((season) => season.toString())
      .reverse();
  } catch {
    return [];
  }
}

function getFranchiseOptions(): StatsFilterOption[] {
  const teamsByDivision = getAllTeamsByDivision();
  const franchises = Object.values(teamsByDivision)
    .flat()
    .map((team) => ({ value: team.abbreviation, label: team.name ?? team.abbreviation }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return [{ value: 'all', label: 'All Franchises' }, ...franchises];
}

interface PageProps {
  searchParams?: Promise<{ season?: string; gameType?: string; team?: string }>;
}

export default async function StatsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const availableSeasons = await fetchSeasons();
  const defaultSeason = availableSeasons[0] ?? 'current';

  const season =
    resolvedSearchParams?.season && availableSeasons.includes(resolvedSearchParams.season)
      ? resolvedSearchParams.season
      : defaultSeason;
  const gameType = resolvedSearchParams?.gameType === '3' ? '3' : '2';
  const team = resolvedSearchParams?.team || 'all';

  const seasonOptions: StatsFilterOption[] = availableSeasons.map((value) => ({
    value,
    label: formatSeason(value),
  }));
  const franchiseOptions = getFranchiseOptions();

  const [skaterLeaders, goalieLeaders] = await Promise.all([
    Promise.all(
      SKATER_CATEGORIES.map((category) =>
        fetchLeaders('skater', category.key, season, gameType, team)
      )
    ),
    Promise.all(
      GOALIE_CATEGORIES.map((category) =>
        fetchLeaders('goalie', category.key, season, gameType, team)
      )
    ),
  ]);

  return (
    <div className="container px-2 mb-10 mx-auto">
      <h1 className="text-3xl font-bold">Stat Leaders</h1>

      <div className="my-4">
        <StatsFilterBar
          seasons={seasonOptions}
          franchises={franchiseOptions}
          season={season}
          gameType={gameType}
          team={team}
        />
      </div>

      <h2 className="text-2xl font-bold my-4">Skaters</h2>
      {skaterLeaders.every((rows) => rows.length === 0) ? (
        <p className="text-gray-500">No skater stats available for the selected filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SKATER_CATEGORIES.map((category, index) => (
            <StatLeaderboard
              key={category.key}
              heading={category.heading}
              rows={skaterLeaders[index]}
              format={category.format}
            />
          ))}
        </div>
      )}

      <h2 className="text-2xl font-bold my-4">Goalies</h2>
      {goalieLeaders.every((rows) => rows.length === 0) ? (
        <p className="text-gray-500">No goalie stats available for the selected filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GOALIE_CATEGORIES.map((category, index) => (
            <StatLeaderboard
              key={category.key}
              heading={category.heading}
              rows={goalieLeaders[index]}
              format={category.format}
            />
          ))}
        </div>
      )}
    </div>
  );
}
