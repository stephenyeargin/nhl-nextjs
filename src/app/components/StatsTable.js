import { formatStat } from "../utils/formatters";

const StatsTable = ({ stats, goalieMode = false }) => {

  if (goalieMode) {
    return (
      <table className="text-sm w-full">
        <thead>
          <tr className="text-xs">
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">#</th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-left">Player</th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
              <abbrev className="underline decoration-dashed" title="Games Played">GP</abbrev>
            </th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
              <abbrev className="underline decoration-dashed" title="Wins">W</abbrev>
            </th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
              <abbrev className="underline decoration-dashed" title="Losses">L</abbrev>
            </th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
              <abbrev className="underline decoration-dashed" title="Overtime Losses">OT</abbrev>
            </th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
              <abbrev className="underline decoration-dashed" title="Shots Against">SA</abbrev>
            </th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
              <abbrev className="underline decoration-dashed" title="Saves">SV</abbrev>
            </th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
              <abbrev className="underline decoration-dashed" title="Goals Against">GA</abbrev>
            </th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
              <abbrev className="underline decoration-dashed" title="Save Percentage">SV%</abbrev>
            </th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
              <abbrev className="underline decoration-dashed" title="Goals Against Average">GAA</abbrev>
            </th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
              <abbrev className="underline decoration-dashed" title="Shutouts">SO</abbrev>
            </th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbrev className="underline decoration-dashed" title="Time On Ice">TOI</abbrev>
            </th>
          </tr>
        </thead>
        <tbody>
          {stats.map((skater, i) => (
            <tr key={skater.playerId} className={`${i % 2 ? 'bg-slate-500/10' : ''}`}>
              <td className="p-2 border text-center w-5">{skater.sweaterNumber}</td>
              <td className="p-2 border text-left w-10">{skater.name.default}</td>
              <td className="p-2 border text-center w-10">{formatStat(skater.gamesPlayed)}</td>
              <td className="p-2 border text-center w-10">{formatStat(skater.wins)}</td>
              <td className="p-2 border text-center w-10">{formatStat(skater.losses)}</td>
              <td className="p-2 border text-center w-10">{formatStat(skater.otLosses)}</td>
              <td className="p-2 border text-center w-10">{formatStat(skater.shotsAgainst)}</td>
              <td className="p-2 border text-center w-10">{formatStat(skater.saves)}</td>
              <td className="p-2 border text-center w-10">{formatStat(skater.goalsAgainst)}</td>
              <td className="p-2 border text-center w-10">{formatStat(skater.savePctg, 3)}</td>
              <td className="p-2 border text-center w-10">{formatStat(skater.goalsAgainstAvg, 3)}</td>
              <td className="p-2 border text-center w-10">{formatStat(skater.shutouts)}</td>
              <td className="p-2 border text-center w-10">{formatStat(skater.toi)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <table className="text-sm w-full">
      <thead>
      <tr className="text-xs">
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">#</th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-left">Name</th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">POS</th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
          <abbrev className="underline decoration-dashed" title="Games Played">GP</abbrev>
        </th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
          <abbrev className="underline decoration-dashed" title="Goals Scored">G</abbrev>
        </th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
          <abbrev className="underline decoration-dashed" title="Assists">A</abbrev>
        </th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
          <abbrev className="underline decoration-dashed" title="Points">P</abbrev>
        </th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
          <abbrev className="underline decoration-dashed" title="Plus/Minus">+/-</abbrev>
        </th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
          <abbrev className="underline decoration-dashed" title="Penalty Minutes">PIM</abbrev>
        </th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
          <abbrev className="underline decoration-dashed" title="Power Play Goals">PPG</abbrev>
        </th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
          <abbrev className="underline decoration-dashed" title="Game-Winning Goals">GWG</abbrev>
        </th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
          <abbrev className="underline decoration-dashed" title="Shots on Goal">S</abbrev>
        </th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
          <abbrev className="underline decoration-dashed" title="Blocked Shots">BLK</abbrev>
        </th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
          <abbrev className="underline decoration-dashed" title="Hits">HITS</abbrev>
        </th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
          <abbrev className="underline decoration-dashed" title="Time On Ice per Game">TOI/G</abbrev>
        </th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
          <abbrev className="underline decoration-dashed" title="Faceoff Win Percentage">FO%</abbrev>
        </th>
      </tr>

      </thead>
      <tbody>
        {stats.map((skater, i) => (
          <tr key={skater.playerId} className={`${i % 2 ? 'bg-slate-500/10' : ''}`}>
            <td className="p-2 border text-center w-5">{skater.sweaterNumber}</td>
            <td className="p-2 border text-left w-10">{skater.name.default}</td>
            <td className="p-2 border text-center w-10">{skater.position}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.gamesPlayed)}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.goals)}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.assists)}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.points)}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.plusMinus)}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.pim)}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.powerPlayGoals)}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.gameWinningGoals)}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.shots)}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.blockedShots)}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.hits)}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.avgTimeOnIce)}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.faceoffWinningPctg, 3)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StatsTable;
