'use client';
import React from 'react';
import type { DraftYearSelectProps } from '@/app/types/draft';

const handleDraftYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const year = e.target.value;
  if (/^\d+$/.test(year)) {
    window.location.href = `/draft/${year}`;
  } else {
    // eslint-disable-next-line no-console
    console.error('Invalid year selected:', year);
  }
};

const DraftYearSelect: React.FC<DraftYearSelectProps> = ({ draftYears, draftYear }) => {
  const currentIndex = draftYears.indexOf(draftYear);
  const prevYear = currentIndex > 0 ? draftYears[currentIndex - 1] : null;
  const nextYear = currentIndex < draftYears.length - 1 ? draftYears[currentIndex + 1] : null;

  const handlePrevYear = () => {
    if (prevYear) {
      window.location.href = `/draft/${prevYear}`;
    }
  };

  const handleNextYear = () => {
    if (nextYear) {
      window.location.href = `/draft/${nextYear}`;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 text-right">
        {prevYear && (
          <button onClick={handlePrevYear} className="font-bold underline" type="button">
            « {prevYear}
          </button>
        )}
      </div>
      <select
        className="p-2 rounded text-xl border bg-inherit text-black dark:text-white"
        value={draftYear}
        onChange={handleDraftYearChange}
      >
        {draftYears.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <div className="w-20 text-left">
        {nextYear && (
          <button onClick={handleNextYear} className="font-bold underline" type="button">
            {nextYear} »
          </button>
        )}
      </div>
    </div>
  );
};

export default DraftYearSelect;
