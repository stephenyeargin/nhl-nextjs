import React from 'react';
import { render, screen } from '@testing-library/react';
import StatsTable from './StatsTable';

jest.mock(
  'next/link',
  () =>
    ({ children }: any) =>
      children
);
jest.mock('./Headshot', () => {
  const MockHeadshot = () => <div />;
  MockHeadshot.displayName = 'MockHeadshot';

  return MockHeadshot;
});
jest.mock('../utils/teamData', () => ({
  getTeamDataByAbbreviation: () => ({ teamColor: '#123456' }),
}));

describe('StatsTable (altKey + header style)', () => {
  test('renders altKey stat headers and values', () => {
    render(
      <StatsTable
        stats={[{ playerId: 7, name: { default: 'Alt Key' }, faceoffWinningPctg: 55.1234 }]}
        team="NYR"
      />
    );
    expect(screen.getByText('FO%')).toBeTruthy();
    expect(screen.getByText(/55\.123/)).toBeTruthy();
    // header style includes team color -> assert via computed style property (rgb form)
    const header = screen.getAllByText('Name')[0].closest('tr')?.querySelector('th') as HTMLElement;
    expect(header.style.backgroundColor).toBe('rgb(18, 52, 86)');
  });
});
