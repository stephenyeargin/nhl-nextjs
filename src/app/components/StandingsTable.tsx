import React from 'react';
import Link from 'next/link';
import TeamLogo from '@/app/components/TeamLogo';
import { formatStat } from '@/app/utils/formatters';
import type { LocalizedString } from '@/app/types/content';

import '@/app/assets/datatables.css';
import styles from '@/app/components/StandingsTable.module.scss';

interface StandingsEntry {
  wildcardSequence: number;
  divisionAbbrev: string;
  divisionSequence: number;
  points: number;
  teamAbbrev: LocalizedString;
  teamLogo?: string;
  teamName: LocalizedString;
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
}

interface StandingsTableProps {
  standings: StandingsEntry[];
}

const columnHeadings = [
  {
    key: 'gamesPlayed',
    label: 'GP',
    title: 'Games Played',
    className: 'w-15',
  },
  {
    key: 'wins',
    label: 'W',
    title: 'Wins',
    className: 'w-15',
  },
  {
    key: 'losses',
    label: 'L',
    title: 'Losses',
    className: 'w-15',
  },
  {
    key: 'otLosses',
    label: 'OT',
    title: 'Overtime Losses',
    className: 'w-15',
  },
  {
    key: 'points',
    label: 'PTS',
    title: 'Points',
    className: 'w-15',
  },
  {
    key: 'pointPctg',
    label: 'P%',
    title: 'Points Percentage',
    className: 'w-15',
  },
  {
    key: 'regulationWins',
    label: 'RW',
    title: 'Regulation Wins',
    className: 'w-15',
  },
  {
    key: 'regulationPlusOtWins',
    label: 'ROW',
    title: 'Regulation plus Overtime Wins',
    className: 'w-15',
  },
  {
    key: 'goalFor',
    label: 'GF',
    title: 'Goals For',
    className: 'w-15',
  },
  {
    key: 'goalAgainst',
    label: 'GA',
    title: 'Goals Against',
    className: 'w-15',
  },
  {
    key: 'goalDifferential',
    label: 'DIFF',
    title: 'Goal Differential',
    className: 'w-15',
  },
  {
    key: 'homeRecord',
    label: 'HOME',
    title: 'Home Record',
    className: 'w-15',
  },
  {
    key: 'roadRecord',
    label: 'AWAY',
    title: 'Away Record',
    className: 'w-15',
  },
  {
    key: 'shootoutRecord',
    label: 'S/O',
    title: 'Shootout Record',
    className: 'w-15',
  },
  {
    key: 'l10Record',
    label: 'L10',
    title: 'Last 10 Games Record',
    className: 'w-15',
  },
  {
    key: 'streak',
    label: 'STRK',
    title: 'Current Streak',
    className: 'w-15',
  },
];

const StandingsTable: React.FC<StandingsTableProps> = ({ standings }) => {
  const tableRows = standings.sort((a, b) => {
    if (a.wildcardSequence === b.wildcardSequence) {
      if (a.divisionAbbrev === b.divisionAbbrev) {
        return a.divisionSequence > b.divisionSequence ? 1 : -1;
      }

      // Sort alphabetically
      return a.divisionAbbrev > b.divisionAbbrev ? 1 : -1;
    }

    return a.wildcardSequence > b.wildcardSequence ? 1 : -1;
  });

  // If row[0].points is less than row[3].points, swap 0,1,2 and 3,4,5
  if (tableRows[0].points < tableRows[3].points) {
    const temp = tableRows[0];
    tableRows[0] = tableRows[3];
    tableRows[3] = temp;
    const temp2 = tableRows[1];
    tableRows[1] = tableRows[4];
    tableRows[4] = temp2;
    const temp3 = tableRows[2];
    tableRows[2] = tableRows[5];
    tableRows[5] = temp3;
  }

  const wildcardRankings = [
    '1',
    '2',
    '3',
    '1',
    '2',
    '3',
    'WC1',
    'WC2',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
  ];

  return (
    <div className="overflow-x-auto scrollbar-hidden">
      <table className={styles.standingsTable}>
        <thead>
          <tr className="text-sm text-nowrap border bg-slate-200 dark:bg-slate-800">
            <th className="w-10 text-center"></th>
            <th className="text-center">Team</th>
            {columnHeadings.map(({ key, label, title, className }) => (
              <th key={key} className={`${className} text-center`}>
                <abbr className="underline decoration-dashed" title={title}>
                  {label}
                </abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((team, i) => (
            <tr
              key={team.teamAbbrev.default}
              className={[2, 5, 7].includes(i) ? 'border-double border-b-4' : ''}
            >
              <td className="text-center border ranking">{wildcardRankings[i]}</td>
              <td className="border p-1 text-center text-sm font-semibold">
                <Link
                  href={`/team/${team.teamAbbrev.default}`}
                  className={team.clinchIndicator === 'e' ? 'opacity-40' : ''}
                >
                  <div className="flex items-center gap-2">
                    <TeamLogo src={team.teamLogo} className="h-6 w-6 hidden sm:block" alt="Logo" />
                    <div className="block md:hidden">
                      {team.teamAbbrev.default}{' '}
                      {team.clinchIndicator && <span>({team.clinchIndicator})</span>}
                    </div>
                    <div className="hidden md:block">
                      {team.teamName.default}{' '}
                      {team.clinchIndicator && <span>({team.clinchIndicator})</span>}
                    </div>
                  </div>
                </Link>
              </td>
              <td className="text-center">{formatStat(team.gamesPlayed)}</td>
              <td className="text-center">{formatStat(team.wins)}</td>
              <td className="text-center">{formatStat(team.losses)}</td>
              <td className="text-center">{formatStat(team.otLosses)}</td>
              <td className="text-center">{formatStat(team.points)}</td>
              <td className="text-center">{formatStat(team.pointPctg, 3)}</td>
              <td className="text-center">{formatStat(team.regulationWins)}</td>
              <td className="text-center">{formatStat(team.regulationPlusOtWins)}</td>
              <td className="text-center">{formatStat(team.goalFor)}</td>
              <td className="text-center">{formatStat(team.goalAgainst)}</td>
              <td className="text-center">{formatStat(team.goalDifferential, 0, 'plusMinus')}</td>
              <td className="text-center">
                {formatStat(team.homeWins)}-{formatStat(team.homeLosses)}-
                {formatStat(team.homeOtLosses)}
              </td>
              <td className="text-center">
                {formatStat(team.roadWins)}-{formatStat(team.roadLosses)}-
                {formatStat(team.roadOtLosses)}
              </td>
              <td className="text-center">
                {formatStat(team.shootoutWins)}-{formatStat(team.shootoutLosses)}
              </td>
              <td className="text-center">
                {formatStat(team.l10Wins)}-{formatStat(team.l10Losses)}-
                {formatStat(team.l10OtLosses)}
              </td>
              <td className="text-center">
                {formatStat(team.streakCode)}
                {formatStat(team.streakCount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// PropTypes removed in favor of TypeScript

export default StandingsTable;
