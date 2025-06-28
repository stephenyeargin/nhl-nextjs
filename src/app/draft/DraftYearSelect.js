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
  return (
    <select
      className="p-2 rounded text-xl border bg-inherit text-white"
      value={draftYear}
      onChange={handleDraftYearChange}
    >
      {draftYears.map((y, i) => (
        <option key={i} value={y}>
          {y}
        </option>
      ))}
    </select>
  );
};

DraftYearSelect.propTypes = {
  draftYears: PropTypes.arrayOf(PropTypes.number).isRequired,
  draftYear: PropTypes.number.isRequired,
};

export default DraftYearSelect;
