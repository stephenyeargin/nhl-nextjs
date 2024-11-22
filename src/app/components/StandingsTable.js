import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatStat } from '../utils/formatters';
import TeamLogo from './TeamLogo';

const StandingsTable = ({ standings }) => {
  const tableRows = standings
    .sort((a, b) => {
      if (a.wildcardSequence === b.wildcardSequence) {
        if (a.divisionAbbrev === b.divisionAbbrev) {
          return (a.divisionSequence > b.divisionSequence) ? 1 : -1;
        }
        
        return (a.divisionAbbrev > b.divisionAbbrev) ? 1 : -1;
      }
      
      return (a.wildcardSequence > b.wildcardSequence) ? 1 : -1;
    });

  const wildcardRankings = ['1', '2', '3', '1', '2', '3', 'WC1', 'WC2', '', '', '', '', '', '', '', ''];

  return (
    <table className="w-full table-auto border-collapse border">
      <thead>
        <tr className="">
          <th className="text-sm w-10 text-center border bg-slate-200 dark:bg-slate-800 p-2"></th>
          <th className="text-sm text-center border bg-slate-200 dark:bg-slate-800 p-2">Team</th>
          <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 p-2">GP</th>
          <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 p-2">W</th>
          <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 p-2">L</th>
          <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 p-2">OT</th>
          <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 p-2">PTS</th>
          <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 p-2">P%</th>
          <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 p-2 hidden md:table-cell">RW</th>
          <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 p-2 hidden md:table-cell">ROW</th>
          <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 p-2 hidden md:table-cell">GF</th>
          <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 p-2 hidden md:table-cell">GA</th>
          <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 p-2 hidden md:table-cell">DIFF</th>
          <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 p-2 hidden md:table-cell">HOME</th>
          <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 p-2 hidden md:table-cell">AWAY</th>
          <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 p-2">S/O</th>
          <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 p-2">L10</th>
          <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 p-2">STRK</th>
        </tr>
      </thead>
      <tbody>
        {tableRows.map((team, i) => (
          <tr key={team.teamAbbrev.default}>
            <td className="text-center border text-xs">{wildcardRankings[i]}</td>
            <td className="border p-1 text-center text-sm font-semibold">
              <Link href={`/team/${team.teamAbbrev.default}`}>
                <div className="flex items-center gap-2">
                  <TeamLogo
                    src={team.teamLogo}
                    className="h-6 w-6 hidden sm:block"
                    alt="Logo"
                  />
                  <div className="block md:hidden">{team.teamAbbrev.default}</div>
                  <div className="hidden md:block">{team.teamName.default}</div>
                </div>
              </Link>
            </td>
            <td className="text-center border text-sm p-2">{formatStat(team.gamesPlayed)}</td>
            <td className="text-center border text-sm p-2">{formatStat(team.wins)}</td>
            <td className="text-center border text-sm p-2">{formatStat(team.losses)}</td>
            <td className="text-center border text-sm p-2">{formatStat(team.otLosses)}</td>
            <td className="text-center border text-sm p-2">{formatStat(team.points)}</td>
            <td className="text-center border text-sm p-2">{formatStat(team.pointPctg,3)}</td>
            <td className="text-center border text-sm p-2 hidden md:table-cell">{formatStat(team.roadWins)}</td>
            <td className="text-center border text-sm p-2 hidden md:table-cell">{formatStat(team.regulationPlusOtWins)}</td>
            <td className="text-center border text-sm p-2 hidden md:table-cell">{formatStat(team.goalFor)}</td>
            <td className="text-center border text-sm p-2 hidden md:table-cell">{formatStat(team.goalAgainst)}</td>
            <td className="text-center border text-sm p-2 hidden md:table-cell">{formatStat(team.goalDifferential)}</td>
            <td className="text-center border text-sm p-2 hidden md:table-cell">{formatStat(team.homeWins)}-{formatStat(team.homeLosses)}-{formatStat(team.homeOtLosses)}</td>
            <td className="text-center border text-sm p-2 hidden md:table-cell">{formatStat(team.roadWins)}-{formatStat(team.roadLosses)}-{formatStat(team.roadOtLosses)}</td>
            <td className="text-center border text-sm p-2">{formatStat(team.shootoutWins)}-{formatStat(team.shootoutLosses)}</td>
            <td className="text-center border text-sm p-2">{formatStat(team.l10Wins)}-{formatStat(team.l10Losses)}-{formatStat(team.l10OtLosses)}</td>
            <td className="text-center border text-sm p-2">{formatStat(team.streakCode)}{formatStat(team.streakCount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StandingsTable;
