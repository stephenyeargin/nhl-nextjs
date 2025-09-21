import React from 'react';
import Link from 'next/link';
import TeamLogo from '@/app/components/TeamLogo';
import { formatLocalizedDate, formatStat } from '@/app/utils/formatters';

type StatHeader = {
  key: string;
  label: string;
  title: string;
  altKey?: string;
  precision?: number;
  unit?: string;
};

export interface PlayerGameSummary {
  gameId: string | number;
  gameDate: string;
  homeRoadFlag: 'H' | 'A';
  teamAbbrev: string;
  opponentAbbrev: string;
  [k: string]: unknown;
}

interface LastGamesTableProps {
  games: PlayerGameSummary[];
  statHeaders: readonly StatHeader[];
  headerColorClass?: string;
  headerStyle?: React.CSSProperties;
}

const LastGamesTable: React.FC<LastGamesTableProps> = ({
  games,
  statHeaders,
  headerColorClass,
  headerStyle,
}) => {
  const visibleHeaders = statHeaders.filter((h) => {
    const key = h.key;
    const altKey = h.altKey;
    const present = games.some(
      (g) =>
        Object.prototype.hasOwnProperty.call(g, key) ||
        (altKey && Object.prototype.hasOwnProperty.call(g, altKey))
    );

    return present;
  });

  return (
    <div className="overflow-x-auto">
      <table className="text-sm w-full">
        <thead>
          <tr className={`${headerColorClass ?? ''}`} style={headerStyle}>
            <th className="p-2 text-center w-10" style={headerStyle}>
              Date
            </th>
            <th className="p-2 text-left" style={headerStyle}>
              Opponent
            </th>
            {visibleHeaders.map((h) => (
              <th key={h.key} className="p-2 text-center" style={headerStyle}>
                <abbr className="underline decoration-dashed" title={h.title}>
                  {h.label}
                </abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {games.map((g, i) => (
            <tr key={i} className={`${i % 2 ? 'bg-slate-500/10' : ''}`}>
              <td className="p-2 border text-center">{formatLocalizedDate(g.gameDate)}</td>
              <td className="p-2 border text-left">
                <div className="font-bold">
                  {g.homeRoadFlag !== 'H' ? (
                    <div className="flex items-center gap-2">
                      <TeamLogo
                        team={g.teamAbbrev}
                        className="hidden md:block h-8 w-8"
                        alt={g.teamAbbrev}
                      />
                      <Link href={`/game/${g.gameId}`} className="font-bold underline">
                        {g.teamAbbrev}@{g.opponentAbbrev}
                      </Link>
                      <TeamLogo
                        team={g.opponentAbbrev}
                        className="hidden md:block h-8 w-8"
                        alt={g.opponentAbbrev}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <TeamLogo
                        team={g.opponentAbbrev}
                        className="hidden md:block h-8 w-8"
                        alt={g.opponentAbbrev}
                      />
                      <Link href={`/game/${g.gameId}`} className="font-bold underline">
                        {g.opponentAbbrev}@{g.teamAbbrev}
                      </Link>
                      <TeamLogo
                        team={g.teamAbbrev}
                        className="hidden md:block h-8 w-8"
                        alt={g.teamAbbrev}
                      />
                    </div>
                  )}
                </div>
              </td>
              {visibleHeaders.map((h) => {
                const key = h.key;
                const altKey = h.altKey;
                const precision = h.precision;
                const unit = h.unit;
                const primary = g[key as keyof typeof g];
                const alt = altKey ? (g[altKey as keyof typeof g] as any) : undefined;
                const val =
                  typeof primary === 'number' || typeof primary === 'string'
                    ? (primary as any)
                    : typeof alt === 'number' || typeof alt === 'string'
                      ? (alt as any)
                      : undefined;

                if (val === undefined) {
                  return (
                    <td key={key} className="p-2 border text-center text-xs">
                      --
                    </td>
                  );
                }

                if (key === 'plusMinus') {
                  const n = typeof val === 'number' ? val : Number(val);
                  const content = Number.isNaN(n) ? '--' : n > 0 ? `+${n}` : `${n}`;

                  return (
                    <td key={key} className="p-2 border text-center text-xs">
                      {content}
                    </td>
                  );
                }

                return (
                  <td key={key} className="p-2 border text-center text-xs">
                    {formatStat(val as any, precision, unit)}
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

export default LastGamesTable;
