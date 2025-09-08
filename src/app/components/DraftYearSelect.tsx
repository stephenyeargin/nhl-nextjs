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
    <div className="inline-flex items-stretch gap-1 rounded-md bg-inherit border overflow-hidden whitespace-nowrap">
      <button
        type="button"
        onClick={handlePrevYear}
        disabled={!prevYear}
        className="px-3 py-2 text-sm font-semibold disabled:opacity-30 whitespace-nowrap"
        aria-label={prevYear ? `Go to ${prevYear} draft` : 'No previous draft year'}
      >
        « {prevYear}
      </button>
      <select
        className="px-3 py-2 text-base font-bold bg-inherit whitespace-nowrap border-l border-r"
        value={draftYear}
        onChange={handleDraftYearChange}
        aria-label="Draft year"
      >
        {draftYears.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleNextYear}
        disabled={!nextYear}
        className="px-3 py-2 text-sm font-semibold disabled:opacity-30 whitespace-nowrap"
        aria-label={nextYear ? `Go to ${nextYear} draft` : 'No next draft year'}
      >
        {nextYear} »
      </button>
    </div>
  );
};

export default DraftYearSelect;
