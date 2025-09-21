import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlayFilters from './PlayFilters';

jest.mock('./PeriodSelector', () => ({
  __esModule: true,
  default: ({ activePeriod, handlePeriodChange }: any) => (
    <button data-testid="period-selector" onClick={() => handlePeriodChange(2)}>
      Period: {activePeriod}
    </button>
  ),
}));

const awayTeam = { id: 2, placeName: { default: 'Columbus' } };
const homeTeam = { id: 1, placeName: { default: 'Nashville' } };

describe('PlayFilters', () => {
  it('invokes handlers on change and displays selected values', () => {
    const onPeriod = jest.fn();
    const onEvent = jest.fn();
    const onTeam = jest.fn();
    const { asFragment } = render(
      <PlayFilters
        periodData={{}}
        activePeriod={0}
        onPeriodChange={onPeriod}
        includeAll
        eventFilter={'all'}
        onEventFilterChange={onEvent}
        teamFilter={'all'}
        onTeamFilterChange={onTeam}
        awayTeam={awayTeam}
        homeTeam={homeTeam}
      />
    );
    expect(asFragment()).toMatchSnapshot();

    // Period selector
    fireEvent.click(screen.getByTestId('period-selector'));
    expect(onPeriod).toHaveBeenCalledWith(2);

    // Event filter
    fireEvent.change(screen.getByDisplayValue('All Events'), { target: { value: 'goal' } });
    expect(onEvent).toHaveBeenCalledWith('goal');

    // Team filter
    fireEvent.change(screen.getByDisplayValue('Both Teams'), {
      target: { value: String(homeTeam.id) },
    });
    expect(onTeam).toHaveBeenCalledWith(String(homeTeam.id));
  });
});
