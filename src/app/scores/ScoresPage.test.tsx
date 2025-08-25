import React from 'react';
import { render, screen } from '@testing-library/react';
import ScoresPage from './page';

jest.mock('@/app/components/GameTile', () => {
  const MockGameTile = (props: any) => <div data-testid="game-tile">Game {props.game.id}</div>;
  MockGameTile.displayName = 'MockGameTile';

  return MockGameTile;
});
jest.mock('@/app/components/NewsPageSkeleton', () => {
  const MockSkeleton = () => <div data-testid="skeleton">Loading...</div>;
  MockSkeleton.displayName = 'MockSkeleton';

  return MockSkeleton;
});
jest.mock('@/app/utils/formatters', () => ({
  formatLocalizedDate: (d: string) => d,
}));
jest.mock('@/app/hooks/useScoresData', () => ({
  useScoresData: () => ({
    scores: {
      gameWeek: [{ date: '2025-01-01', dayAbbrev: 'WED', numberOfGames: 1 }],
      games: [{ id: 1 }],
      prevDate: '2024-12-31',
      currentDate: '2025-01-01',
      nextDate: '2025-01-02'
    },
    today: '2025-01-01',
    setToday: jest.fn(),
    handleDateChange: jest.fn()
  })
}));

describe('ScoresPage', () => {
  // No timers or fetch needed now; hook is mocked

  test('loads scores and displays one game', async () => {
    render(<ScoresPage />);
    await screen.findByText('Scores');
    expect(screen.getAllByTestId('game-tile').length).toBe(1);
    // navigation buttons rendered
    expect(screen.getByText(/«/)).toBeTruthy();
  });
});
