import React from 'react';
import { PropTypes } from 'prop-types';
import { formatOrdinalNumber, formatStatValue } from '../utils/formatters';
import { TEAM_STATS } from '../utils/constants';

const StatComparisonRow = ({ awayStat, awayStatRank, awayTeam, stat, homeStat, homeStatRank, homeTeam }) => {
  // Calculate the total for scaling the indicator bar
  const totalStat = awayStat + homeStat;
  const awayPercentage = totalStat > 0 ? (awayStat / totalStat) * 100 : 50;
  const homePercentage = totalStat > 0 ? 100 - awayPercentage : 50;

  return (
    <div className="mb-5">
      {/* First Row: Stats with Stat Name in the Center */}
      <div className="flex items-center">
        <div className="flex-1 text-left font-lg font-bold">{formatStatValue(stat, awayStat)}</div>
        <div className="flex-1 text-center text-sm">{TEAM_STATS[stat]}</div>
        <div className="flex-1 text-right font-lg font-bold">{formatStatValue(stat, homeStat)}</div>
      </div>

      {/* Second Row: Horizontal Bar Indicator */}
      <div className="relative my-1 h-2 bg-white">
        <div
          className="absolute top-0 left-0 h-full bg-black-500"
          style={{ width: `${awayPercentage < 100 ? awayPercentage - 0.5 : 100}%`, backgroundColor: awayTeam.data.teamColor }}
        />
        <div
          className="absolute top-0 right-0 h-full bg-white-500"
          style={{ width: `${homePercentage < 100 ? homePercentage - 0.5 : 100}%`, backgroundColor: homeTeam.data.teamColor }}
        />
      </div>
      {/* Third Row: Ranks in the Center */}
      {awayStatRank && homeStatRank && (
        <div className="flex items-center">
          <div className="flex-1 text-left text-black/50 dark:text-white/50">{typeof awayStatRank === 'string' ? awayStatRank : formatOrdinalNumber(awayStatRank)}</div>
          <div className="flex-1 text-right text-black/50 dark:text-white/50">{typeof homeStatRank === 'string' ? homeStatRank : formatOrdinalNumber(homeStatRank)}</div>
        </div>
      )}
    </div>
  );
};

StatComparisonRow.propTypes = {
  awayStat: PropTypes.number.isRequired,
  awayStatRank: PropTypes.number,
  awayTeam: PropTypes.object.isRequired,
  homeStat: PropTypes.number.isRequired,
  homeStatRank: PropTypes.number,
  homeTeam: PropTypes.object.isRequired,
  stat: PropTypes.string.isRequired,
};

export default StatComparisonRow;