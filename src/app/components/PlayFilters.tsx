'use client';

import React from 'react';
import PeriodSelector from './PeriodSelector';

interface TeamFilterOption {
  id: number | string;
  placeName: { default: string };
}

interface PlayFiltersProps {
  periodData: { number?: number; maxRegulationPeriods?: number; [k: string]: unknown };
  activePeriod: number;
  onPeriodChange: (_n: number) => void;
  includeAll?: boolean;
  eventFilter: string | null;
  onEventFilterChange: (_v: string) => void;
  teamFilter: string | null;
  onTeamFilterChange: (_v: string) => void;
  awayTeam: TeamFilterOption;
  homeTeam: TeamFilterOption;
}

const PlayFilters: React.FC<PlayFiltersProps> = ({
  periodData,
  activePeriod,
  onPeriodChange,
  includeAll = true,
  eventFilter,
  onEventFilterChange,
  teamFilter,
  onTeamFilterChange,
  awayTeam,
  homeTeam,
}) => {
  const normalizedPeriodData = {
    ...periodData,
    number: periodData.number ?? periodData.maxRegulationPeriods ?? 3,
  };

  return (
    <div className="flex justify-center items-center my-5 text-xs md:text-sm">
      <PeriodSelector
        periodData={normalizedPeriodData}
        activePeriod={activePeriod}
        handlePeriodChange={onPeriodChange}
        includeAll={includeAll}
      />
      <div className="mx-2">
        <select
          className="p-2 min-w-[100px] md:min-w-[150px] border rounded-sm text-black dark:text-white bg-inherit"
          value={eventFilter || 'all'}
          onChange={(e) => onEventFilterChange(e.target.value)}
        >
          <option value="all">All Events</option>
          <option value="goal">Goals</option>
          <option value="shot-on-goal">Shots on Goal</option>
          <option value="missed-shot">Missed Shots</option>
          <option value="blocked-shot">Blocked Shots</option>
          <option value="hit">Hits</option>
          <option value="giveaway">Giveaways</option>
          <option value="takeaway">Takeaways</option>
          <option value="delayed-penalty">Delayed Penalties</option>
          <option value="penalty">Penalties</option>
          <option value="faceoff">Faceoffs</option>
          <option value="stoppage">Stoppage</option>
        </select>
      </div>
      <div>
        <select
          className="p-2 min-w-[100px] md:min-w-[150px] border rounded-sm text-black dark:text-white bg-inherit"
          value={teamFilter || 'all'}
          onChange={(e) => onTeamFilterChange(e.target.value)}
        >
          <option value="all">Both Teams</option>
          <option value={awayTeam.id}>{awayTeam.placeName.default}</option>
          <option value={homeTeam.id}>{homeTeam.placeName.default}</option>
        </select>
      </div>
    </div>
  );
};

export default PlayFilters;
