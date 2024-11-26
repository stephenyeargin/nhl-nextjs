import React from 'react';
import { PropTypes } from 'prop-types';
import { formatPeriodLabel } from '../utils/formatters';

const PeriodSelector = ({ periodData, activePeriod, handlePeriodChange }) => {
  return (
    <>
      {Array.from({ length: periodData.number }, (_, index) => index + 1).map((period, i) => (
        <button
          key={period}
          className={`p-2 w-20 border text-xs ${i === 0 ? 'rounded-l-md' : '' } ${i + 1 === periodData.number ? 'rounded-r-md' : '' } ${activePeriod !== period ? '' : 'text-black dark:text-white bg-slate-200 dark:bg-slate-800'}`}
          onClick={() => handlePeriodChange(period)}
        >
          {formatPeriodLabel({...periodData, number: period })}
        </button>
      ))}
    </>
  );
};

PeriodSelector.propTypes = {
  periodData: PropTypes.object.isRequired,
  activePeriod: PropTypes.number.isRequired,
  handlePeriodChange: PropTypes.func.isRequired
};

export default PeriodSelector;