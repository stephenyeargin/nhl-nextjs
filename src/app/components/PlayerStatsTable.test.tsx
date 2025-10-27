import React from 'react';
import { render, screen, within } from '@testing-library/react';
import type { PlayerSeasonTotals } from '@/app/components/PlayerStatsTable';
import PlayerStatsTable from '@/app/components/PlayerStatsTable';

const headers = [
  { key: 'gamesPlayed', label: 'GP', title: 'Games Played' },
  { key: 'goals', label: 'G', title: 'Goals' },
  { key: 'plusMinus', label: '+/-', title: 'Plus/Minus' },
] as const;

const mkRow = (overrides: Partial<PlayerSeasonTotals>): PlayerSeasonTotals => ({
  season: '20192020',
  leagueAbbrev: 'NHL',
  gameTypeId: 2,
  teamName: { default: 'NSH' },
  ...overrides,
});

describe('PlayerStatsTable', () => {
  it('shows only columns present across dataset and keeps alignment with --', () => {
    const stats: PlayerSeasonTotals[] = [
      mkRow({ gamesPlayed: 82, goals: 10, plusMinus: 5 }),
      mkRow({ gamesPlayed: 70 }), // missing goals and plusMinus
    ];

    render(
      <PlayerStatsTable
        stats={stats}
        statHeaders={headers}
        showLeague={false}
        headerColorClass=""
      />
    );

    // Header cells
    expect(screen.getByText('Season')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    // All three headers are visible because at least one row has each
    expect(screen.getByText('GP')).toBeInTheDocument();
    expect(screen.getByText('G')).toBeInTheDocument();
    expect(screen.getByText('+/-')).toBeInTheDocument();

    const rows = screen.getAllByRole('row');
    // First data row should contain 82, 10, +5
    const r1 = rows[1];
    expect(within(r1).getByText('82')).toBeInTheDocument();
    expect(within(r1).getByText('10')).toBeInTheDocument();
    expect(within(r1).getByText('+5')).toBeInTheDocument();

    // Second data row should render placeholders for missing stats
    const r2 = rows[2];
    expect(within(r2).getByText('70')).toBeInTheDocument();
    // goals placeholder
    expect(within(r2).getAllByText('--').length).toBeGreaterThan(0);
  });

  it('matches snapshot (basic NHL table)', () => {
    const stats: PlayerSeasonTotals[] = [
      mkRow({ gamesPlayed: 82, goals: 10, plusMinus: 5 }),
      mkRow({ gamesPlayed: 70 }),
    ];

    const { container } = render(
      <PlayerStatsTable
        stats={stats}
        statHeaders={headers}
        showLeague={false}
        headerColorClass=""
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
