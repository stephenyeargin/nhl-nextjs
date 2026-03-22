import React from 'react';
import StandingsSwitcher from '@/app/components/StandingsSwitcher';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagicWandSparkles,
  faSadTear,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';

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

interface PageProps {
  searchParams?: Promise<{ date?: string }>;
}

function getStandingsDate(dateParam?: string): string {
  if (!dateParam) {
    return 'now';
  }

  // Check format YYYY-MM-DD
  const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(dateParam);
  if (!isValidFormat) {
    return 'now';
  }

  // Check if it's a real date
  const parsed = new Date(dateParam);
  if (isNaN(parsed.getTime())) {
    return 'now';
  }

  return dateParam;
}

export default async function StandingsPage({ searchParams }: PageProps) {
  let westernConference: StandingsEntry[] = [];
  let easternConference: StandingsEntry[] = [];
  let errorMessage: string | null = null;

  const resolvedSearchParams = await searchParams;
  const standingsDate = getStandingsDate(resolvedSearchParams?.date);

  try {
    const apiStandings = await fetch(`https://api-web.nhle.com/v1/standings/${standingsDate}`, {
      cache: 'no-store',
    });
    if (!apiStandings.ok) {
      throw new Error('Failed to fetch data');
    }

    const jsonStandings: StandingsApiResponse = await apiStandings.json();

    if (jsonStandings.standings.length === 0) {
      throw new Error('Standings unavailable for selected date.');
    }

    westernConference = jsonStandings.standings.filter((c) => c.conferenceAbbrev === 'W');
    easternConference = jsonStandings.standings.filter((c) => c.conferenceAbbrev === 'E');
  } catch (error: unknown) {
    errorMessage = error instanceof Error ? error.message : 'Failed to fetch data';
  }

  const shouldShowRaceExplainer = [westernConference, easternConference].some(
    (conference) => conference.length > 7 && conference.some((team) => team.gamesPlayed > 60)
  );

  return (
    <div className="container px-2 mb-10 mx-auto">
      <div className="text-3xl font-bold">Standings</div>
      <div className="py-4">
        <StandingsSwitcher
          western={westernConference}
          eastern={easternConference}
          standingsDate={standingsDate}
          hideTables={Boolean(errorMessage)}
        />
      </div>

      {errorMessage && (
        <div className="text-lg py-4">
          <FontAwesomeIcon icon={faTriangleExclamation} /> {errorMessage}
        </div>
      )}

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

      {shouldShowRaceExplainer && (
        <div className="text-xs space-y-1">
          <p className="flex items-center gap-2">
            <FontAwesomeIcon icon={faMagicWandSparkles} fixedWidth />
            <strong>Magic #:</strong> strongest 9th-place max points minus the team&apos;s current
            points, plus 1 (to finish strictly ahead); the team&apos;s points and other teams
            gaining points can move it, and 0 means clinched.
          </p>
          <p className="flex items-center gap-2">
            <FontAwesomeIcon icon={faSadTear} fixedWidth />
            <strong>Tragic #:</strong> the team&apos;s max possible points minus the strongest
            9th-place current points, plus 1 (to stay strictly ahead); the team&apos;s results and
            other teams gaining points can move it, and 0 means eliminated.
          </p>
        </div>
      )}
    </div>
  );
}
