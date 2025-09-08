import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TopBarSchedule from './TopBarSchedule';

// Lightweight mock for GameTile (omit hideDate from spread)
jest.mock('./GameTile', () => {
  const GT = ({ hideDate: _hideDate, ...props }: any) => (
    <div data-testid="game-tile" {...props}>
      Game {props.game?.id}
    </div>
  );
  (GT as any).displayName = 'GameTileMock';

  return GT;
});

describe('TopBarSchedule fallback date behavior', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    (global.fetch as jest.Mock | undefined)?.mockReset?.();
    // Clear pending timers between tests for cleanliness
    jest.setSystemTime(new Date('2024-01-01T00:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('chooses later date on tie when initial date has no games', async () => {
    jest.setSystemTime(new Date('2024-09-29T12:00:00Z'));
    const payload = {
      focusedDate: '2024-10-01',
      gamesByDate: [
        { date: '2024-10-01', games: [] }, // initial empty
        {
          date: '2024-09-30',
          games: [
            {
              id: 30,
              gameState: 'FUT',
              awayTeam: { abbrev: 'A', score: 0 },
              homeTeam: { abbrev: 'H', score: 0 },
              startTimeUTC: '2024-09-30T23:00:00Z',
              gameType: 2,
            },
          ],
        },
        {
          date: '2024-10-02',
          games: [
            {
              id: 2,
              gameState: 'FUT',
              awayTeam: { abbrev: 'B', score: 0 },
              homeTeam: { abbrev: 'H', score: 0 },
              startTimeUTC: '2024-10-02T23:00:00Z',
              gameType: 2,
            },
          ],
        },
      ],
    };
    global.fetch = jest.fn().mockResolvedValue({ json: async () => payload });

    render(<TopBarSchedule gameDate="2024-10-01" />);

    await waitFor(() => expect(screen.getByTestId('game-tile')).toHaveTextContent('Game 2'));
  });

  it('chooses closer earlier date when it is strictly nearer than later date', async () => {
    jest.setSystemTime(new Date('2024-10-03T12:00:00Z'));
    const payload = {
      focusedDate: '2024-10-05',
      gamesByDate: [
        { date: '2024-10-05', games: [] }, // empty target
        {
          date: '2024-10-04',
          games: [
            {
              id: 4,
              gameState: 'FUT',
              awayTeam: { abbrev: 'A', score: 0 },
              homeTeam: { abbrev: 'H', score: 0 },
              startTimeUTC: '2024-10-04T23:00:00Z',
              gameType: 2,
            },
          ],
        }, // 1 day earlier
        {
          date: '2024-10-07',
          games: [
            {
              id: 7,
              gameState: 'FUT',
              awayTeam: { abbrev: 'B', score: 0 },
              homeTeam: { abbrev: 'H', score: 0 },
              startTimeUTC: '2024-10-07T23:00:00Z',
              gameType: 2,
            },
          ],
        }, // 2 days later
      ],
    };
    global.fetch = jest.fn().mockResolvedValue({ json: async () => payload });

    render(<TopBarSchedule gameDate="2024-10-05" />);

    await waitFor(() => expect(screen.getByTestId('game-tile')).toHaveTextContent('Game 4'));
  });

  it('falls back to closest earlier date when current date is later than all schedule dates', async () => {
    // System time AFTER all schedule dates; component should pick the closest earlier one
    jest.setSystemTime(new Date('2024-10-10T12:00:00Z'));
    const payload = {
      focusedDate: '2024-10-10',
      gamesByDate: [
        {
          date: '2024-10-05',
          games: [
            {
              id: 5,
              gameState: 'FUT',
              awayTeam: { abbrev: 'A', score: 0 },
              homeTeam: { abbrev: 'H', score: 0 },
              startTimeUTC: '2024-10-05T23:00:00Z',
              gameType: 2,
            },
          ],
        },
        {
          date: '2024-10-07',
          games: [
            {
              id: 7,
              gameState: 'FUT',
              awayTeam: { abbrev: 'B', score: 0 },
              homeTeam: { abbrev: 'H', score: 0 },
              startTimeUTC: '2024-10-07T23:00:00Z',
              gameType: 2,
            },
          ],
        },
        { date: '2024-10-10', games: [] }, // empty requested / focused
      ],
    };
    global.fetch = jest.fn().mockResolvedValue({ json: async () => payload });

    render(<TopBarSchedule gameDate="2024-10-10" />);

    // Closest earlier should be 2024-10-07 (3 days diff) vs 2024-10-05 (5 days diff)
    await waitFor(() => expect(screen.getByTestId('game-tile')).toHaveTextContent('Game 7'));
  });
});
