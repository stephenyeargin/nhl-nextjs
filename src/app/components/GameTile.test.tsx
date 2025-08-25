import React from 'react';
import { render, screen } from '@testing-library/react';
import GameTile from './GameTile';

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: any) => <a href={href}>{children}</a>;
  MockLink.displayName = 'MockLink';

  return MockLink;
});
jest.mock('@/app/components/TeamLogo', () => {
  const MockTeamLogo = ({ alt }: any) => <div data-testid={`logo-${alt}`} />;
  MockTeamLogo.displayName = 'MockTeamLogo';

  return MockTeamLogo;
});
jest.mock('@/app/utils/formatters', () => ({
  formatLocalizedTime: () => '7:00 PM ET',
  formatLocalizedDate: () => 'Jan 1, 2025',
  formatPeriodLabel: () => '2nd',
}));

const baseTeam = (abbrev: string) => ({
  abbrev,
  score: 0,
  record: '0-0-0',
  placeNameWithPreposition: { default: abbrev },
  commonName: { default: abbrev },
  placeName: { default: abbrev },
  name: { default: abbrev },
});

const makeGame = (overrides: any = {}) => ({
  id: 1,
  awayTeam: baseTeam('AWY'),
  homeTeam: baseTeam('HOM'),
  gameState: 'FUT',
  gameType: 2,
  startTimeUTC: '2025-01-01T00:00:00Z',
  venue: { default: 'Venue' },
  periodDescriptor: { number: 2, periodType: 'REG', maxRegulationPeriods: 3 },
  clock: { timeRemaining: '05:00' },
  ...overrides,
});

describe('GameTile', () => {
  test('future game shows both team records and date/time', () => {
    render(<GameTile game={makeGame()} />);
    const records = screen.getAllByText('0-0-0');
    expect(records.length).toBe(2);
    expect(screen.getByText(/Jan 1, 2025/)).toBeTruthy();
  });

  test('final game shows FINAL/OT when last period OT', () => {
    render(<GameTile game={makeGame({ gameState: 'FINAL', awayTeam: { ...baseTeam('AWY'), score: 3 }, homeTeam: { ...baseTeam('HOM'), score: 4 }, gameOutcome: { lastPeriodType: 'OT' }, periodDescriptor: { periodType: 'OT' } })} />);
    expect(screen.getByText(/FINAL\/OT/)).toBeTruthy();
  });

  test('live game shows period label and clock', () => {
    render(<GameTile game={makeGame({ gameState: 'LIVE' })} />);
    expect(screen.getByText('2nd')).toBeTruthy();
    expect(screen.getByText('05:00')).toBeTruthy();
  });

  test('cancelled game shows Cancelled badge', () => {
    render(<GameTile game={makeGame({ gameScheduleState: 'CNCL' })} />);
    expect(screen.getByText(/Cancelled/)).toBeTruthy();
  });
});
