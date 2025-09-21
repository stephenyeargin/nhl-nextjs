import React from 'react';
import { render, screen, within } from '@testing-library/react';
import LastGamesTable, { PlayerGameSummary } from '@/app/components/LastGamesTable';

const headers = [
  { key: 'goals', label: 'G', title: 'Goals' },
  { key: 'plusMinus', label: '+/-', title: 'Plus/Minus' },
] as const;

const mkGame = (overrides: Partial<PlayerGameSummary>): PlayerGameSummary => ({
  gameId: '2024010101',
  gameDate: '2024-01-01',
  homeRoadFlag: 'A',
  teamAbbrev: 'NSH',
  opponentAbbrev: 'COL',
  ...overrides,
});

describe('LastGamesTable', () => {
  it('renders dynamic headers and placeholder cells', () => {
    const games: PlayerGameSummary[] = [
      mkGame({ goals: 2, plusMinus: 1 }),
      mkGame({ goals: undefined as any }),
    ];

    render(<LastGamesTable games={games} statHeaders={headers} />);

    // Headers
    expect(screen.getByText('G')).toBeInTheDocument();
    expect(screen.getByText('+/-')).toBeInTheDocument();

    const rows = screen.getAllByRole('row');
    const r1 = rows[1];
    expect(within(r1).getByText('2')).toBeInTheDocument();
    expect(within(r1).getByText('+1')).toBeInTheDocument();

    const r2 = rows[2];
    // Should render '--' where value is missing
    expect(within(r2).getAllByText('--').length).toBeGreaterThan(0);
  });

  it('matches snapshot (two games)', () => {
    const games: PlayerGameSummary[] = [
      mkGame({ goals: 1, plusMinus: -1 }),
      mkGame({ goals: 0, plusMinus: 2 }),
    ];

    const { container } = render(<LastGamesTable games={games} statHeaders={headers} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
