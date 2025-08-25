import React from 'react';
import { render, screen } from '@testing-library/react';
import Scoreboard from './Scoreboard';

jest.mock('./TeamLogo', () => {
  const MockTeamLogo = ({ team }: any) => <div data-testid={`logo-${team}`} />;
  MockTeamLogo.displayName = 'MockTeamLogo';

  return MockTeamLogo;
});
jest.mock('../utils/formatters', () => ({
  formatPeriodLabel: ({ number }: any) => `${number}`,
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
  test('renders periods skipping empty overtime periods', () => {
    const linescore = makeLinescore([
      { periodDescriptor: { number: 1 }, away: 1, home: 0 },
      { periodDescriptor: { number: 2 }, away: 0, home: 1 },
      { periodDescriptor: { number: 3 }, away: 1, home: 1 },
      { periodDescriptor: { number: 4 }, away: 0, home: 0 }, // empty OT (skipped)
      { periodDescriptor: { number: 5 }, away: 0, home: 0 }, // empty 2OT (skipped)
    ]);
    render(<Scoreboard game={makeGame()} linescore={linescore} />);
    // Column headers only include 1,2,3 and T
    const headers = screen.getAllByRole('columnheader').map(h => (h as HTMLElement).textContent);
    expect(headers).toEqual(['', '1', '2', '3', 'T']);
    // Ensure skipped OT headers 4 and 5 are absent
    expect(headers.includes('4')).toBe(false);
    expect(headers.includes('5')).toBe(false);
  });
});
