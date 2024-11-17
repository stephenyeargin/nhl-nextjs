import { formatPercentage, formatStat } from "../utils/formatters";

const StatsTable = ({ stats, goalieMode = false }) => {

  if (goalieMode) {
    return (
      <table className="text-sm w-full">
        <thead>
          <tr>
            <th className="p-2 border text-center">#</th>
            <th className="p-2 border text-left">Player</th>
            <th className="p-2 border text-center">GP</th>
            <th className="p-2 border text-center">W</th>
            <th className="p-2 border text-center">L</th>
            <th className="p-2 border text-center">OTL</th>
            <th className="p-2 border text-center">SA</th>
            <th className="p-2 border text-center">GA</th>
            <th className="p-2 border text-center">GAA</th>
            <th className="p-2 border text-center">Save %</th>
            <th className="p-2 border text-center">Shutouts</th>
            <th className="p-2 border text-center">Saves</th>
            <th className="p-2 border text-center">TOI</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((skater) => (
            <tr key={skater.playerId}>
              <td className="p-2 border text-left">
                <div className="text-xs font-bold rounded-full border p-1 text-center">{skater.sweaterNumber}</div>
              </td>
              <td className="p-2 border text-left">{skater.name.default}</td>
              <td className="p-2 border text-center">{formatStat(skater.gamesPlayed)}</td>
              <td className="p-2 border text-center">{formatStat(skater.wins)}</td>
              <td className="p-2 border text-center">{formatStat(skater.losses)}</td>
              <td className="p-2 border text-center">{formatStat(skater.otLosses)}</td>
              <td className="p-2 border text-center">{formatStat(skater.shotsAgainst)}</td>
              <td className="p-2 border text-center">{formatStat(skater.goalsAgainst)}</td>
              <td className="p-2 border text-center">{formatStat(skater.goalsAgainstAvg, 3)}</td>
              <td className="p-2 border text-center">{formatStat(skater.savePctg, 3)}</td>
              <td className="p-2 border text-center">{formatStat(skater.shutouts)}</td>
              <td className="p-2 border text-center">{formatStat(skater.saves)}</td>
              <td className="p-2 border text-center">{formatStat(skater.toi)}</td>

            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <table className="text-sm w-full">
      <thead>
        <tr>
          <th className="p-2 border text-center">#</th>
          <th className="p-2 border text-left">Player</th>
          <th className="p-2 border text-center">GP</th>
          <th className="p-2 border text-center">G</th>
          <th className="p-2 border text-center">A</th>
          <th className="p-2 border text-center">P</th>
          <th className="p-2 border text-center">+/-</th>
          <th className="p-2 border text-center">PIM</th>
          <th className="p-2 border text-center">Avg Pts</th>
          <th className="p-2 border text-center">Avg TOI</th>
          <th className="p-2 border text-center">GWG</th>
          <th className="p-2 border text-center">S</th>
          <th className="p-2 border text-center">S%</th>
          <th className="p-2 border text-center">FOW%</th>
          <th className="p-2 border text-center">PPG</th>
          <th className="p-2 border text-center">BS</th>
          <th className="p-2 border text-center">H</th>
        </tr>
      </thead>
      <tbody>
        {stats.map((skater) => (
          <tr key={skater.playerId}>
            <td className="p-2 border text-left">
              <div className="text-xs font-bold rounded-full border p-1 text-center">{skater.sweaterNumber}</div>
            </td>
            <td className="p-2 border text-left">{skater.name.default}</td>
            <td className="p-2 border text-center">{formatStat(skater.gamesPlayed)}</td>
            <td className="p-2 border text-center">{formatStat(skater.goals)}</td>
            <td className="p-2 border text-center">{formatStat(skater.assists)}</td>
            <td className="p-2 border text-center">{formatStat(skater.points)}</td>
            <td className="p-2 border text-center">{formatStat(skater.plusMinus)}</td>
            <td className="p-2 border text-center">{formatStat(skater.pim)}</td>
            <td className="p-2 border text-center">{formatStat(skater.avgPoints)}</td>
            <td className="p-2 border text-center">{formatStat(skater.avgTimeOnIce)}</td>
            <td className="p-2 border text-center">{formatStat(skater.gameWinningGoals)}</td>
            <td className="p-2 border text-center">{formatStat(skater.shots)}</td>
            <td className="p-2 border text-center">{formatStat(skater.shootingPctg, 3)}</td>
            <td className="p-2 border text-center">{formatStat(skater.faceoffWinningPctg, 3)}</td>
            <td className="p-2 border text-center">{formatStat(skater.powerPlayGoals)}</td>
            <td className="p-2 border text-center">{formatStat(skater.blockedShots)}</td>
            <td className="p-2 border text-center">{formatStat(skater.hits)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StatsTable;
