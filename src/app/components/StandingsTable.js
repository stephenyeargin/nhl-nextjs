import Image from 'next/image'
import Link from 'next/link';

const formatPercentage = (value) => {
  if (!value || value === 0) {
    return '--';
  }

  // Check if the percentage is 1 (100%)
  if (value === 1) {
    return '1.000';
  }
  // For other values, format it as required
  return value.toFixed(3).replace(/^0\./, '.');
};

export default function StandingsTable({ standings }) {
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
    <table className="w-full table-auto border-collapse border border-slate-500">
        <thead>
          <tr className="">
            <th className="text-sm w-10 text-center border bg-slate-200 dark:bg-slate-800 border-slate-500 p-2"></th>
            <th className="text-sm text-center border bg-slate-200 dark:bg-slate-800 border-slate-500 p-2">Team</th>
            <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 border-slate-500 p-2">GP</th>
            <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 border-slate-500 p-2">W</th>
            <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 border-slate-500 p-2">L</th>
            <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 border-slate-500 p-2">OT</th>
            <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 border-slate-500 p-2">PTS</th>
            <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 border-slate-500 p-2">P%</th>
            <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 border-slate-500 p-2 hidden md:table-cell">RW</th>
            <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 border-slate-500 p-2 hidden md:table-cell">ROW</th>
            <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 border-slate-500 p-2 hidden md:table-cell">GF</th>
            <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 border-slate-500 p-2 hidden md:table-cell">GA</th>
            <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 border-slate-500 p-2 hidden md:table-cell">DIFF</th>
            <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 border-slate-500 p-2 hidden md:table-cell">HOME</th>
            <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 border-slate-500 p-2 hidden md:table-cell">AWAY</th>
            <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 border-slate-500 p-2">S/O</th>
            <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 border-slate-500 p-2">L10</th>
            <th className="text-sm w-15 text-center border bg-slate-200 dark:bg-slate-800 border-slate-500 p-2">STRK</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((team, i) => (
            <tr key={team.teamAbbrev.default}>
              <td className="text-center border border-slate-500 text-xs">{wildcardRankings[i]}</td>
              <td className="border border-slate-500 p-1 text-center text-sm font-semibold">
                <Link href={`/team/${team.teamAbbrev.default}`}>
                  <div className="hidden lg:flex">
                    <Image src={team.teamLogo} title={team.teamName.default} width="30" height="30" className="pr-1" alt="Logo" />
                    {team.teamName.default}
                  </div>
                  <div className="flex lg:hidden items-center justify-center">
                    <Image src={team.teamLogo} title={team.teamName.default} width="30" height="30" className="pr-1" alt="Logo" />
                    {team.teamAbbrev.default}
                  </div>
                </Link>
              </td>
              <td className="text-center border border-slate-500 text-sm p-2">{team.gamesPlayed}</td>
              <td className="text-center border border-slate-500 text-sm p-2">{team.wins}</td>
              <td className="text-center border border-slate-500 text-sm p-2">{team.losses}</td>
              <td className="text-center border border-slate-500 text-sm p-2">{team.otLosses}</td>
              <td className="text-center border border-slate-500 text-sm p-2">{team.points}</td>
              <td className="text-center border border-slate-500 text-sm p-2">{formatPercentage(team.pointPctg)}</td>
              <td className="text-center border border-slate-500 text-sm p-2 hidden md:table-cell">{team.roadWins}</td>
              <td className="text-center border border-slate-500 text-sm p-2 hidden md:table-cell">{team.regulationPlusOtWins}</td>
              <td className="text-center border border-slate-500 text-sm p-2 hidden md:table-cell">{team.goalFor}</td>
              <td className="text-center border border-slate-500 text-sm p-2 hidden md:table-cell">{team.goalAgainst}</td>
              <td className="text-center border border-slate-500 text-sm p-2 hidden md:table-cell">{team.goalDifferential}</td>
              <td className="text-center border border-slate-500 text-sm p-2 hidden md:table-cell">{team.homeWins}-{team.homeLosses}-{team.homeOtLosses}</td>
              <td className="text-center border border-slate-500 text-sm p-2 hidden md:table-cell">{team.roadWins}-{team.roadLosses}-{team.roadOtLosses}</td>
              <td className="text-center border border-slate-500 text-sm p-2">{team.shootoutWins}-{team.shootoutLosses}</td>
              <td className="text-center border border-slate-500 text-sm p-2">{team.l10Wins}-{team.l10Losses}-{team.l10OtLosses}</td>
              <td className="text-center border border-slate-500 text-sm p-2">{team.streakCode || '-'}{team.streakCount || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
  )
}