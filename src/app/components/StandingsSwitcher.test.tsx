import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import StandingsSwitcher from './StandingsSwitcher';

const mockReplace = jest.fn();
let mockPathname = '/standings';
let mockQueryString = '';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => mockPathname,
  useSearchParams: () => new URLSearchParams(mockQueryString),
}));

jest.mock('@/app/components/StandingsTable', () => {
  return function MockStandingsTable() {
    return <div data-testid="standings-table" />;
  };
});

const entry = {
  wildcardSequence: 1,
  divisionAbbrev: 'A',
  divisionSequence: 1,
  points: 90,
  teamAbbrev: { default: 'AAA' },
  teamLogo: 'logo.svg',
  teamName: { default: 'AAA Name' },
  gamesPlayed: 70,
  wins: 40,
  losses: 20,
  otLosses: 10,
  pointPctg: 0.64,
  regulationWins: 30,
  regulationPlusOtWins: 35,
  goalFor: 220,
  goalAgainst: 200,
  goalDifferential: 20,
  homeWins: 22,
  homeLosses: 10,
  homeOtLosses: 3,
  roadWins: 18,
  roadLosses: 10,
  roadOtLosses: 7,
  shootoutWins: 4,
  shootoutLosses: 2,
  l10Wins: 7,
  l10Losses: 2,
  l10OtLosses: 1,
  conferenceAbbrev: 'W',
};

describe('StandingsSwitcher date selector', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-03-21T12:00:00Z'));
    mockReplace.mockClear();
    mockPathname = '/standings';
    mockQueryString = '';
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders selected standings date', () => {
    render(<StandingsSwitcher western={[entry]} eastern={[entry]} standingsDate="2025-04-12" />);

    const input = screen.getByLabelText('As of') as HTMLInputElement;
    expect(input.value).toBe('2025-04-12');
  });

  it('updates URL date query when selecting a historical date', () => {
    mockQueryString = 'view=wildcard';

    render(<StandingsSwitcher western={[entry]} eastern={[entry]} standingsDate="now" />);

    const input = screen.getByLabelText('As of');
    fireEvent.change(input, { target: { value: '2025-04-12' } });

    expect(mockReplace).toHaveBeenCalledWith('/standings?view=wildcard&date=2025-04-12', {
      scroll: false,
    });
  });

  it('delays URL update when manually typing a date', () => {
    render(<StandingsSwitcher western={[entry]} eastern={[entry]} standingsDate="now" />);

    const input = screen.getByLabelText('As of');
    fireEvent.keyDown(input, { key: '2' });
    fireEvent.change(input, { target: { value: '2025-04-12' } });

    expect(mockReplace).not.toHaveBeenCalled();

    jest.advanceTimersByTime(599);
    expect(mockReplace).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(mockReplace).toHaveBeenCalledWith('/standings?date=2025-04-12', {
      scroll: false,
    });
  });

  it('clamps future date to today and removes date query', () => {
    mockQueryString = 'date=2025-01-10&foo=bar';

    render(<StandingsSwitcher western={[entry]} eastern={[entry]} standingsDate="2025-01-10" />);

    const input = screen.getByLabelText('As of');
    fireEvent.change(input, { target: { value: '2026-12-01' } });

    expect(mockReplace).toHaveBeenCalledWith('/standings?foo=bar', { scroll: false });
  });

  it('restores last valid date when input becomes invalid/empty', () => {
    render(<StandingsSwitcher western={[entry]} eastern={[entry]} standingsDate="2025-04-12" />);

    const input = screen.getByLabelText('As of') as HTMLInputElement;
    fireEvent.keyDown(input, { key: 'Backspace' });
    fireEvent.change(input, { target: { value: '' } });

    expect(input.value).toBe('2025-04-12');
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('hides standings tables when hideTables is enabled', () => {
    render(
      <StandingsSwitcher
        western={[entry]}
        eastern={[entry]}
        standingsDate="2025-04-12"
        hideTables
      />
    );

    expect(screen.getByLabelText('As of')).toBeInTheDocument();
    expect(screen.queryByText('Western Conference')).not.toBeInTheDocument();
    expect(screen.queryByText('Eastern Conference')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('standings-table')).toHaveLength(0);
  });
});
