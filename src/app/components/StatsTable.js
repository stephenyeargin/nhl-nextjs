import { formatSecondsToGameTime, formatStat } from "../utils/formatters";
import Headshot from "./Headshot";

const StatsTable = ({ stats }) => {

  const statsAvailable = Object.keys(stats[0]);

  return (
    <table className="text-sm w-full">
      <thead>
      <tr className="text-xs">
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">#</th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-left">Name</th>
        <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">POS</th>
        {statsAvailable.includes('gamesPlayed') && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Games Played">GP</abbr>
          </th>
        )}
        {statsAvailable.includes('goals') && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Goals Scored">G</abbr>
          </th>
        )}
        {statsAvailable.includes('assists') && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Assists">A</abbr>
          </th>
        )}
        {statsAvailable.includes('points') && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Points">P</abbr>
          </th>
        )}
        {statsAvailable.includes('plusMinus') && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Plus/Minus">+/-</abbr>
          </th>
        )}
        {(statsAvailable.includes('pim') || statsAvailable.includes('penaltyMinutes')) && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Penalty Minutes">PIM</abbr>
          </th>
        )}
        {statsAvailable.includes('powerPlayGoals') && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Power Play Goals">PPG</abbr>
          </th>
        )}
        {statsAvailable.includes('gameWinningGoals') && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Game-Winning Goals">GWG</abbr>
          </th>
        )}
        {(statsAvailable.includes('shots') || statsAvailable.includes('sog')) && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Shots on Goal">S</abbr>
          </th>
        )}
        {statsAvailable.includes('hits') && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Hits">H</abbr>
          </th>
        )}
        {statsAvailable.includes('shifts') && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Shifts">SH</abbr>
          </th>
        )}
        {statsAvailable.includes('takeaways') && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Takeaways">TA</abbr>
          </th>
        )}
        {statsAvailable.includes('giveaways') && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Giveaways">GA</abbr>
          </th>
        )}
        {statsAvailable.includes('avgTimeOnIce') && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Time On Ice per Game">TOI/G</abbr>
          </th>
        )}
        {(statsAvailable.includes('faceoffWinningPctg') || statsAvailable.includes('faceoffWinPctg')) && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Faceoff Win Percentage">FO%</abbr>
          </th>
        )}
        {statsAvailable.includes('wins') && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Wins">W</abbr>
          </th>
        )}
        {statsAvailable.includes('losses') && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Losses">L</abbr>
          </th>
        )}
        {(statsAvailable.includes('otLosses') || statsAvailable.includes('overtimeLosses')) && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Overtime Losses">OT</abbr>
          </th>
        )}
        {statsAvailable.includes('shotsAgainst') && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Shots Against">SA</abbr>
          </th>
        )}
        {statsAvailable.includes('saves') && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Saves">SV</abbr>
          </th>
        )}
        {statsAvailable.includes('goalsAgainst') && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Goals Against">GA</abbr>
          </th>
        )}
        {(statsAvailable.includes('savePctg') || statsAvailable.includes('savePercentage') ) && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Save Percentage">SV%</abbr>
          </th>
        )}
        {(statsAvailable.includes('goalsAgainstAvg') || statsAvailable.includes('goalsAgainstAverage')) && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Goals Against Average">GAA</abbr>
          </th>
        )}
        {statsAvailable.includes('shutouts') && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Shutouts">SO</abbr>
          </th>
        )}
        {(statsAvailable.includes('toi') || statsAvailable.includes('timeOnIce')) && (
          <th className="p-2 border bg-slate-200 dark:bg-slate-800 text-center">
            <abbr className="underline decoration-dashed" title="Time On Ice">TOI</abbr>
          </th>
        )}
      </tr>

      </thead>
      <tbody>
        {stats.map((skater, i) => (
          <tr key={skater.playerId} className={`${i % 2 ? 'bg-slate-500/10' : ''}`}>
            {skater.sweaterNumber ? (
              <td className="p-2 border text-center">{skater.sweaterNumber}</td>
            ) : (
              <td className="p-2 border text-center">
                <Headshot
                  src={skater.headshot}
                  alt={skater.name?.default || `${skater.firstName.default} ${skater.lastName.default}`}
                  size="2"
                  className="mx-auto"
                />
              </td>
            )}
            {skater.name?.default ? (
              <td className="p-2 border text-left">{skater.name.default}</td>
            ) : (
              <td className="p-2 border text-left">{skater.firstName.default} {skater.lastName.default}</td>
            ) }
            <td className="p-2 border text-center">{skater.position || skater.positionCode || 'G'}</td>
            {statsAvailable.includes('gamesPlayed') && (
              <td className="p-2 border text-center">{formatStat(skater.gamesPlayed)}</td>
            )}
            {statsAvailable.includes('goals') && (
              <td className="p-2 border text-center">{formatStat(skater.goals)}</td>
            )}
            {statsAvailable.includes('assists') && (
              <td className="p-2 border text-center">{formatStat(skater.assists)}</td>
            )}
            {statsAvailable.includes('points') && (
              <td className="p-2 border text-center">{formatStat(skater.points)}</td>
            )}
            {statsAvailable.includes('plusMinus') && (
              <td className="p-2 border text-center">{formatStat(skater.plusMinus)}</td>
            )}
            {(statsAvailable.includes('pim') || statsAvailable.includes('penaltyMinutes')) && (
              <td className="p-2 border text-center">{formatStat(skater.pim || skater.penaltyMinutes)}</td>
            )}
            {statsAvailable.includes('powerPlayGoals') && (
              <td className="p-2 border text-center">{formatStat(skater.powerPlayGoals)}</td>
            )}
            {statsAvailable.includes('gameWinningGoals') && (
              <td className="p-2 border text-center">{formatStat(skater.gameWinningGoals)}</td>
            )}
            {(statsAvailable.includes('shots') || statsAvailable.includes('sog')) && (
              <td className="p-2 border text-center">{formatStat(skater.shots || skater.sog)}</td>
            )}
            {statsAvailable.includes('hits') && (
              <td className="p-2 border text-center">{formatStat(skater.hits)}</td>
            )}
            {statsAvailable.includes('shifts') && (
              <td className="p-2 border text-center">{formatStat(skater.shifts)}</td>
            )}
            {statsAvailable.includes('takeaways') && (
              <td className="p-2 border text-center">{formatStat(skater.takeaways)}</td>
            )}
            {statsAvailable.includes('giveaways') && (
              <td className="p-2 border text-center">{formatStat(skater.giveaways)}</td>
            )}
            {statsAvailable.includes('avgTimeOnIce') && (
              <td className="p-2 border text-center">{formatStat(skater.avgTimeOnIce || formatSecondsToGameTime(skater.avgTimeOnIcePerGame))}</td>
            )}
            {(statsAvailable.includes('faceoffWinningPctg') || statsAvailable.includes('faceoffWinPctg')) && (
              <td className="p-2 border text-center">{formatStat(skater.faceoffWinningPctg || skater.faceoffWinPctg, 3)}</td>
            )}
            {statsAvailable.includes('wins') && (
              <td className="p-2 border text-center">{formatStat(skater.wins)}</td>
            )}
            {statsAvailable.includes('losses') && (
              <td className="p-2 border text-center">{formatStat(skater.losses)}</td>
            )}
            {(statsAvailable.includes('otLosses') || statsAvailable.includes('overtimeLosses')) && (
              <td className="p-2 border text-center">{formatStat(skater.otLosses || skater.overtimeLosses)}</td>
            )}
            {statsAvailable.includes('shotsAgainst') && (
              <td className="p-2 border text-center">{formatStat(skater.shotsAgainst)}</td>
            )}
            {statsAvailable.includes('saves') && (
              <td className="p-2 border text-center">{formatStat(skater.saves)}</td>
            )}
            {statsAvailable.includes('goalsAgainst') && (
              <td className="p-2 border text-center">{formatStat(skater.goalsAgainst)}</td>
            )}
            {(statsAvailable.includes('savePctg') || statsAvailable.includes('savePercentage') ) && (
              <td className="p-2 border text-center">{formatStat(skater.savePctg || skater.savePercentage, 3)}</td>
            )}
            {(statsAvailable.includes('goalsAgainstAvg') || statsAvailable.includes('goalsAgainstAverage')) && (
              <td className="p-2 border text-center">{formatStat(skater.goalsAgainstAvg || skater.goalsAgainstAverage, 3)}</td>
            )}
            {statsAvailable.includes('shutouts') && (
              <td className="p-2 border text-center">{formatStat(skater.shutouts)}</td>
            )}
            {(statsAvailable.includes('toi') || statsAvailable.includes('timeOnIce')) && (
              <td className="p-2 border text-center">{formatStat(skater.toi || formatSecondsToGameTime(skater.timeOnIce))}</td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StatsTable;
