'use client';
import React, { useMemo, useState } from 'react';
import type { DraftData, DraftRankingsData } from '@/app/types/draft';
import DraftYearSelect from '@/app/components/DraftYearSelect';
import DraftPicks from '@/app/components/DraftPicks';
import DraftRankings from '@/app/components/DraftRankings';

interface DraftHeaderProps {
  draftData: DraftData;
  rankingsData?: DraftRankingsData | null;
}

const DraftHeader: React.FC<DraftHeaderProps> = ({ draftData, rankingsData }) => {
  const showRankings = !draftData.picks || draftData.picks.length === 0;
  const [teamFilter, setTeamFilter] = useState<string>('');

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
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {draftData.draftYear} NHL Entry Draft
          {showRankings && <span className=""> Rankings</span>}
        </h1>
        <div className="flex justify-center md:justify-center">
          <DraftYearSelect draftYears={draftData.draftYears} draftYear={draftData.draftYear} />
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
      {showRankings && rankingsData ? (
        <DraftRankings rankingsData={rankingsData} />
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
        />
      )}
    </div>
  );
};

export default DraftHeader;
