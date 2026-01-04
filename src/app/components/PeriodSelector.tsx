import React from 'react';
import { formatPeriodLabel } from '../utils/formatters';

interface PeriodData {
  number: number; // total number of periods
  periodType?: string;
  [key: string]: any; // retain extra fields passed through to formatter
}

interface PeriodSelectorProps {
  periodData: PeriodData;
  activePeriod: number;
  handlePeriodChange: (_period: number) => void;
  includeAll?: boolean;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  periodData,
  activePeriod,
  handlePeriodChange,
  includeAll = false,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
      className="p-2 min-w-[100px] md:min-w-[150px] border rounded-sm text-black dark:text-white bg-inherit"
      value={activePeriod}
      onChange={handleChange}
    >
      {periodOptions}
    </select>
  );
};

export default PeriodSelector;
