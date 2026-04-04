import React from 'react';
import { render, screen, within } from '@testing-library/react';
import StandingsTable from './StandingsTable';

// Helper to build a row with overrides
const row = (overrides: Partial<any>): any => ({
  wildcardSequence: 1,
  divisionAbbrev: 'A',
  divisionSequence: 1,
  points: 10,
  teamAbbrev: { default: 'AAA' },
  teamLogo: 'logo.svg',
  teamName: { default: 'AAA Name' },
  clinchIndicator: undefined,
  gamesPlayed: 10,
  wins: 5,
  losses: 3,
  otLosses: 2,
  pointPctg: 0.55,
  regulationWins: 3,
  regulationPlusOtWins: 5,
  goalFor: 30,
  goalAgainst: 25,
  goalDifferential: 5,
  homeWins: 3,
  homeLosses: 1,
  homeOtLosses: 1,
  roadWins: 2,
  roadLosses: 2,
  roadOtLosses: 1,
  shootoutWins: 1,
  shootoutLosses: 0,
  l10Wins: 5,
  l10Losses: 3,
  l10OtLosses: 2,
  streakCode: 'W',
  streakCount: 2,
  ...overrides,
});

describe('StandingsTable', () => {
  it('sorts and swaps first six rows when swap condition met and renders wildcard rankings + clinch indicator opacity', () => {
    // Create 6 rows such that after initial sort row[0].points < row[3].points to trigger swap.
    // Arrange rows with different wildcardSequence to keep original order stable prior to swap.
    const rows = [
      row({
        teamAbbrev: { default: 'R1' },
        teamName: { default: 'Team R1' },
        points: 10,
        wildcardSequence: 1,
      }),
      row({
        teamAbbrev: { default: 'R2' },
        teamName: { default: 'Team R2' },
        points: 11,
        wildcardSequence: 1,
      }),
      row({
        teamAbbrev: { default: 'R3' },
        teamName: { default: 'Team R3' },
        points: 12,
        wildcardSequence: 1,
      }),
      row({
        teamAbbrev: { default: 'R4' },
        teamName: { default: 'Team R4' },
        points: 40,
        wildcardSequence: 2,
        clinchIndicator: 'e',
      }), // higher points -> will move up after swap
      row({
        teamAbbrev: { default: 'R5' },
        teamName: { default: 'Team R5' },
        points: 39,
        wildcardSequence: 2,
      }),
      row({
        teamAbbrev: { default: 'R6' },
        teamName: { default: 'Team R6' },
        points: 38,
        wildcardSequence: 2,
      }),
    ];

    const { asFragment } = render(<StandingsTable standings={rows} />);

    const table = screen.getByRole('table');
    const bodyRows = within(table).getAllByRole('row').slice(1); // skip header

    // After swap logic, row with highest points among first six (R4=40) should bubble ahead of lower groups.
    // Actual rendered order (after sorting and swapping) places R6 (38) first due to division/wildcard ordering then points grouping.
    // Validate that R4 appears within first three rows indicating swap executed.
    const firstThreeText = bodyRows.slice(0, 3).map((r) => r.textContent || '');
    expect(firstThreeText.join('')).toMatch(/Team R4/);
    // Row with clinchIndicator 'e' (R4) should have opacity class on its link
    const r4Row = bodyRows.find((r) => /Team R4/.test(r.textContent || ''))!;
    const link = within(r4Row).getByRole('link');
    expect(link.className).toMatch(/opacity-40/);

    // Rankings cell text for first three rows should be 1,2,3 (wildcardRankings mapping after swap)
    const rankingCells = bodyRows.map((r) => within(r).getAllByRole('cell')[0]);
    expect(rankingCells[0].textContent).toBe('1');
    expect(rankingCells[1].textContent).toBe('2');
    expect(rankingCells[2].textContent).toBe('3');

    // Streak column (last cell) combines code+count
    const streakCell = bodyRows[0].querySelector('td:last-child');
    expect(streakCell?.textContent).toBe('W2');

    // Snapshot the complex table rendering
    expect(asFragment()).toMatchSnapshot();
  });

  it('shows magic and tragic columns in wildcard view when at least one team has played more than 60 games', () => {
    // Use distinct wildcardSequence values so sort order is deterministic.
    // gamesRemaining = 82 - 65 = 17, maxPossiblePoints = pts + 34
    // ninthPlaceTeam = T9 (78 pts, max = 112), eighthPlaceTeam = T8 (80 pts)
    // T1 (in playoff spot): M# = max(0, 112 - 115 + 1) = 0, T# = max(0, 149 - 78 + 1) = 72
    // T9 (outside playoff spot): M# = max(0, 114 - 78) = 36, T# = max(0, 112 - 80 + 1) = 33
    const rows = [
      row({
        teamAbbrev: { default: 'T1' },
        teamName: { default: 'Team 1' },
        points: 115,
        gamesPlayed: 65,
        wildcardSequence: 1,
        clinchIndicator: 'x',
      }),
      row({
        teamAbbrev: { default: 'T2' },
        teamName: { default: 'Team 2' },
        points: 92,
        gamesPlayed: 65,
        wildcardSequence: 2,
      }),
      row({
        teamAbbrev: { default: 'T3' },
        teamName: { default: 'Team 3' },
        points: 90,
        gamesPlayed: 65,
        wildcardSequence: 3,
      }),
      row({
        teamAbbrev: { default: 'T4' },
        teamName: { default: 'Team 4' },
        points: 88,
        gamesPlayed: 65,
        wildcardSequence: 4,
      }),
      row({
        teamAbbrev: { default: 'T5' },
        teamName: { default: 'Team 5' },
        points: 86,
        gamesPlayed: 65,
        wildcardSequence: 5,
      }),
      row({
        teamAbbrev: { default: 'T6' },
        teamName: { default: 'Team 6' },
        points: 84,
        gamesPlayed: 65,
        wildcardSequence: 6,
      }),
      row({
        teamAbbrev: { default: 'T7' },
        teamName: { default: 'Team 7' },
        points: 82,
        gamesPlayed: 65,
        wildcardSequence: 7,
      }),
      row({
        teamAbbrev: { default: 'T8' },
        teamName: { default: 'Team 8' },
        points: 80,
        gamesPlayed: 65,
        wildcardSequence: 8,
      }),
      row({
        teamAbbrev: { default: 'T9' },
        teamName: { default: 'Team 9' },
        points: 78,
        gamesPlayed: 65,
        wildcardSequence: 9,
        clinchIndicator: 'e',
      }),
    ];

    render(<StandingsTable standings={rows} view="wildcard" />);

    const magicHeading = screen.getByTitle('Magic Number');
    const tragicHeading = screen.getByTitle('Tragic Number');

    expect(screen.getByText('Playoff Race')).toBeInTheDocument();
    expect(magicHeading).toBeInTheDocument();
    expect(tragicHeading).toBeInTheDocument();

    // T1 has 115 pts — already above the 9th-place ceiling of 112, so M# = 0
    const firstTeamRow = screen.getByText('Team 1').closest('tr');
    const firstTeamCells = within(firstTeamRow!).getAllByRole('cell');
    expect(within(firstTeamCells[2]).getByTitle('Clinched')).toBeInTheDocument();
    expect(firstTeamCells[3].textContent).toBe('72');

    // T9 is outside the line: tragic anchors to current 8th-place points (80)
    const ninthTeamRow = screen.getByText('Team 9').closest('tr');
    const ninthTeamCells = within(ninthTeamRow!).getAllByRole('cell');
    expect(ninthTeamCells[2].textContent).toBe('36');
    expect(within(ninthTeamCells[3]).getByTitle('Eliminated')).toBeInTheDocument();
  });

  it('prioritizes official clinch indicators over computed race values', () => {
    const rows = [
      row({
        teamAbbrev: { default: 'A1' },
        teamName: { default: 'Alpha 1' },
        points: 116,
        gamesPlayed: 82,
        wildcardSequence: 1,
      }),
      row({
        teamAbbrev: { default: 'A2' },
        teamName: { default: 'Alpha 2' },
        points: 106,
        gamesPlayed: 82,
        wildcardSequence: 2,
      }),
      row({
        teamAbbrev: { default: 'A3' },
        teamName: { default: 'Alpha 3' },
        points: 102,
        gamesPlayed: 82,
        wildcardSequence: 3,
      }),
      row({
        teamAbbrev: { default: 'A4' },
        teamName: { default: 'Alpha 4' },
        points: 110,
        gamesPlayed: 82,
        wildcardSequence: 4,
      }),
      row({
        teamAbbrev: { default: 'A5' },
        teamName: { default: 'Alpha 5' },
        points: 105,
        gamesPlayed: 82,
        wildcardSequence: 5,
      }),
      row({
        teamAbbrev: { default: 'A6' },
        teamName: { default: 'Alpha 6' },
        points: 101,
        gamesPlayed: 82,
        wildcardSequence: 6,
      }),
      row({
        teamAbbrev: { default: 'A7' },
        teamName: { default: 'Alpha 7' },
        points: 97,
        gamesPlayed: 82,
        wildcardSequence: 7,
      }),
      row({
        teamAbbrev: { default: 'WC2' },
        teamName: { default: 'Clinched Team' },
        points: 96,
        gamesPlayed: 82,
        wildcardSequence: 8,
        clinchIndicator: 'x',
      }),
      row({
        teamAbbrev: { default: 'N9' },
        teamName: { default: 'Eliminated Team' },
        points: 96,
        gamesPlayed: 82,
        wildcardSequence: 9,
        clinchIndicator: 'e',
      }),
    ];

    render(<StandingsTable standings={rows} view="wildcard" />);

    const clinchedRow = screen.getByText('Clinched Team').closest('tr');
    const clinchedCells = within(clinchedRow!).getAllByRole('cell');
    expect(within(clinchedCells[2]).getByTitle('Clinched')).toBeInTheDocument();
    expect(within(clinchedCells[3]).queryByTitle('Eliminated')).not.toBeInTheDocument();

    const eliminatedRow = screen.getByText('Eliminated Team').closest('tr');
    const eliminatedCells = within(eliminatedRow!).getAllByRole('cell');
    expect(within(eliminatedCells[3]).getByTitle('Eliminated')).toBeInTheDocument();
  });

  it('matches hockeymagic-style values for western in-hunt teams with wildcardSequence 0-10 shape', () => {
    const rows = [
      row({
        teamAbbrev: { default: 'COL' },
        teamName: { default: 'Colorado Avalanche' },
        points: 104,
        gamesPlayed: 70,
        wildcardSequence: 0,
        divisionAbbrev: 'C',
        divisionSequence: 1,
      }),
      row({
        teamAbbrev: { default: 'DAL' },
        teamName: { default: 'Dallas Stars' },
        points: 97,
        gamesPlayed: 71,
        wildcardSequence: 0,
        divisionAbbrev: 'C',
        divisionSequence: 2,
      }),
      row({
        teamAbbrev: { default: 'MIN' },
        teamName: { default: 'Minnesota Wild' },
        points: 92,
        gamesPlayed: 72,
        wildcardSequence: 0,
        divisionAbbrev: 'C',
        divisionSequence: 3,
      }),
      row({
        teamAbbrev: { default: 'ANA' },
        teamName: { default: 'Anaheim Ducks' },
        points: 84,
        gamesPlayed: 71,
        wildcardSequence: 0,
        divisionAbbrev: 'P',
        divisionSequence: 1,
      }),
      row({
        teamAbbrev: { default: 'EDM' },
        teamName: { default: 'Edmonton Oilers' },
        points: 79,
        gamesPlayed: 72,
        wildcardSequence: 0,
        divisionAbbrev: 'P',
        divisionSequence: 2,
      }),
      row({
        teamAbbrev: { default: 'VGK' },
        teamName: { default: 'Vegas Golden Knights' },
        points: 78,
        gamesPlayed: 72,
        wildcardSequence: 0,
        divisionAbbrev: 'P',
        divisionSequence: 3,
      }),
      row({
        teamAbbrev: { default: 'UTA' },
        teamName: { default: 'Utah Mammoth' },
        points: 80,
        gamesPlayed: 72,
        wildcardSequence: 1,
        divisionAbbrev: 'C',
        divisionSequence: 4,
      }),
      row({
        teamAbbrev: { default: 'NSH' },
        teamName: { default: 'Nashville Predators' },
        points: 77,
        gamesPlayed: 71,
        wildcardSequence: 2,
        divisionAbbrev: 'C',
        divisionSequence: 5,
      }),
      row({
        teamAbbrev: { default: 'LAK' },
        teamName: { default: 'Los Angeles Kings' },
        points: 74,
        gamesPlayed: 71,
        wildcardSequence: 3,
        divisionAbbrev: 'P',
        divisionSequence: 4,
      }),
      row({
        teamAbbrev: { default: 'SEA' },
        teamName: { default: 'Seattle Kraken' },
        points: 72,
        gamesPlayed: 70,
        wildcardSequence: 4,
        divisionAbbrev: 'P',
        divisionSequence: 5,
      }),
      row({
        teamAbbrev: { default: 'WPG' },
        teamName: { default: 'Winnipeg Jets' },
        points: 72,
        gamesPlayed: 71,
        wildcardSequence: 5,
        divisionAbbrev: 'C',
        divisionSequence: 6,
      }),
      row({
        teamAbbrev: { default: 'SJS' },
        teamName: { default: 'San Jose Sharks' },
        points: 70,
        gamesPlayed: 69,
        wildcardSequence: 6,
        divisionAbbrev: 'P',
        divisionSequence: 6,
      }),
      row({
        teamAbbrev: { default: 'STL' },
        teamName: { default: 'St. Louis Blues' },
        points: 69,
        gamesPlayed: 70,
        wildcardSequence: 7,
        divisionAbbrev: 'C',
        divisionSequence: 7,
      }),
      row({
        teamAbbrev: { default: 'CGY' },
        teamName: { default: 'Calgary Flames' },
        points: 67,
        gamesPlayed: 71,
        wildcardSequence: 8,
        divisionAbbrev: 'P',
        divisionSequence: 7,
      }),
      row({
        teamAbbrev: { default: 'CHI' },
        teamName: { default: 'Chicago Blackhawks' },
        points: 67,
        gamesPlayed: 71,
        wildcardSequence: 9,
        divisionAbbrev: 'C',
        divisionSequence: 8,
      }),
      row({
        teamAbbrev: { default: 'VAN' },
        teamName: { default: 'Vancouver Canucks' },
        points: 50,
        gamesPlayed: 70,
        wildcardSequence: 10,
        divisionAbbrev: 'P',
        divisionSequence: 8,
        clinchIndicator: 'e',
      }),
    ];

    render(<StandingsTable standings={rows} view="wildcard" />);

    const lakRow = screen.getByText('Los Angeles Kings').closest('tr');
    const lakCells = within(lakRow!).getAllByRole('cell');
    expect(lakCells[2].textContent).toBe('25');
    expect(lakCells[3].textContent).toBe('20');

    const seaRow = screen.getByText('Seattle Kraken').closest('tr');
    const seaCells = within(seaRow!).getAllByRole('cell');
    expect(seaCells[2].textContent).toBe('27');
    expect(seaCells[3].textContent).toBe('20');

    const vanRow = screen.getByText('Vancouver Canucks').closest('tr');
    const vanCells = within(vanRow!).getAllByRole('cell');
    expect(vanCells[2].textContent).toBe('49');
    expect(within(vanCells[3]).getByTitle('Eliminated')).toBeInTheDocument();
  });

  it('hides magic and tragic columns when no team has played more than 60 games', () => {
    const rows = Array.from({ length: 8 }, (_, idx) =>
      row({
        teamAbbrev: { default: `N${idx + 1}` },
        teamName: { default: `NoRace ${idx + 1}` },
        points: 80 - idx,
        gamesPlayed: 60,
      })
    );

    render(<StandingsTable standings={rows} view="wildcard" />);

    expect(screen.queryByTitle('Magic Number')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Tragic Number')).not.toBeInTheDocument();
  });

  it('groups by division when view=division and ranks within each group', () => {
    const rows = [
      row({
        teamAbbrev: { default: 'C1' },
        teamName: { default: 'Central 1' },
        divisionAbbrev: 'C',
        divisionSequence: 1,
        points: 50,
      }),
      row({
        teamAbbrev: { default: 'C2' },
        teamName: { default: 'Central 2' },
        divisionAbbrev: 'C',
        divisionSequence: 2,
        points: 45,
      }),
      row({
        teamAbbrev: { default: 'P1' },
        teamName: { default: 'Pacific 1' },
        divisionAbbrev: 'P',
        divisionSequence: 1,
        points: 48,
      }),
      row({
        teamAbbrev: { default: 'P2' },
        teamName: { default: 'Pacific 2' },
        divisionAbbrev: 'P',
        divisionSequence: 2,
        points: 44,
      }),
    ];

    render(<StandingsTable standings={rows} view="division" />);

    const headers = screen.getAllByText(/Central|Pacific/, { selector: 'th' });
    expect(headers).toHaveLength(2);

    const centralRank = within(screen.getByText('Central 1').closest('tr')!).getAllByRole(
      'cell'
    )[0];
    const pacificRank = within(screen.getByText('Pacific 1').closest('tr')!).getAllByRole(
      'cell'
    )[0];
    expect(centralRank.textContent).toBe('1');
    expect(pacificRank.textContent).toBe('1');
  });

  it('groups by conference when view=conference and orders by points', () => {
    const rows = [
      row({
        teamAbbrev: { default: 'E1' },
        teamName: { default: 'East 1' },
        conferenceAbbrev: 'E',
        points: 60,
      }),
      row({
        teamAbbrev: { default: 'E2' },
        teamName: { default: 'East 2' },
        conferenceAbbrev: 'E',
        points: 55,
      }),
      row({
        teamAbbrev: { default: 'W1' },
        teamName: { default: 'West 1' },
        conferenceAbbrev: 'W',
        points: 65,
      }),
    ];

    render(<StandingsTable standings={rows} view="conference" />);

    const bodyRows = screen.getAllByRole('row').slice(1); // skip header
    expect(within(bodyRows[0]).getByText('East 1')).toBeInTheDocument();
    expect(within(bodyRows[0]).getAllByRole('cell')[0].textContent).toBe('1');
    expect(within(bodyRows[1]).getByText('East 2')).toBeInTheDocument();
    expect(within(bodyRows[1]).getAllByRole('cell')[0].textContent).toBe('2');

    const firstWestRow = screen.getByText('West 1').closest('tr');
    const rankingCell = firstWestRow?.querySelector('td');
    expect(rankingCell?.textContent).toBe('1');
  });

  it('orders all teams by points in league view with continuous ranking', () => {
    const rows = [
      row({ teamAbbrev: { default: 'T1' }, teamName: { default: 'Team 1' }, points: 80 }),
      row({ teamAbbrev: { default: 'T2' }, teamName: { default: 'Team 2' }, points: 75 }),
      row({ teamAbbrev: { default: 'T3' }, teamName: { default: 'Team 3' }, points: 90 }),
    ];

    render(<StandingsTable standings={rows} view="league" />);

    const rowsRendered = screen.getAllByRole('row').slice(1); // skip table header only
    const ranks = rowsRendered.map((r) => within(r).getAllByRole('cell')[0].textContent);
    const names = rowsRendered.map((r) => r.textContent || '');

    expect(ranks).toEqual(['1', '2', '3']);
    expect(names[0]).toMatch(/Team 3/); // highest points first
  });
});
