import React from 'react';
import { render, screen } from '@testing-library/react';
import StatsTable from './StatsTable';

jest.mock('next/link', () => ({ children }: any) => children);
jest.mock('./Headshot', () => {
  const MockHeadshot = () => <div data-testid="headshot" />;
  MockHeadshot.displayName = 'MockHeadshot';
  
return MockHeadshot;
});

jest.mock('../utils/teamData', () => ({
  getTeamDataByAbbreviation: () => ({ teamColor: '#000000' }),
}));

describe('StatsTable', () => {
  test('renders null for empty stats', () => {
    const { container } = render(<StatsTable stats={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders headers and rows based on stats', () => {
    render(<StatsTable stats={[{ playerId: 1, name: { default: 'Player One' }, goals: 5, assists: 3, points: 8 }]} team="BOS" />);
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByText('Player One')).toBeTruthy();
  });
});
