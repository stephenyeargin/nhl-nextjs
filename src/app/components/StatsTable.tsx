import React from 'react';
import Link from 'next/link';
import Headshot from '@/app/components/Headshot';
import { formatStat, formatTextColorByBackgroundColor } from '@/app/utils/formatters';

import '@/app/assets/datatables.css';
import styles from '@/app/components/StatsTable.module.scss';
import { getTeamDataByAbbreviation } from '../utils/teamData';

interface PlayerName { default?: string }
interface PlayerStats {
  playerId: number | string;
  sweaterNumber?: number;
  headshot?: string;
  name?: PlayerName;
  firstName?: PlayerName;
  lastName?: PlayerName;
  [key: string]: any; // dynamic stat fields
}
interface StatsTableProps { stats: PlayerStats[]; team?: string }

const StatsTable: React.FC<StatsTableProps> = ({ stats, team }) => {
  if (!stats || stats.length === 0) {
    return null;
  }

  // Add team color if given
  let headerStyle: React.CSSProperties = {};
  if (team) {
    const { teamColor } = getTeamDataByAbbreviation(team, true);
    headerStyle = { backgroundColor: teamColor, color: formatTextColorByBackgroundColor(teamColor) };
  }

  // Get all possible stats in the set
  const properties = new Set<string>();
  stats.forEach((player) => {
    Object.keys(player).forEach((key) => properties.add(key));
  });
  const statsAvailable = Array.from(properties);

  const statHeaders = [
    { key: 'position', label: 'POS', title: 'Position', altKey: 'positionCode' },
    { key: 'gamesPlayed', label: 'GP', title: 'Games Played' },
    { key: 'wins', label: 'W', title: 'Wins' },
    { key: 'losses', label: 'L', title: 'Losses' },
    { key: 'otLosses', label: 'OT', title: 'Overtime Losses', altKey: 'overtimeLosses' },
    { key: 'shotsAgainst', label: 'SA', title: 'Shots Against' },
    { key: 'saves', label: 'SV', title: 'Saves' },
    { key: 'goalsAgainst', label: 'GA', title: 'Goals Against' },
    { key: 'savePctg', label: 'SV%', title: 'Save Percentage', altKey: 'savePercentage', precision: 3 },
    { key: 'goalsAgainstAvg', label: 'GAA', title: 'Goals Against Average', altKey: 'goalsAgainstAverage', precision: 3 },
    { key: 'shutouts', label: 'SO', title: 'Shutouts' },
    { key: 'goals', label: 'G', title: 'Goals Scored' },
    { key: 'assists', label: 'A', title: 'Assists' },
    { key: 'points', label: 'P', title: 'Points' },
    { key: 'plusMinus', label: '+/-', title: 'Plus/Minus' },
    { key: 'pim', label: 'PIM', title: 'Penalty Minutes', altKey: 'penaltyMinutes' },
    { key: 'powerPlayGoals', label: 'PPG', title: 'Power Play Goals' },
    { key: 'gameWinningGoals', label: 'GWG', title: 'Game-Winning Goals' },
    { key: 'shots', label: 'S', title: 'Shots on Goal', altKey: 'sog' },
    { key: 'hits', label: 'H', title: 'Hits' },
    { key: 'shifts', label: 'SH', title: 'Shifts' },
    { key: 'takeaways', label: 'TA', title: 'Takeaways' },
    { key: 'giveaways', label: 'GA', title: 'Giveaways' },
    { key: 'avgTimeOnIce', label: 'TOI/G', title: 'Time On Ice per Game' },
    { key: 'faceoffWinPctg', label: 'FO%', title: 'Faceoff Win Percentage', altKey: 'faceoffWinningPctg', precision: 3 },
    { key: 'timeOnIce', label: 'TOI', title: 'Time On Ice', altKey: 'toi', unit: 'time' }
  ];

  const renderHeader = () => (
    <tr>
      <th className="text-center" style={headerStyle}>#</th>
      <th className="text-left" style={headerStyle}>Name</th>
      {statHeaders.map(
        ({ key, label, title, altKey }) =>
          (statsAvailable.includes(key) || (altKey && statsAvailable.includes(altKey))) && (
            <th key={key} className="text-center" style={headerStyle}>
              <abbr className="underline decoration-dashed" title={title}>{label}</abbr>
            </th>
          )
      )}
    </tr>
  );

  const renderRow = (skater: PlayerStats) => (
    <tr key={skater.playerId}>
      <td className="text-center w-10" data-order={skater?.sweaterNumber}>
        {skater.sweaterNumber ? (
          <Link href={`/player/${skater.playerId}`} className="font-bold">{skater.sweaterNumber}</Link>
        ) : (
          <Headshot
            playerId={skater.playerId}
            src={skater.headshot}
            alt={skater.name?.default || `${skater.firstName?.default} ${skater.lastName?.default}`}
            size="2"
            className="mx-auto"
            team={team}
          />
        )}
      </td>
      <td className="text-left text-nowrap" data-order={skater.lastName?.default || skater.name?.default}>
        <Link href={`/player/${skater.playerId}`} className="font-bold">
          {skater.name?.default ? skater.name.default : `${skater.firstName?.default} ${skater.lastName?.default}`}
        </Link>
      </td>
      {statHeaders.map(
        ({ key, altKey, precision, unit }) =>
          (statsAvailable.includes(key) || (altKey && statsAvailable.includes(altKey))) && (
            <td key={key} className="text-center">
              {skater[key] !== undefined
                ? <>{formatStat(skater[key], precision, unit)}</>
                : <>{formatStat(skater[altKey as string], precision, unit)}</>}
            </td>
          )
      )}
    </tr>
  );

  return (
    <div className="overflow-x-auto">
  <table className={styles.statsTable}>
        <thead>{renderHeader()}</thead>
        <tbody>{stats.map(renderRow)}</tbody>
      </table>
    </div>
  );
};

export default StatsTable;
