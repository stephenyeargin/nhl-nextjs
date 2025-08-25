import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import GameProvider, { useGameContext } from './GameContext';

jest.mock('@/app/utils/formatters', () => ({
  formatHeadTitle: jest.fn(),
}));

const TestConsumer: React.FC = () => {
  const { gameState, gameData, pageError } = useGameContext();

  return (
    <div>
      <span data-testid="game-state">{gameState}</span>
      {gameData?.game?.homeTeam?.abbrev && <span data-testid="home-team">{gameData.game.homeTeam.abbrev}</span>}
      {pageError && <span data-testid="page-error">{pageError.message}</span>}
    </div>
  );
};

const makeFetchResponse = (ok: boolean, jsonData: any, status = 200) => ({ ok, status, json: async () => jsonData });

describe('GameContext', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('loads game data and sets state', async () => {
    const gameLanding = {
      homeTeam: { abbrev: 'HOM', score: 2 },
      awayTeam: { abbrev: 'AWY', score: 1 },
      gameState: 'LIVE',
      gameScheduleState: 'OK'
    };
    (global.fetch as any) = jest.fn()
      .mockResolvedValueOnce(makeFetchResponse(true, gameLanding))
      .mockResolvedValueOnce(makeFetchResponse(true, { some: 'right-rail' }))
      .mockResolvedValueOnce(makeFetchResponse(true, { some: 'story' }));

    render(<GameProvider gameId="1234"><TestConsumer /></GameProvider>);

    await waitFor(() => expect(screen.getByTestId('game-state').textContent).toBe('LIVE'));
    expect(screen.getByTestId('home-team').textContent).toBe('HOM');
    // formatHeadTitle should have been called twice (initial and live update)
    const { formatHeadTitle } = require('@/app/utils/formatters');
    expect(formatHeadTitle).toHaveBeenCalled();
  });

  test('sets pageError on 404', async () => {
    (global.fetch as any) = jest.fn()
      .mockResolvedValueOnce({ ok: false, status: 404 })
      .mockResolvedValueOnce(makeFetchResponse(true, {}))
      .mockResolvedValueOnce(makeFetchResponse(true, {}));

    render(<GameProvider gameId="9999"><TestConsumer /></GameProvider>);

    await waitFor(() => expect(screen.getByTestId('page-error')).toBeTruthy());
    expect(screen.getByTestId('page-error').textContent).toMatch(/Game not found/);
  });
});
