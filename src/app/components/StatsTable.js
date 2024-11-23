'use client';

import React from 'react';
import { formatStat, formatTextColorByBackgroundColor } from '../utils/formatters';
import Headshot from './Headshot';
import Link from 'next/link';
import { PropTypes } from 'prop-types';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import '@/app/assets/datatables.css';
 
const StatsTable = ({ stats, teamColor }) => {
  DataTable.use(DT);

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

  const statsAvailable = Object.keys(stats[0]);

  const statHeaders = [
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
    { key: 'timeOnIce', label: 'TOI', title: 'Time On Ice', altKey: 'toi' }
  ];

  const renderHeader = () => (
    <tr className="text-xs">
      <th className={`p-2 border text-center ${headerColorClass}`} style={headerStyle} data-orderable="false">#</th>
      <th className={`p-2 border text-left ${headerColorClass}`} style={headerStyle}>Name</th>
      <th className={`p-2 border text-center ${headerColorClass}`} style={headerStyle}>POS</th>
      {statHeaders.map(
        ({ key, label, title, altKey }) =>
          (statsAvailable.includes(key) || (altKey && statsAvailable.includes(altKey))) && (
            <th key={key} className={`p-2 border text-center ${headerColorClass}`} style={headerStyle}>
              <abbr className="underline decoration-dashed" title={title}>{label}</abbr>
            </th>
          )
      )}
    </tr>
  );

  const renderRow = (skater, i) => (
    <tr key={skater.playerId} className={`${i % 2 ? 'bg-slate-500/10' : ''}`}>
      <td className="p-2 border text-center w-10">
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
      <td className="p-2 border text-left text-nowrap">
        <Link href={`/player/${skater.playerId}`} className="font-bold">
          {skater.name?.default ? skater.name.default : `${skater.firstName.default} ${skater.lastName.default}`}
        </Link>
      </td>
      <td className="p-2 border text-center">{skater.position || skater.positionCode || 'G'}</td>
      {statHeaders.map(
        ({ key, altKey, precision }) =>
          (statsAvailable.includes(key) || (altKey && statsAvailable.includes(altKey))) && (
            <td key={key} className="p-2 border text-center">
              {skater[key] !== undefined ? (
                <>{formatStat(skater[key], precision)}</>
              ) : (
                <>{formatStat(skater[altKey], precision)}</>
              )}
            </td>
          )
      )}
    </tr>
  );

  return (
    <div className="overflow-x-auto">
      <DataTable className="text-sm w-full" options={{ paging: false, searching: false, pageLength: 1000, info: false, order: ['P'] }}>
        <thead>{renderHeader()}</thead>
        <tbody>{stats.map(renderRow)}</tbody>
      </DataTable>
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
