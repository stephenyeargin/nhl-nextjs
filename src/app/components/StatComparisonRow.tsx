import React from 'react';
import { formatOrdinalNumber, formatStatValue } from '../utils/formatters';
import { TEAM_STATS } from '../utils/constants';

interface TeamColorData {
  teamColor?: string;
  secondaryTeamColor?: string;
  [key: string]: any; // Allow additional fields until a shared Team type is created
}

interface TeamWrapper {
  data: TeamColorData;
  [key: string]: any;
}

type TeamStatKey = keyof typeof TEAM_STATS;

interface StatComparisonRowProps {
  awayStat: number;
  homeStat: number;
  awayStatRank?: number | string;
  homeStatRank?: number | string;
  awayTeam: TeamWrapper;
  homeTeam: TeamWrapper;
  stat: TeamStatKey; // key into TEAM_STATS
}

const StatComparisonRow: React.FC<StatComparisonRowProps> = ({ awayStat, awayStatRank, awayTeam, stat, homeStat, homeStatRank, homeTeam }) => {
  // Calculate the total for scaling the indicator bar
  const totalStat = awayStat + homeStat;
  const awayPercentage = totalStat > 0 ? (awayStat / totalStat) * 100 : 50;
  const homePercentage = totalStat > 0 ? 100 - awayPercentage : 50;

  return (
    <div className="mb-5">
      {/* First Row: Stats with Stat Name in the Center */}
      <div className="flex items-center">
        <div className="flex-1 text-left font-lg font-bold">{formatStatValue(stat, awayStat)}</div>
        <div className="flex-1 text-center text-xs">{TEAM_STATS[stat]}</div>
        <div className="flex-1 text-right font-lg font-bold">{formatStatValue(stat, homeStat)}</div>
      </div>

      {/* Second Row: Horizontal Bar Indicator */}
      <div className="relative my-1 bg-inherit h-3">
        <div
          className="absolute top-0 left-0 bg-black-500 h-3"
          style={{ width: `${awayPercentage < 100 ? awayPercentage - 1 : 100}%`, backgroundColor: awayTeam.data.teamColor, borderBottom: `2px solid ${awayTeam.data.secondaryTeamColor}` }}
        />
        <div
          className="absolute top-0 right-0 bg-white-500 h-3"
          style={{ width: `${homePercentage < 100 ? homePercentage - 1 : 100}%`, backgroundColor: homeTeam.data.teamColor, borderBottom: `2px solid ${homeTeam.data.secondaryTeamColor}` }}
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

export default StatComparisonRow;