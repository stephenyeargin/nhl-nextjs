import React from 'react';
import Link from 'next/link';
import TeamLogo from '@/app/components/TeamLogo';
import { formatStat } from '@/app/utils/formatters';
import type { LocalizedString } from '@/app/types/content';

import '@/app/assets/datatables.css';
import styles from '@/app/components/StandingsTable.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faMagicWandSparkles,
  faSadTear,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';

export interface StandingsEntry {
  wildcardSequence: number;
  divisionAbbrev: string;
  divisionSequence: number;
  conferenceAbbrev?: string;
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

export type StandingsView = 'wildcard' | 'division' | 'conference' | 'league';

interface StandingsTableProps {
  standings: StandingsEntry[];
  view?: StandingsView;
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

const divisionNames: Record<string, string> = {
  A: 'Atlantic',
  M: 'Metropolitan',
  C: 'Central',
  P: 'Pacific',
  ATL: 'Atlantic',
  MET: 'Metropolitan',
  CEN: 'Central',
  PAC: 'Pacific',
};

const conferenceNames: Record<string, string> = {
  E: 'Eastern Conference',
  W: 'Western Conference',
};

const sortByWildcard = (a: StandingsEntry, b: StandingsEntry) => {
  if (a.wildcardSequence === b.wildcardSequence) {
    if (a.divisionAbbrev === b.divisionAbbrev) {
      return a.divisionSequence > b.divisionSequence ? 1 : -1;
    }

    return a.divisionAbbrev > b.divisionAbbrev ? 1 : -1;
  }

  return a.wildcardSequence > b.wildcardSequence ? 1 : -1;
};

const sortByPointsDesc = (a: StandingsEntry, b: StandingsEntry) => {
  if (a.points === b.points) {
    if (a.pointPctg === b.pointPctg) {
      return b.regulationWins - a.regulationWins;
    }

    return b.pointPctg - a.pointPctg;
  }

  return b.points - a.points;
};

const StandingsTable: React.FC<StandingsTableProps> = ({ standings, view = 'wildcard' }) => {
  const tableRows = React.useMemo(() => [...standings], [standings]);

  if (view === 'wildcard') {
    tableRows.sort(sortByWildcard);

    if (tableRows.length >= 6 && tableRows[0].points < tableRows[3].points) {
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
  } else if (view === 'league') {
    tableRows.sort(sortByPointsDesc);
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

  const groupedRows = React.useMemo(() => {
    if (view === 'division') {
      const groups = tableRows.reduce<Record<string, StandingsEntry[]>>((acc, row) => {
        const key = row.divisionAbbrev;
        acc[key] = acc[key] || [];
        acc[key].push(row);

        return acc;
      }, {});
      Object.values(groups).forEach((rows) =>
        rows.sort((a, b) => a.divisionSequence - b.divisionSequence || sortByPointsDesc(a, b))
      );

      return groups;
    }
    if (view === 'conference') {
      const groups = tableRows.reduce<Record<string, StandingsEntry[]>>((acc, row) => {
        const key = row.conferenceAbbrev || 'Unknown';
        acc[key] = acc[key] || [];
        acc[key].push(row);

        return acc;
      }, {});
      Object.values(groups).forEach((rows) => rows.sort(sortByPointsDesc));

      return groups;
    }

    return null;
  }, [tableRows, view]);

  const renderRankingCell = (idx: number) => {
    if (view === 'wildcard') {
      return wildcardRankings[idx] ?? String(idx + 1);
    }

    return String(idx + 1);
  };

  const showRaceColumns =
    view === 'wildcard' && tableRows.length > 7 && tableRows.some((team) => team.gamesPlayed > 60);
  const totalColumns = 2 + columnHeadings.length + (showRaceColumns ? 2 : 0);
  const maxPossiblePoints = (team: StandingsEntry) => team.points + (82 - team.gamesPlayed) * 2;

  // The reference is the outside team with the highest ceiling (max possible points).
  // This is the "strongest team that could still finish 9th" per hockeymagicnumbers.com.
  const ninthPlaceTeam = showRaceColumns
    ? tableRows.slice(8).reduce<StandingsEntry | null>((best, team) => {
        if (!best || maxPossiblePoints(team) > maxPossiblePoints(best)) {
          return team;
        }

        return best;
      }, null)
    : null;

  const getMagicNumber = (team: StandingsEntry) => {
    if (!ninthPlaceTeam) {
      return null;
    }

    // How many points separate the team from the 9th-place ceiling.
    // Reaches 0 when the team has clinched a playoff spot.
    return Math.max(0, maxPossiblePoints(ninthPlaceTeam) - team.points);
  };

  const getTragicNumber = (team: StandingsEntry) => {
    if (!ninthPlaceTeam) {
      return null;
    }

    // How far the team's own ceiling sits above the 9th-place team's current total.
    // Reaches 0 when the team is mathematically eliminated.
    return Math.max(0, maxPossiblePoints(team) - ninthPlaceTeam.points);
  };

  const renderRaceValue = (value: number | null, kind: 'magic' | 'tragic') => {
    if (value === null) {
      return '—';
    }

    if (value === 0) {
      return kind === 'magic' ? (
        <FontAwesomeIcon icon={faCheckCircle} fixedWidth title="Clinched" />
      ) : (
        <FontAwesomeIcon icon={faXmarkCircle} fixedWidth title="Eliminated" />
      );
    }

    return formatStat(value);
  };

  const renderRaceNumberCells = (team: StandingsEntry) => {
    if (!showRaceColumns) {
      return null;
    }

    const magicNumber = getMagicNumber(team);
    const tragicNumber = getTragicNumber(team);

    return (
      <>
        <td className="text-center">
          <span className="bg-blue-500 text-white border border-blue-950 rounded p-1 px-3 font-bold">
            {renderRaceValue(magicNumber, 'magic')}
          </span>
        </td>
        <td className="text-center">
          <span className="bg-red-500 text-white border border-red-950 rounded p-1 px-3 font-bold">
            {renderRaceValue(tragicNumber, 'tragic')}
          </span>
        </td>
      </>
    );
  };

  const renderBodyRows = () => {
    if (!groupedRows) {
      return tableRows.map((team, i) => (
        <tr
          key={team.teamAbbrev.default}
          className={[2, 5, 7].includes(i) && view === 'wildcard' ? 'border-double border-b-4' : ''}
        >
          <td className="text-center border ranking">{renderRankingCell(i)}</td>
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
          {renderRaceNumberCells(team)}
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
            {formatStat(team.l10Wins)}-{formatStat(team.l10Losses)}-{formatStat(team.l10OtLosses)}
          </td>
          <td className="text-center">
            {formatStat(team.streakCode)}
            {formatStat(team.streakCount)}
          </td>
        </tr>
      ));
    }

    return Object.entries(groupedRows).map(([groupKey, rows]) => (
      <React.Fragment key={groupKey}>
        {view === 'division' && (
          <tr className={styles.groupHeader}>
            <th colSpan={totalColumns} className="bg-slate-200 dark:bg-slate-800">
              {divisionNames[groupKey] || conferenceNames[groupKey] || groupKey}
            </th>
          </tr>
        )}
        {rows.map((team, i) => (
          <tr key={team.teamAbbrev.default}>
            <td className="text-center border ranking">{renderRankingCell(i)}</td>
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
            {renderRaceNumberCells(team)}
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
              {formatStat(team.l10Wins)}-{formatStat(team.l10Losses)}-{formatStat(team.l10OtLosses)}
            </td>
            <td className="text-center">
              {formatStat(team.streakCode)}
              {formatStat(team.streakCount)}
            </td>
          </tr>
        ))}
      </React.Fragment>
    ));
  };

  return (
    <div className="overflow-x-auto scrollbar-hidden">
      <table className={styles.standingsTable}>
        <thead>
          {showRaceColumns && (
            <tr className="text-xs text-nowrap bg-slate-200 dark:bg-slate-800">
              <th colSpan={2} />
              <th
                colSpan={2}
                className="text-center font-medium tracking-wide bg-yellow-100 dark:bg-yellow-900"
              >
                Playoff Race
              </th>
              <th colSpan={columnHeadings.length} />
            </tr>
          )}
          <tr className="text-sm text-nowrap bg-slate-200 dark:bg-slate-800">
            <th className="w-10 text-center"></th>
            <th className="text-center">Team</th>
            {showRaceColumns && (
              <>
                <th className="w-15 text-center bg-blue-100 dark:bg-blue-900">
                  <abbr className="underline decoration-dashed" title="Magic Number">
                    <FontAwesomeIcon icon={faMagicWandSparkles} />
                  </abbr>
                </th>
                <th className="w-15 text-center bg-red-100 dark:bg-red-900">
                  <abbr className="underline decoration-dashed" title="Tragic Number">
                    <FontAwesomeIcon icon={faSadTear} />
                  </abbr>
                </th>
              </>
            )}
            {columnHeadings.map(({ key, label, title, className }) => (
              <th key={key} className={`${className} text-center`}>
                <abbr className="underline decoration-dashed" title={title}>
                  {label}
                </abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderBodyRows()}</tbody>
      </table>
    </div>
  );
};

// PropTypes removed in favor of TypeScript

export default StandingsTable;
