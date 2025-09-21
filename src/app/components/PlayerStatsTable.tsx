import React from 'react';
import TeamLogo from '@/app/components/TeamLogo';
import statsStyles from '@/app/components/StatsTable.module.scss';
import { formatSeason, formatStat } from '@/app/utils/formatters';

type StatHeader = {
  key: string;
  label: string;
  title: string;
  altKey?: string;
  precision?: number;
};

export interface PlayerSeasonTotals {
  season: string | number;
  leagueAbbrev: string;
  gameTypeId: number;
  teamName?: { default?: string };
  [stat: string]: string | number | { default?: string } | undefined;
}

interface PlayerStatsTableProps {
  stats: PlayerSeasonTotals[];
  statHeaders: readonly StatHeader[];
  showLeague: boolean;
  headerColorClass: string;
  headerStyle?: React.CSSProperties;
}

const PlayerStatsTable: React.FC<PlayerStatsTableProps> = ({
  stats,
  statHeaders,
  showLeague,
  headerColorClass,
  headerStyle,
}) => {
  const visibleHeaders = statHeaders.filter((h) => {
    const key = h.key as string;
    const altKey = h.altKey;
    const present = stats.some(
      (season) =>
        Object.prototype.hasOwnProperty.call(season, key) ||
        (altKey && Object.prototype.hasOwnProperty.call(season, altKey))
    );

    return present;
  });

  return (
    <div className="overflow-x-auto">
      <table className={statsStyles.statsTable}>
        <thead>
          <tr className={`text-xs border ${headerColorClass}`}>
            <th className={'p-2 text-center'} style={headerStyle}>
              Season
            </th>
            <th className={'p-2 text-left'} style={headerStyle}>
              Team
            </th>
            {showLeague && (
              <th className={'p-2 text-left'} style={headerStyle}>
                League
              </th>
            )}
            {visibleHeaders.map((h) => {
              const key = h.key;
              const label = h.label;
              const title = h.title as string;

              return (
                <th key={key} className={`p-2 text-center ${headerColorClass}`} style={headerStyle}>
                  <abbr className="underline decoration-dashed" title={title}>
                    {label}
                  </abbr>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {stats.map((season, i) => (
            <tr key={i} className={`${i % 2 ? 'bg-slate-500/10' : ''}`}>
              <td className="p-2 border text-center">{formatSeason(season.season)}</td>
              <td className="">
                <div className="flex gap-1 items-center">
                  {season.leagueAbbrev === 'NHL' && (
                    <TeamLogo
                      team={(season.teamName as any)?.default}
                      className="h-8 w-8 hidden md:block"
                      alt={String((season.teamName as any)?.default || '')}
                    />
                  )}
                  {(season.teamName as any)?.default}
                </div>
              </td>
              {showLeague && <td className="text-left">{season.leagueAbbrev}</td>}
              {visibleHeaders.map((h) => {
                const key = h.key;
                const altKey = h.altKey;
                const precision = h.precision;
                const primaryVal = season[key];
                const altVal = altKey ? season[altKey] : undefined;
                const value =
                  typeof primaryVal === 'number' || typeof primaryVal === 'string'
                    ? primaryVal
                    : typeof altVal === 'number' || typeof altVal === 'string'
                      ? altVal
                      : undefined;

                const content = (() => {
                  if (value === undefined) {
                    return '--';
                  }
                  if (key === 'plusMinus') {
                    const n = typeof value === 'number' ? value : Number(value);
                    if (Number.isNaN(n)) {
                      return '--';
                    }

                    return n > 0 ? `+${n}` : `${n}`;
                  }

                  return formatStat(value as any, precision);
                })();

                return (
                  <td key={key} className="p-2 border text-center text-xs">
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerStatsTable;
