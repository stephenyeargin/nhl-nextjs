'use client';
import React, { useMemo, useState } from 'react';
import standingsStyles from '@/app/components/StandingsTable.module.scss';
import TeamLogo from '@/app/components/TeamLogo';
import type { DraftData, DraftPick } from '@/app/types/draft';

interface DraftPicksProps {
  draftData: DraftData;
  teamFilter?: string; // controlled value (optional)
  onTeamFilterChange?: (_team: string) => void; // controlled change handler
  hideFilter?: boolean; // when true, don't render internal filter UI
}

// Human friendly round labels (fallback to generic if out of range)
const roundNames = [
  '',
  'Round 1',
  'Round 2',
  'Round 3',
  'Round 4',
  'Round 5',
  'Round 6',
  'Round 7',
];

const DraftPicks: React.FC<DraftPicksProps> = ({
  draftData,
  teamFilter: controlledTeamFilter,
  onTeamFilterChange,
  hideFilter = false,
}) => {
  const [internalTeamFilter, setInternalTeamFilter] = useState<string>(''); // empty = all
  const isControlled = controlledTeamFilter !== undefined && onTeamFilterChange;
  const teamFilter = isControlled ? (controlledTeamFilter as string) : internalTeamFilter;
  const setTeamFilter = (val: string) => {
    if (isControlled) {
      (onTeamFilterChange as (_t: string) => void)(val);
    } else {
      setInternalTeamFilter(val);
    }
  };

  // Unique teams participating in this draft (based on teamAbbrev)
  const teams = useMemo(() => {
    const map = new Map<string, { abbrev: string; name: string; logo?: string }>();
    draftData.picks.forEach((p) => {
      if (!map.has(p.teamAbbrev)) {
        map.set(p.teamAbbrev, {
          abbrev: p.teamAbbrev,
          name: p.teamName?.default || p.teamAbbrev,
          logo: p.teamLogoLight,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [draftData.picks]);

  const filteredPicksByRound: Record<number, DraftPick[]> = useMemo(() => {
    return draftData.selectableRounds.reduce(
      (acc: Record<number, DraftPick[]>, round: number) => {
        const picks = draftData.picks.filter((pick) => pick.round === round);
        acc[round] = teamFilter ? picks.filter((p) => p.teamAbbrev === teamFilter) : picks;

        return acc;
      },
      {} as Record<number, DraftPick[]>
    );
  }, [draftData.picks, draftData.selectableRounds, teamFilter]);

  const visibleRounds = draftData.selectableRounds.filter(
    (r) => filteredPicksByRound[r] && filteredPicksByRound[r].length > 0
  );

  return (
    <div>
      {!hideFilter && (
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <select
              aria-label="Filter by team"
              className="px-3 py-2 rounded-md border bg-inherit text-base"
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
      {visibleRounds.length === 0 && (
        <div className="text-center text-slate-500 py-8">No picks for the selected team.</div>
      )}
      {visibleRounds.map((round) => (
        <div key={round} className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">{roundNames[round] || `Round ${round}`}</h2>
          <div className="overflow-x-auto">
            <table className={`${standingsStyles.standingsTable} border-collapse`}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Team</th>
                  <th>Player</th>
                  <th>Pos</th>
                  <th>Country</th>
                  <th>Ht/Wt</th>
                  <th>Amateur Club</th>
                </tr>
              </thead>
              <tbody>
                {filteredPicksByRound[round].map((pick) => (
                  <tr key={pick.overallPick}>
                    <td>{pick.overallPick}</td>
                    <td>
                      <div className="flex gap-2 items-center">
                        <TeamLogo
                          src={pick.teamLogoLight}
                          alt={pick.teamAbbrev}
                          className="h-8 w-8 hidden md:block"
                          team={pick.teamAbbrev}
                        />
                        <a className="font-semibold" href={`/team/${pick.teamAbbrev}`}>
                          {pick.teamName?.default}
                        </a>
                      </div>
                      {pick.teamAbbrev !== pick.teamPickHistory && pick.teamPickHistory && (
                        <div className="text-slate-500 ps-4 text-xs">
                          ↳ {pick.teamPickHistory.replace(/-/g, ' » ')}
                        </div>
                      )}
                    </td>
                    <td>
                      {pick.firstName?.default || ''} {pick.lastName?.default || ''}
                    </td>
                    <td>{pick.positionCode || ''}</td>
                    <td>{pick.countryCode || ''}</td>
                    <td>
                      {pick.height && pick.weight
                        ? `${Math.floor(pick.height / 12)}'${pick.height % 12}" / ${pick.weight}`
                        : ''}
                    </td>
                    <td>
                      {pick.amateurClubName || ''}
                      {pick.amateurLeague ? ` (${pick.amateurLeague})` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DraftPicks;
