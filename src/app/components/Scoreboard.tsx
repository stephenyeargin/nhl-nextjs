import React from 'react';
import TeamLogo from './TeamLogo';
import { formatPeriodLabel } from '../utils/formatters';
import type { PeriodDescriptor } from '@/app/types/game';

interface TeamInfoLite {
  logo?: string;
  abbrev: string;
}

interface ScoreboardPeriodDescriptor extends PeriodDescriptor {
  number: number;
}

interface GameForScoreboard {
  periodDescriptor: ScoreboardPeriodDescriptor;
  regPeriods: number;
  awayTeam: TeamInfoLite;
  homeTeam: TeamInfoLite;
}

interface LineScorePeriod {
  periodDescriptor: { number: number };
  away: number;
  home: number;
}

interface LineScoreTotals {
  away: number;
  home: number;
}

interface LineScore {
  byPeriod: LineScorePeriod[];
  totals: LineScoreTotals;
}

interface ScoreboardProps {
  game: GameForScoreboard;
  linescore: LineScore;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ game, linescore }) => {
  const totalPeriods =
    game.periodDescriptor?.number < game.regPeriods
      ? game.regPeriods
      : game.periodDescriptor?.number;

  // Helper function to determine if a period is an overtime period with no scores
  const isEmptyOvertime = (period: LineScorePeriod) => {
    return (
      period.periodDescriptor.number > game.regPeriods && // Check if it's overtime
      period.away === 0 &&
      period.home === 0 // Both teams did not score
    );
  };

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border">
          <th className="w-3/12 bg-slate-200 dark:bg-slate-800 p-2"></th>
          {Array.from({ length: totalPeriods }).map((_, index) => {
            const periodNumber = index + 1;
            const period = linescore.byPeriod.find(
              (p) => p.periodDescriptor.number === periodNumber
            );

            // Skip rendering period column for empty overtime periods
            if (period && isEmptyOvertime(period)) {
              return null;
            }

            return (
              <th
                className="w-1/12 text-center bg-slate-200 dark:bg-slate-800 p-2"
                key={`period-${periodNumber}`}
              >
                {formatPeriodLabel({ ...game.periodDescriptor, number: periodNumber })}
              </th>
            );
          })}
          <th className="w-1/12 text-center bg-slate-200 dark:bg-slate-800 p-2">T</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-2 text-center border">
            <div className="flex flex-wrap items-center gap-1">
              <TeamLogo
                src={game.awayTeam.logo}
                team={game.awayTeam.abbrev}
                className="w-10"
                alt="Logo"
              />
              <div className="font-bold">{game.awayTeam.abbrev}</div>
            </div>
          </td>
          {Array.from({ length: totalPeriods }).map((_, index) => {
            const periodNumber = index + 1;
            const period = linescore.byPeriod.find(
              (p) => p.periodDescriptor.number === periodNumber
            );

            // Skip rendering the score for empty overtime periods
            if (period && isEmptyOvertime(period)) {
              return null;
            }

            return (
              <td className="text-center border p-2" key={periodNumber}>
                {period ? period.away : '-'}
              </td>
            );
          })}
          <td className="text-center border p-2 font-bold">{linescore.totals.away}</td>
        </tr>
        <tr>
          <td className="p-2 text-center border">
            <div className="flex flex-wrap items-center gap-1">
              <TeamLogo
                src={game.homeTeam.logo}
                team={game.homeTeam.abbrev}
                className="w-10"
                alt="Logo"
              />
              <div className="font-bold">{game.homeTeam.abbrev}</div>
            </div>
          </td>
          {Array.from({ length: totalPeriods }).map((_, index) => {
            const periodNumber = index + 1;
            const period = linescore.byPeriod.find(
              (p) => p.periodDescriptor.number === periodNumber
            );

            // Skip rendering the score for empty overtime periods
            if (period && isEmptyOvertime(period)) {
              return null;
            }

            return (
              <td className="text-center border" key={periodNumber}>
                {period ? period.home : '-'}
              </td>
            );
          })}
          <td className="text-center border p-2 font-bold">{linescore.totals.home}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Scoreboard;
