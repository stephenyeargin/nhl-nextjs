import React from 'react';
import { render, screen } from '@testing-library/react';
import Scoreboard from './Scoreboard';

const formatPeriodLabelMock = jest.fn(
  ({ periodType, number, maxRegulationPeriods }: any) =>
    `${periodType}-${number}-${maxRegulationPeriods}`
);

jest.mock('./TeamLogo', () => {
  const MockTeamLogo = ({ team }: any) => <div data-testid={`logo-${team}`} />;
  MockTeamLogo.displayName = 'MockTeamLogo';

  return MockTeamLogo;
});
jest.mock('../utils/formatters', () => ({
  formatPeriodLabel: (period: any) => formatPeriodLabelMock(period),
}));

const makeGame = (overrides: any = {}) => ({
  periodDescriptor: { number: 5, periodType: 'OT' },
  regPeriods: 3,
  awayTeam: { abbrev: 'AWY' },
  homeTeam: { abbrev: 'HOM' },
  ...overrides,
});

const makeLinescore = (periods: any[], totals = { away: 2, home: 3 }) => ({
  byPeriod: periods,
  totals,
});

describe('Scoreboard', () => {
  beforeEach(() => {
    formatPeriodLabelMock.mockClear();
  });

  test('renders periods skipping empty overtime periods', () => {
    const linescore = makeLinescore([
      { periodDescriptor: { number: 1 }, away: 1, home: 0 },
      { periodDescriptor: { number: 2 }, away: 0, home: 1 },
      { periodDescriptor: { number: 3 }, away: 1, home: 1 },
      { periodDescriptor: { number: 4 }, away: 0, home: 0 }, // empty OT (skipped)
      { periodDescriptor: { number: 5 }, away: 0, home: 0 }, // empty 2OT (skipped)
    ]);
    const { asFragment } = render(<Scoreboard game={makeGame()} linescore={linescore} />);
    // Column headers only include 1,2,3 and T
    const headers = screen.getAllByRole('columnheader').map((h) => (h as HTMLElement).textContent);
    expect(headers).toEqual(['', 'REG-1-3', 'REG-2-3', 'REG-3-3', 'T']);
    // Ensure skipped OT headers 4 and 5 are absent
    expect(headers.includes('OT-4-3')).toBe(false);
    expect(headers.includes('OT-5-3')).toBe(false);
    expect(asFragment()).toMatchSnapshot();
  });

  test('renders overtime period when it has scoring', () => {
    const linescore = makeLinescore(
      [
        { periodDescriptor: { number: 1 }, away: 1, home: 0 },
        { periodDescriptor: { number: 2 }, away: 0, home: 1 },
        { periodDescriptor: { number: 3 }, away: 1, home: 1 },
        { periodDescriptor: { number: 4 }, away: 1, home: 0 }, // OT with scoring should display
      ],
      { away: 3, home: 2 }
    );
    const { asFragment } = render(
      <Scoreboard
        game={makeGame({ periodDescriptor: { number: 4, periodType: 'OT' } })}
        linescore={linescore}
      />
    );
    const headers = screen.getAllByRole('columnheader').map((h) => (h as HTMLElement).textContent);
    expect(headers).toEqual(['', 'REG-1-3', 'REG-2-3', 'REG-3-3', 'OT-4-3', 'T']);
    expect(asFragment()).toMatchSnapshot();
  });

  test('uses period descriptor data for multiple overtime headings', () => {
    const linescore = makeLinescore(
      [
        {
          periodDescriptor: { number: 1, periodType: 'REG', maxRegulationPeriods: 3 },
          away: 2,
          home: 3,
        },
        {
          periodDescriptor: { number: 2, periodType: 'REG', maxRegulationPeriods: 3 },
          away: 2,
          home: 0,
        },
        {
          periodDescriptor: { number: 3, periodType: 'REG', maxRegulationPeriods: 3 },
          away: 0,
          home: 1,
        },
        {
          periodDescriptor: { number: 4, periodType: 'OT', maxRegulationPeriods: 3 },
          away: 0,
          home: 0,
        },
        {
          periodDescriptor: { number: 5, periodType: 'OT', maxRegulationPeriods: 3 },
          away: 1,
          home: 0,
        },
      ],
      { away: 5, home: 4 }
    );

    render(<Scoreboard game={makeGame()} linescore={linescore} />);

    const headers = screen.getAllByRole('columnheader').map((h) => (h as HTMLElement).textContent);
    expect(headers).toEqual(['', 'REG-1-3', 'REG-2-3', 'REG-3-3', 'OT-5-3', 'T']);
  });
});
