'use client';

import React from 'react';

interface PlayoffYearSelectorProps {
  seasons: number[];
  year: number;
}

const PlayoffYearSelector: React.FC<PlayoffYearSelectorProps> = ({ seasons, year }) => {
  const handlePlayoffYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (/^\d+$/.test(selected)) {
      window.location.href = `/playoffs/${selected}`;
    } else {
      console.error('Invalid year selected:', selected);
    }
  };

  return (
    <select
      className="p-2 rounded-sm text-xl border bg-inherit text-white"
      value={year}
      onChange={handlePlayoffYearChange}
    >
      {seasons.map((y) => {
        const display = String(y).replace(/^\d{4}/, '');

        return (
          <option key={y} value={display}>
            {display}
          </option>
        );
      })}
    </select>
  );
};

export default PlayoffYearSelector;
