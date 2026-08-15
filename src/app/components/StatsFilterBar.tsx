'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Select from './Select';

export interface StatsFilterOption {
  value: string;
  label: string;
}

interface StatsFilterBarProps {
  seasons: StatsFilterOption[];
  franchises: StatsFilterOption[];
  season: string;
  gameType: string;
  team: string;
}

const GAME_TYPE_OPTIONS: StatsFilterOption[] = [
  { value: '2', label: 'Regular Season' },
  { value: '3', label: 'Playoffs' },
];

const StatsFilterBar: React.FC<StatsFilterBarProps> = ({
  seasons,
  franchises,
  season,
  gameType,
  team,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = (key: string, value: string, defaultValue: string) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (value === defaultValue) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }

    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div className="flex flex-wrap gap-3 text-sm">
      <Select
        aria-label="Season"
        value={season}
        onChange={(e) => setParam('season', e.target.value, seasons[0]?.value ?? '')}
      >
        {seasons.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <Select
        aria-label="Season Type"
        value={gameType}
        onChange={(e) => setParam('gameType', e.target.value, '2')}
      >
        {GAME_TYPE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <Select
        aria-label="Franchise"
        value={team}
        onChange={(e) => setParam('team', e.target.value, 'all')}
      >
        {franchises.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default StatsFilterBar;
