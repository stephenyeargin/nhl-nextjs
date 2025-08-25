import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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

describe('ScoresPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        gameWeek: [{ date: '2025-01-01', dayAbbrev: 'WED', numberOfGames: 1 }],
        games: [{ id: 1 }],
        prevDate: '2024-12-31',
        currentDate: '2025-01-01',
        nextDate: '2025-01-02'
      })
    });
  });

  test('loads scores after initial skeleton', async () => {
    render(<ScoresPage />);
    expect(screen.getByTestId('skeleton')).toBeTruthy();
    await waitFor(() => expect(screen.getByText('Scores')).toBeTruthy());
    expect(screen.getAllByTestId('game-tile').length).toBe(1);
    fireEvent.click(screen.getByText(/«/));
    expect((global.fetch as any).mock.calls.length).toBeGreaterThan(0);
  });
});
