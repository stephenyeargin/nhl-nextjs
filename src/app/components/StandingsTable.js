import React from 'react';
import Link from 'next/link';
import { PropTypes } from 'prop-types';
import TeamLogo from '@/app/components/TeamLogo';
import { formatStat } from '@/app/utils/formatters';

import '@/app/assets/datatables.css';
import '@/app/components/StandingsTable.scss';

const StandingsTable = ({ standings }) => {
  const tableRows = standings
    .sort((a, b) => {
      if (a.wildcardSequence === b.wildcardSequence) {
        if (a.divisionAbbrev === b.divisionAbbrev) {
          return (a.divisionSequence > b.divisionSequence) ? 1 : -1;
        }

        // Sort alphabetically
        return (a.divisionAbbrev > b.divisionAbbrev) ? 1 : -1;
      }

      return (a.wildcardSequence > b.wildcardSequence) ? 1 : -1;
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

  const wildcardRankings = ['1', '2', '3', '1', '2', '3', 'WC1', 'WC2', '9', '10', '11', '12', '13', '14', '15', '16'];

  return (
    <div className="overflow-x-auto scrollbar-hidden">
      <table className="statsTable">
        <thead>
          <tr className="text-sm text-nowrap border bg-slate-200 dark:bg-slate-800">
            <th className="w-10 text-center"></th>
            <th className="text-center">Team</th>
            <th className="w-15 text-center">GP</th>
            <th className="w-15 text-center">W</th>
            <th className="w-15 text-center">L</th>
            <th className="w-15 text-center">OT</th>
            <th className="w-15 text-center">PTS</th>
            <th className="w-15 text-center">P%</th>
            <th className="w-15 text-center">RW</th>
            <th className="w-15 text-center">ROW</th>
            <th className="w-15 text-center">GF</th>
            <th className="w-15 text-center">GA</th>
            <th className="w-15 text-center">DIFF</th>
            <th className="w-15 text-center">HOME</th>
            <th className="w-15 text-center">AWAY</th>
            <th className="w-15 text-center">S/O</th>
            <th className="w-15 text-center">L10</th>
            <th className="w-15 text-center">STRK</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((team, i) => (
            <tr key={team.teamAbbrev.default} className={[2, 5, 7].includes(i) ? 'border-double border-b-4' : ''}>
              <td className="text-center border ranking">{wildcardRankings[i]}</td>
              <td className="border p-1 text-center text-sm font-semibold">
                <Link href={`/team/${team.teamAbbrev.default}`} className={team.clinchIndicator === 'e' ? 'opacity-40' : ''}>
                  <div className="flex items-center gap-2">
                    <TeamLogo
                      src={team.teamLogo}
                      className="h-6 w-6 hidden sm:block"
                      alt="Logo"
                    />
                    <div className="block md:hidden">
                      {team.teamAbbrev.default}
                      {' '}
                      {team.clinchIndicator && (
                        <span>({team.clinchIndicator})</span>
                      )}
                    </div>
                    <div className="hidden md:block">
                      {team.teamName.default}
                      {' '}
                      {team.clinchIndicator && (
                        <span>({team.clinchIndicator})</span>
                      )}
                    </div>
                  </div>
                </Link>
              </td>
              <td className="text-center">{formatStat(team.gamesPlayed)}</td>
              <td className="text-center">{formatStat(team.wins)}</td>
              <td className="text-center">{formatStat(team.losses)}</td>
              <td className="text-center">{formatStat(team.otLosses)}</td>
              <td className="text-center">{formatStat(team.points)}</td>
              <td className="text-center">{formatStat(team.pointPctg,3)}</td>
              <td className="text-center">{formatStat(team.regulationWins)}</td>
              <td className="text-center">{formatStat(team.regulationPlusOtWins)}</td>
              <td className="text-center">{formatStat(team.goalFor)}</td>
              <td className="text-center">{formatStat(team.goalAgainst)}</td>
              <td className="text-center">{formatStat(team.goalDifferential)}</td>
              <td className="text-center">{formatStat(team.homeWins)}-{formatStat(team.homeLosses)}-{formatStat(team.homeOtLosses)}</td>
              <td className="text-center">{formatStat(team.roadWins)}-{formatStat(team.roadLosses)}-{formatStat(team.roadOtLosses)}</td>
              <td className="text-center">{formatStat(team.shootoutWins)}-{formatStat(team.shootoutLosses)}</td>
              <td className="text-center">{formatStat(team.l10Wins)}-{formatStat(team.l10Losses)}-{formatStat(team.l10OtLosses)}</td>
              <td className="text-center">{formatStat(team.streakCode)}{formatStat(team.streakCount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

StandingsTable.propTypes = {
  standings: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default StandingsTable;
