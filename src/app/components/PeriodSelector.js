import React from 'react';
import { PropTypes } from 'prop-types';
import { formatPeriodLabel } from '../utils/formatters';

const PeriodSelector = ({ periodData, activePeriod, handlePeriodChange, includeAll }) => {
  const handleChange = (event) => {
    handlePeriodChange(Number(event.target.value));
  };

  const periodOptions = [];

  if (includeAll) {
    periodOptions.push(
      <option key={0} value={0}>
        All Periods
      </option>
    );
  }

  for (let i = 1; i <= periodData.number; i++) {
    periodOptions.push(
      <option key={i} value={i}>
        {formatPeriodLabel({ ...periodData, number: i }, true)}
      </option>
    );
  }

  return (
    <select
      className="p-2 min-w-[100px] md:min-w-[150px] border rounded text-black dark:text-white bg-inherit"
      value={activePeriod}
      onChange={handleChange}
    >
      {periodOptions}
    </select>
  );
};

PeriodSelector.propTypes = {
  periodData: PropTypes.object.isRequired,
  activePeriod: PropTypes.number.isRequired,
  handlePeriodChange: PropTypes.func.isRequired,
  includeAll: PropTypes.bool,
};

export default PeriodSelector;
