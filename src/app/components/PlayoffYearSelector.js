'use client';

import React from 'react';
import { PropTypes } from 'prop-types';

const handlePlayoffYearChange = (e) => {
  const year = e.target.value;
  if (/^\d+$/.test(year)) { // Ensure the value is numeric
    window.location = `/playoffs/${year}`;
  } else {
    console.error("Invalid year selected:", year);
  }
};

const PlayoffYearSelector = ({ seasons, year }) => {
  return (
    <select className="p-2 rounded text-xl border bg-inherit text-white" value={year} onChange={handlePlayoffYearChange}>
      {seasons.map((y, i) => (<option key={i} value={String(y)?.replace(/^\d{4}/, '')}>{String(y)?.replace(/^\d{4}/, '')}</option> ))}
    </select>
  );
};

PlayoffYearSelector.propTypes = {
  seasons: PropTypes.arrayOf(PropTypes.number).isRequired,
  year: PropTypes.number.isRequired,
};

export default PlayoffYearSelector;
