import React from 'react';
import StandingsSwitcher from '@/app/components/StandingsSwitcher';

// ISR: Revalidate standings every 1 hour (3600 seconds)
export const revalidate = 3600;

// Mirror the stricter interface expected by StandingsTable
interface StandingsEntry {
  wildcardSequence: number;
  divisionAbbrev: string;
  divisionSequence: number;
  points: number;
  teamAbbrev: { default: string };
  teamLogo?: string;
  teamName: { default: string };
  clinchIndicator?: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  otLosses: number;
  pointPctg: number;
  regulationWins: number;
  regulationPlusOtWins: number;
  goalFor: number;
  goalAgainst: number;
  goalDifferential: number;
  homeWins: number;
  homeLosses: number;
  homeOtLosses: number;
  roadWins: number;
  roadLosses: number;
  roadOtLosses: number;
  shootoutWins: number;
  shootoutLosses: number;
  l10Wins: number;
  l10Losses: number;
  l10OtLosses: number;
  streakCode?: string;
  streakCount?: number;
  conferenceAbbrev?: string;
  // Allow unknown extra props without encouraging unsafe usage
  [k: string]: unknown;
}

interface StandingsApiResponse {
  standings: StandingsEntry[];
  [k: string]: unknown;
}

export default async function StandingsPage() {
  let westernConference: StandingsEntry[] = [];
  let easternConference: StandingsEntry[] = [];

  try {
    const apiStandings = await fetch('https://api-web.nhle.com/v1/standings/now', {
      cache: 'no-store',
    });
    if (!apiStandings.ok) {
      throw new Error('Failed to fetch data');
    }
    const jsonStandings: StandingsApiResponse = await apiStandings.json();
    westernConference = jsonStandings.standings.filter((c) => c.conferenceAbbrev === 'W');
    easternConference = jsonStandings.standings.filter((c) => c.conferenceAbbrev === 'E');
  } catch (error: any) {
    return (
      <div className="container mx-auto">
        <div className="text-3xl font-bold">Standings</div>
        <div className="text-lg py-2">{error.message}</div>
      </div>
    );
  }

  return (
    <div className="container px-2 mb-10 mx-auto">
      <div className="text-3xl font-bold">Standings</div>
      <div className="py-4">
        <StandingsSwitcher western={westernConference} eastern={easternConference} />
      </div>

      <div className="flex gap-1 my-5">
        <div className="font-bold">Legend:</div>
        <dl className="flex gap-1 align-middle text-xs">
          <dt className="p-1 font-bold">(x)</dt>
          <dd className="p-1">Clinched Playoff spot</dd>
          <dt className="p-1 font-bold">(y)</dt>
          <dd className="p-1">Clinched Division</dd>
          <dt className="p-1 font-bold">(p)</dt>
          <dd className="p-1">Presidents&apos; Trophy</dd>
          <dt className="p-1 font-bold">(z)</dt>
          <dd className="p-1">Clinched Conference</dd>
          <dt className="p-1 font-bold">(e)</dt>
          <dd className="p-1">Eliminated</dd>
        </dl>
      </div>
    </div>
  );
}
