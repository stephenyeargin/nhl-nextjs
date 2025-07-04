'use client';
import React from 'react';
import PropTypes from 'prop-types';

const handleDraftYearChange = (e) => {
  const year = e.target.value;
  if (/^\d+$/.test(year)) {
    window.location = `/draft/${year}`;
  } else {
    console.error('Invalid year selected:', year);
  }
};

const DraftYearSelect = ({ draftYears, draftYear }) => {
  const currentIndex = draftYears.indexOf(draftYear);
  const prevYear = currentIndex > 0 ? draftYears[currentIndex - 1] : null;
  const nextYear = currentIndex < draftYears.length - 1 ? draftYears[currentIndex + 1] : null;

  const handlePrevYear = () => {
    if (prevYear) {
      window.location = `/draft/${prevYear}`;
    }
  };

  const handleNextYear = () => {
    if (nextYear) {
      window.location = `/draft/${nextYear}`;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 text-right">
        {prevYear && (
          <button onClick={handlePrevYear} className="font-bold underline">
            « {prevYear}
          </button>
        )}
      </div>
      <select
        className="p-2 rounded text-xl border bg-inherit text-black dark:text-white"
        value={draftYear}
        onChange={handleDraftYearChange}
      >
        {draftYears.map((y, i) => (
          <option key={i} value={y}>
            {y}
          </option>
        ))}
      </select>
      <div className="w-20 text-left">
        {nextYear && (
          <button onClick={handleNextYear} className="font-bold underline">
            {nextYear} »
          </button>
        )}
      </div>
    </div>
  );
};

DraftYearSelect.propTypes = {
  draftYears: PropTypes.arrayOf(PropTypes.number).isRequired,
  draftYear: PropTypes.number.isRequired,
};

export default DraftYearSelect;
