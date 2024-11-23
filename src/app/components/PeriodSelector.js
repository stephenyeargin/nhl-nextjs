import React from 'react';
const { PERIOD_DESCRIPTORS } = require('../utils/constants');
import { PropTypes } from 'prop-types';

const PeriodSelector = ({ activePeriod, periodsPlayed, handlePeriodChange }) => {
  return (
    <>
      {Array.from({ length: periodsPlayed }, (_, index) => index + 1).map((period, i) => (
        <button
          key={period}
          className={`p-2 w-20 border text-xs ${i === 0 ? 'rounded-l-md' : '' } ${i + 1 === periodsPlayed ? 'rounded-r-md' : '' } ${activePeriod !== period ? '' : 'text-black dark:text-white bg-slate-200 dark:bg-slate-800'}`}
          onClick={() => handlePeriodChange(period)}
        >
          {PERIOD_DESCRIPTORS[period]}
        </button>
      ))}
    </>
  );
};

PeriodSelector.propTypes = {
  activePeriod: PropTypes.number.isRequired,
  periodsPlayed: PropTypes.number.isRequired,
  handlePeriodChange: PropTypes.func.isRequired,
};

export default PeriodSelector;