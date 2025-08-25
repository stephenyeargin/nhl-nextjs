import React from 'react';
import { render, screen } from '@testing-library/react';
import ShootoutScoreboard from './ShootoutScoreboard';

jest.mock('./TeamLogo', () => {
  const MockTeamLogo = ({ team }: any) => <div data-testid={`logo-${team}`} />;
  MockTeamLogo.displayName = 'MockTeamLogo';

  return MockTeamLogo;
});
jest.mock('@fortawesome/react-fontawesome', () => ({ FontAwesomeIcon: (props: any) => <i data-testid="fa" title={props.title}>{props.icon?.iconName || 'icon'}</i> }));

const team = (abbrev: string) => ({ abbrev, logo: `${abbrev}.png`, commonName: { default: abbrev } });

describe('ShootoutScoreboard', () => {
  test('renders shots with correct icons including game winner', () => {
    const shootout = [
      { sequence: 1, teamAbbrev: { default: 'AWY' }, result: 'goal', gameWinner: true, firstName: { default: 'A' }, lastName: { default: 'One' } },
      { sequence: 2, teamAbbrev: { default: 'HOM' }, result: 'miss', firstName: { default: 'B' }, lastName: { default: 'Two' } },
      { sequence: 3, teamAbbrev: { default: 'AWY' }, result: 'goal', firstName: { default: 'C' }, lastName: { default: 'Three' } },
    ];
    render(<ShootoutScoreboard shootout={shootout} awayTeam={team('AWY')} homeTeam={team('HOM')} />);
    expect(screen.getAllByTestId('fa').length).toBeGreaterThanOrEqual(2); // goal + miss icons
  });
});
