'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { DraftData, DraftRankingsData } from '@/app/types/draft';
import DraftYearSelect from '@/app/components/DraftYearSelect';
import DraftPicks from '@/app/components/DraftPicks';
import DraftRankings from '@/app/components/DraftRankings';

interface DraftHeaderProps {
  draftData: DraftData;
  rankingsData?: DraftRankingsData | null;
  preferredView?: 'picks' | 'rankings';
}

function parseDayLabel(state?: string): string | null {
  if (!state) {
    return null;
  }
  const match = state.match(/^live[Dd]ay(\d+)$/i);
  if (!match) {
    return null;
  }

  return `Day ${match[1]}`;
}

const DraftHeader: React.FC<DraftHeaderProps> = ({
  draftData,
  rankingsData,
  preferredView = 'picks',
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasPicks = !!draftData.picks && draftData.picks.length > 0;
  const canToggleRankings =
    hasPicks &&
    !!rankingsData &&
    Array.isArray(rankingsData.rankings) &&
    rankingsData.rankings.length > 0;
  const showRankings = !hasPicks || (canToggleRankings && preferredView === 'rankings');
  const [teamFilter, setTeamFilter] = useState<string>('');

  const isLive = !!draftData.state?.toLowerCase().startsWith('live');
  const dayLabel = parseDayLabel(draftData.state);

  useEffect(() => {
    if (!isLive) {
      return;
    }
    const interval = setInterval(() => router.refresh(), 60_000);

    return () => clearInterval(interval);
  }, [isLive, router]);

  const getViewHref = (view: 'picks' | 'rankings') => {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (view === 'rankings') {
      nextParams.set('view', 'rankings');
    } else {
      nextParams.delete('view');
    }

    const query = nextParams.toString();

    return query ? `${pathname}?${query}` : pathname;
  };

  const teams = useMemo(() => {
    const map = new Map<string, string>();
    draftData.picks.forEach((p) => {
      if (!map.has(p.teamAbbrev)) {
        map.set(p.teamAbbrev, p.teamName?.default || p.teamAbbrev);
      }
    });

    return Array.from(map.entries())
      .map(([abbrev, name]) => ({ abbrev, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [draftData.picks]);

  return (
    <div>
      <div className="mb-6 flex flex-col items-center text-center gap-4 md:flex-row md:items-center md:justify-between md:text-left">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3 flex-wrap">
            {draftData.draftYear} NHL Entry Draft
            {isLive && (
              <span className="text-sm font-semibold text-red-500 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                LIVE
              </span>
            )}
          </h1>
          {dayLabel && <p className="text-sm text-slate-500 mt-1">{dayLabel}</p>}
        </div>
        <div className="flex justify-center md:justify-center">
          <DraftYearSelect
            draftYears={draftData.draftYears}
            draftYear={draftData.draftYear}
            view={showRankings ? 'rankings' : undefined}
          />
        </div>
        {!showRankings && (
          <div className="flex justify-center md:justify-end">
            <div className="flex items-center gap-2">
              <select
                aria-label="Filter by team"
                className="px-3 py-2 rounded-md border bg-inherit text-sm"
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
              >
                <option value="">All Teams</option>
                {teams.map((t) => (
                  <option key={t.abbrev} value={t.abbrev}>
                    {t.name}
                  </option>
                ))}
              </select>
              {teamFilter && (
                <button
                  type="button"
                  className="text-xs font-medium underline"
                  onClick={() => setTeamFilter('')}
                  aria-label="Reset team filter"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {canToggleRankings && (
        <div className="mb-4 overflow-x-auto">
          <div className="inline-flex" role="tablist" aria-label="Draft content view">
            {[
              { key: 'picks' as const, label: 'Draft Picks' },
              { key: 'rankings' as const, label: 'Pre-Draft Rankings' },
            ].map(({ key, label }, index, arr) => {
              const active =
                (showRankings && key === 'rankings') || (!showRankings && key === 'picks');
              let linkClasses =
                'cursor-pointer flex items-center p-2 text-sm whitespace-nowrap bg-inherit text-black dark:text-white border-t border-b border-slate-300 dark:border-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:ring-inset';

              if (index === 0) {
                linkClasses += ' border-l rounded-l-md';
              } else if (index === arr.length - 1) {
                linkClasses += ' border-l border-r rounded-r-md';
              } else {
                linkClasses += ' border-l';
              }

              if (active) {
                linkClasses += ' bg-slate-200 dark:bg-slate-800';
              }

              return (
                <Link
                  key={key}
                  href={getViewHref(key)}
                  role="tab"
                  aria-current={active ? 'page' : undefined}
                  aria-selected={active}
                  className={linkClasses}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {showRankings && rankingsData ? (
        <DraftRankings
          rankingsData={rankingsData}
          viewMode={canToggleRankings ? 'rankings' : undefined}
        />
      ) : showRankings ? (
        <div className="text-center text-slate-500 py-8">
          No draft picks or rankings available yet.
        </div>
      ) : (
        <DraftPicks
          draftData={draftData}
          teamFilter={teamFilter}
          onTeamFilterChange={setTeamFilter}
          hideFilter
          state={draftData.state}
        />
      )}
    </div>
  );
};

export default DraftHeader;
