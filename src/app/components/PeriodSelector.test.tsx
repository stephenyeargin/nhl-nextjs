import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PeriodSelector from './PeriodSelector';

jest.mock('../utils/formatters', () => ({
  formatPeriodLabel: (p: any, long: boolean) => (long ? `Period ${p.number}` : `${p.number}`),
}));

describe('PeriodSelector', () => {
  test('renders options including All when includeAll', () => {
    const handle = jest.fn();
    render(
      <PeriodSelector
        periodData={{ number: 3, maxRegulationPeriods: 3 }}
        activePeriod={0}
        handlePeriodChange={handle}
        includeAll
      />
    );
    expect(screen.getByText('All Periods')).toBeTruthy();
    expect(screen.getByText('Period 1')).toBeTruthy();
  });

  test('calls handlePeriodChange on selection', () => {
    const handle = jest.fn();
    render(
      <PeriodSelector periodData={{ number: 2 }} activePeriod={1} handlePeriodChange={handle} />
    );
    // The displayed label is 'Period 1' (long form) per mocked formatter
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '2' } });
    expect(handle).toHaveBeenCalledWith(2);
  });
});
