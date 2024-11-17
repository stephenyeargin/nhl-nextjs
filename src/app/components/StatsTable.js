import { formatSecondsToGameTime, formatStat } from "../utils/formatters";
import Headshot from "./Headshot";

const StatsTable = ({ stats, goalieMode = false }) => {

  if (goalieMode) {
    return (
      <table className="text-sm w-full">
        <thead>
          <tr className="text-xs">
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center"></th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-left">Player</th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
              <abbr className="underline decoration-dashed" title="Games Played">GP</abbr>
            </th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
              <abbr className="underline decoration-dashed" title="Wins">W</abbr>
            </th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
              <abbr className="underline decoration-dashed" title="Losses">L</abbr>
            </th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
              <abbr className="underline decoration-dashed" title="Overtime Losses">OT</abbr>
            </th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
              <abbr className="underline decoration-dashed" title="Shots Against">SA</abbr>
            </th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
              <abbr className="underline decoration-dashed" title="Saves">SV</abbr>
            </th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
              <abbr className="underline decoration-dashed" title="Goals Against">GA</abbr>
            </th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
              <abbr className="underline decoration-dashed" title="Save Percentage">SV%</abbr>
            </th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
              <abbr className="underline decoration-dashed" title="Goals Against Average">GAA</abbr>
            </th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
              <abbr className="underline decoration-dashed" title="Shutouts">SO</abbr>
            </th>
            <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Time On Ice">TOI</abbr>
            </th>
          </tr>
        </thead>
        <tbody>
          {stats.map((skater, i) => (
            <tr key={skater.playerId} className={`${i % 2 ? 'bg-slate-500/10' : ''}`}>
              {skater.sweaterNumber ? (
                <td className="p-2 border text-center w-5">{skater.sweaterNumber}</td>
              ) : (
                <td className="p-2 border text-center w-5">
                  <Headshot src={skater.headshot} className="h-8 w-8 mx-auto"/>
                </td>
              )}
              {skater.name?.default ? (
                <td className="p-2 border text-left w-10">{skater.name.default}</td>
              ) : (
                <td className="p-2 border text-left w-10">{skater.firstName.default} {skater.lastName.default}</td>
              ) }
              <td className="p-2 border text-center w-10">{formatStat(skater.gamesPlayed)}</td>
              <td className="p-2 border text-center w-10">{formatStat(skater.wins)}</td>
              <td className="p-2 border text-center w-10">{formatStat(skater.losses)}</td>
              <td className="p-2 border text-center w-10">{formatStat(skater.otLosses || skater.overtimeLosses)}</td>
              <td className="p-2 border text-center w-10">{formatStat(skater.shotsAgainst)}</td>
              <td className="p-2 border text-center w-10">{formatStat(skater.saves)}</td>
              <td className="p-2 border text-center w-10">{formatStat(skater.goalsAgainst)}</td>
              <td className="p-2 border text-center w-10">{formatStat(skater.savePctg || skater.savePercentage, 3)}</td>
              <td className="p-2 border text-center w-10">{formatStat(skater.goalsAgainstAvg || skater.goalsAgainstAverage, 3)}</td>
              <td className="p-2 border text-center w-10">{formatStat(skater.shutouts)}</td>
              <td className="p-2 border text-center w-10">{formatStat(skater.toi || formatSecondsToGameTime(skater.timeOnIce))}</td>
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
          <abbr className="underline decoration-dashed" title="Games Played">GP</abbr>
        </th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
          <abbr className="underline decoration-dashed" title="Goals Scored">G</abbr>
        </th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
          <abbr className="underline decoration-dashed" title="Assists">A</abbr>
        </th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
          <abbr className="underline decoration-dashed" title="Points">P</abbr>
        </th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
          <abbr className="underline decoration-dashed" title="Plus/Minus">+/-</abbr>
        </th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
          <abbr className="underline decoration-dashed" title="Penalty Minutes">PIM</abbr>
        </th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
          <abbr className="underline decoration-dashed" title="Power Play Goals">PPG</abbr>
        </th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
          <abbr className="underline decoration-dashed" title="Game-Winning Goals">GWG</abbr>
        </th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
          <abbr className="underline decoration-dashed" title="Shots on Goal">S</abbr>
        </th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
          <abbr className="underline decoration-dashed" title="Time On Ice per Game">TOI/G</abbr>
        </th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
          <abbr className="underline decoration-dashed" title="Faceoff Win Percentage">FO%</abbr>
        </th>
      </tr>

      </thead>
      <tbody>
        {stats.map((skater, i) => (
          <tr key={skater.playerId} className={`${i % 2 ? 'bg-slate-500/10' : ''}`}>
            {skater.sweaterNumber ? (
              <td className="p-2 border text-center w-5">{skater.sweaterNumber}</td>
            ) : (
              <td className="p-2 border text-center w-5">
                <Headshot src={skater.headshot} className="h-8 w-8 mx-auto"/>
              </td>
            )}
            {skater.name?.default ? (
              <td className="p-2 border text-left w-10">{skater.name.default}</td>
            ) : (
              <td className="p-2 border text-left w-10">{skater.firstName.default} {skater.lastName.default}</td>
            ) }
            <td className="p-2 border text-center w-10">{skater.position || skater.positionCode}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.gamesPlayed)}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.goals)}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.assists)}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.points)}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.plusMinus)}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.pim || skater.penaltyMinutes)}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.powerPlayGoals)}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.gameWinningGoals)}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.shots)}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.avgTimeOnIce || formatSecondsToGameTime(skater.avgTimeOnIcePerGame))}</td>
            <td className="p-2 border text-center w-10">{formatStat(skater.faceoffWinningPctg || skater.faceoffWinPctg, 3)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StatsTable;
