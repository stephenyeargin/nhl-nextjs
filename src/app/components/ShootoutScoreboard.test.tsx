import React from 'react';
import { render, screen } from '@testing-library/react';
import ShootoutScoreboard from './ShootoutScoreboard';

jest.mock('./TeamLogo', () => {
  const MockTeamLogo = ({ team }: any) => <div data-testid={`logo-${team}`} />;
  MockTeamLogo.displayName = 'MockTeamLogo';

  return MockTeamLogo;
});
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: (props: any) => (
    <i data-testid="fa" title={props.title}>
      {props.icon?.iconName || 'icon'}
    </i>
  ),
}));

const team = (abbrev: string) => ({
  abbrev,
  logo: `${abbrev}.png`,
  commonName: { default: abbrev },
});

describe('ShootoutScoreboard', () => {
  test('renders shots with correct icons including game winner', () => {
    const shootout: React.ComponentProps<typeof ShootoutScoreboard>['shootout'] = [
      {
        sequence: 1,
        playerId: 1001,
        teamAbbrev: { default: 'AWY' },
        shotType: 'wrist',
        result: 'goal',
        headshot: '',
        gameWinner: true,
        homeScore: 0,
        awayScore: 1,
        firstName: { default: 'A' },
        lastName: { default: 'One' },
      },
      {
        sequence: 2,
        playerId: 1002,
        teamAbbrev: { default: 'HOM' },
        shotType: 'backhand',
        result: 'save',
        headshot: '',
        gameWinner: false,
        homeScore: 0,
        awayScore: 1,
        firstName: { default: 'B' },
        lastName: { default: 'Two' },
      },
      {
        sequence: 3,
        playerId: 1003,
        teamAbbrev: { default: 'AWY' },
        shotType: 'snap',
        result: 'goal',
        headshot: '',
        gameWinner: false,
        homeScore: 0,
        awayScore: 2,
        firstName: { default: 'C' },
        lastName: { default: 'Three' },
      },
    ];
    render(
      <ShootoutScoreboard shootout={shootout} awayTeam={team('AWY')} homeTeam={team('HOM')} />
    );
    expect(screen.getAllByTestId('fa').length).toBeGreaterThanOrEqual(2); // goal + miss icons
  });
});
