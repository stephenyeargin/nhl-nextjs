import React from 'react';
import { render, screen } from '@testing-library/react';
import TeamSchedule from './TeamSchedule';

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: any) => <a href={href}>{children}</a>;
  MockLink.displayName = 'MockLink';

  return MockLink;
});
jest.mock('@/app/components/TeamLogo', () => {
  const MockTeamLogo = ({ team }: any) => <div data-testid={`logo-${team}`} />;
  MockTeamLogo.displayName = 'MockTeamLogo';

  return MockTeamLogo;
});
jest.mock('@/app/utils/formatters', () => ({
  formatLocalizedDate: () => 'Jan 1',
  formatLocalizedTime: () => '7:00 PM',
  formatBroadcasts: (b: any) => (b && b.length ? 'NET (NAT)' : 'No Broadcasts'),
}));

const gameBase = {
  id: 1,
  startTimeUTC: '2025-01-01T00:00:00Z',
  gameType: 2,
  gameState: 'FINAL',
  awayTeam: { abbrev: 'AWY', score: 2, placeName: { default: 'Away' } },
  homeTeam: { abbrev: 'HOM', score: 3, placeName: { default: 'Home' } },
};

describe('TeamSchedule', () => {
  test('renders final game with W/L logic and broadcasts', () => {
    const team = { abbreviation: 'HOM' };
    render(
      <TeamSchedule
        team={team}
        fullSeasonSchedule={{
          games: [
            {
              ...gameBase,
              tvBroadcasts: [{ network: 'NET', market: 'NAT' }],
              gameOutcome: { lastPeriodType: 'OT' },
            },
          ],
        }}
      />
    );
    expect(screen.getByText(/OT/)).toBeTruthy();
    expect(screen.getByText('NET (NAT)')).toBeTruthy();
  });

  test('renders live game badge and cancelled', () => {
    const team = { abbreviation: 'AWY' };
    render(
      <TeamSchedule
        team={team}
        fullSeasonSchedule={{
          games: [
            { ...gameBase, id: 2, gameState: 'LIVE' },
            { ...gameBase, id: 3, gameState: 'FUT', gameScheduleState: 'CNCL' },
            { ...gameBase, id: 4, gameState: 'FUT', gameScheduleState: 'PPD' },
          ],
        }}
      />
    );
    expect(screen.getByText(/Live/i)).toBeTruthy();
    expect(screen.getByText(/Cancelled/)).toBeTruthy();
    expect(screen.getByText(/Postponed/)).toBeTruthy();
  });
});
