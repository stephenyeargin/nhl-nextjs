import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TopBarSchedule from './TopBarSchedule';

// Mock GameTile to lightweight placeholder
jest.mock('./GameTile', () => {
  // Destructure the actual prop name `hideDate` and rename to `_hideDate` to omit it from DOM spread
  type GameTileMockProps = {
    hideDate?: boolean;
    game?: { id?: number };
  } & React.HTMLAttributes<HTMLDivElement>;
  const GT: React.FC<GameTileMockProps> = ({ hideDate: _hideDate, game, ...props }) => (
    <div data-testid="game-tile" data-game={String(game)} {...props}>
      Game {game?.id}
    </div>
  );
  GT.displayName = 'GameTileMock';

  return GT;
});

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;

const makeApiPayload = () => ({
  focusedDate: '2024-10-01',
  gamesByDate: [
    {
      date: '2024-10-01',
      games: [
        {
          id: 1,
          gameState: 'FUT',
          awayTeam: { abbrev: 'A', score: 0 },
          homeTeam: { abbrev: 'H', score: 0 },
          startTimeUTC: '2024-10-01T23:00:00Z',
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
});

describe('TopBarSchedule (smoke)', () => {
  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({ json: async () => makeApiPayload() } as Response);
  });
  afterEach(() => {
    mockFetch.mockReset();
  });

  it('renders dates and switches focused date', async () => {
    const { asFragment } = render(<TopBarSchedule gameDate="2024-10-01" />);
    await waitFor(() => expect(screen.getByText(/Oct 1/i)).toBeInTheDocument());
    expect(screen.getByTestId('game-tile')).toHaveTextContent('Game 1');
    expect(asFragment()).toMatchSnapshot();
    fireEvent.click(screen.getByTitle(/October 2/i));
    await waitFor(() => expect(screen.getByTestId('game-tile')).toHaveTextContent('Game 2'));
    expect(asFragment()).toMatchSnapshot();
  });
});
