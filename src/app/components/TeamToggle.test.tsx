import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TeamToggle from './TeamToggle';

// Mock TeamLogo (use same alias path the component uses)
jest.mock('@/app/components/TeamLogo', () => {
  const MockTeamLogo = (props: any) => <div data-testid={`logo-${props.alt}`} />;
  MockTeamLogo.displayName = 'MockTeamLogo';

  return MockTeamLogo;
});

const makeTeam = (abbrev: string, name: string, place: string, color: string) => ({
  abbrev,
  logo: `logo-${abbrev}`,
  commonName: { default: name },
  placeName: { default: place },
  data: { teamColor: color }
});

describe('TeamToggle', () => {
  test('renders both teams and handles clicks', () => {
    const handler = jest.fn();
    render(<TeamToggle homeTeam={makeTeam('BOS','Boston Bruins','Boston','#000000')} awayTeam={makeTeam('NYR','New York Rangers','New York','#123456')} activeStatTeam="homeTeam" handleStatTeamClick={handler} />);
    expect(screen.getByTestId('logo-Boston Bruins')).toBeTruthy();
    fireEvent.click(screen.getByText(/New York/));
    expect(handler).toHaveBeenCalledWith('awayTeam');
  });
});
