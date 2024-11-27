import React from 'react';
import { formatStat, formatTextColorByBackgroundColor } from '../utils/formatters';
import Headshot from './Headshot';
import Link from 'next/link';
import { PropTypes } from 'prop-types';

import '@/app/assets/datatables.css';
import '@/app/components/StatsTable.scss';

const StatsTable = ({ stats, teamColor }) => {
  if (!stats || stats.length === 0) {
    return null;
  }

  // Add team color if given
  let headerColorClass = 'bg-slate-200 dark:bg-slate-800 text-black dark:text-white';
  let headerStyle = {};
  if (teamColor) {
    headerColorClass = 'text-white';
    headerStyle = { backgroundColor: teamColor, color: formatTextColorByBackgroundColor(teamColor) };
  }

  // Get all possible stats in the set
  const properties = new Set();
  stats.forEach(player => {
    Object.keys(player).forEach(key => properties.add(key));
  });
  const statsAvailable = Array.from(properties);

  const statHeaders = [
    { key: 'position', label: 'POS', title: 'Position', altKey: 'positionCode' },
    { key: 'gamesPlayed', label: 'GP', title: 'Games Played' },
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
    { key: 'wins', label: 'W', title: 'Wins' },
    { key: 'losses', label: 'L', title: 'Losses' },
    { key: 'otLosses', label: 'OT', title: 'Overtime Losses', altKey: 'overtimeLosses' },
    { key: 'shotsAgainst', label: 'SA', title: 'Shots Against' },
    { key: 'saves', label: 'SV', title: 'Saves' },
    { key: 'goalsAgainst', label: 'GA', title: 'Goals Against' },
    { key: 'savePctg', label: 'SV%', title: 'Save Percentage', altKey: 'savePercentage', precision: 3 },
    { key: 'goalsAgainstAvg', label: 'GAA', title: 'Goals Against Average', altKey: 'goalsAgainstAverage', precision: 3 },
    { key: 'shutouts', label: 'SO', title: 'Shutouts' },
    { key: 'timeOnIce', label: 'TOI', title: 'Time On Ice', altKey: 'toi', unit: 'time' }
  ];

  const renderHeader = () => (
    <tr className="text-xs border">
      <th className={`p-2 text-center ${headerColorClass}`} style={headerStyle}>#</th>
      <th className={`p-2 text-left ${headerColorClass}`} style={headerStyle}>Name</th>
      {statHeaders.map(
        ({ key, label, title, altKey }) =>
          (statsAvailable.includes(key) || (altKey && statsAvailable.includes(altKey))) && (
            <th key={key} className={`p-2 text-center ${headerColorClass}`} style={headerStyle}>
              <abbr className="underline decoration-dashed" title={title}>{label}</abbr>
            </th>
          )
      )}
    </tr>
  );

  const renderRow = (skater) => (
    <tr key={skater.playerId}>
      <td className="p-2 border text-center w-10" data-order={skater?.sweaterNumber}>
        {skater.sweaterNumber ? (
          <Link href={`/player/${skater.playerId}`} className="font-bold">{skater.sweaterNumber}</Link>
        ) : (
          <Headshot
            playerId={skater.playerId}
            src={skater.headshot}
            alt={skater.name?.default || `${skater.firstName.default} ${skater.lastName.default}`}
            size="2"
            className="mx-auto"
          />
        )}
      </td>
      <td className="p-2 border text-left text-nowrap" data-order={skater.lastName?.default || skater.name?.default}>
        <Link href={`/player/${skater.playerId}`} className="font-bold">
          {skater.name?.default ? skater.name.default : `${skater.firstName.default} ${skater.lastName.default}`}
        </Link>
      </td>
      {statHeaders.map(
        ({ key, altKey, precision, unit }) =>
          (statsAvailable.includes(key) || (altKey && statsAvailable.includes(altKey))) && (
            <td key={key} className="p-2 border text-center">
              {skater[key] !== undefined ? (
                <>{formatStat(skater[key], precision, unit)}</>
              ) : (
                <>{formatStat(skater[altKey], precision, unit)}</>
              )}
            </td>
          )
      )}
    </tr>
  );

  return (
    <div className="overflow-x-auto">
      <table className="text-sm w-full statsTable">
        <thead>{renderHeader()}</thead>
        <tbody>{stats.map(renderRow)}</tbody>
      </table>
    </div>
  );
};

StatsTable.propTypes = {
  stats: PropTypes.arrayOf(PropTypes.object).isRequired,
  teamColor: PropTypes.string,
};

StatsTable.defaultProps = {
  teamColor: '#000',
};

export default StatsTable;
