import React from 'react';
import { render, screen } from '@testing-library/react';
import TeamStatsSummary, { TeamStandingLite } from './TeamStatsSummary';

const makeStanding = (overrides: Partial<TeamStandingLite> = {}): TeamStandingLite => ({
  gamesPlayed: 82,
  wins: 30,
  losses: 44,
  otLosses: 8,
  points: 68,
  pointPctg: 0.415,
  regulationWins: 24,
  regulationPlusOtWins: 28,
  goalFor: 214,
  goalAgainst: 274,
  goalDifferential: -60,
  homeWins: 20,
  homeLosses: 18,
  homeOtLosses: 3,
  roadWins: 10,
  roadLosses: 26,
  roadOtLosses: 5,
  shootoutWins: 2,
  shootoutLosses: 0,
  l10Wins: 3,
  l10Losses: 7,
  l10OtLosses: 0,
  streakCode: 'L',
  streakCount: 2,
  ...overrides,
});

describe('TeamStatsSummary', () => {
  test('renders all stat labels', () => {
    render(<TeamStatsSummary standing={makeStanding()} />);
    const labels = [
      'Games Played',
      'Overall Record',
      'Points',
      'Points %',
      'Regulation Wins',
      'R+OT Wins',
      'Goals For',
      'Goals Against',
      'Goal Differential',
      'Home Record',
      'Road Record',
      'Shootout Record',
      'Last 10 Record',
      'Streak',
    ];
    labels.forEach((l) => {
      expect(screen.getByText(l)).toBeInTheDocument();
    });
  });

  test('formats point percentage to three decimals (leading dot style)', () => {
    render(<TeamStatsSummary standing={makeStanding({ pointPctg: 0.51234 })} />);
    expect(screen.getByText('.512')).toBeInTheDocument();
  });

  test('adds plus sign to positive goal differential', () => {
    render(<TeamStatsSummary standing={makeStanding({ goalDifferential: 5 })} />);
    expect(screen.getByText('+5')).toBeInTheDocument();
  });

  test('handles missing values with dash', () => {
    render(<TeamStatsSummary standing={makeStanding({ pointPctg: undefined })} />);
    // Expect dash for points %
    const ptsPctCell = screen.getAllByText('Points %')[0].previousSibling as HTMLElement;
    expect(ptsPctCell.textContent).toBe('-');
  });

  test('shows streak code and count', () => {
    render(<TeamStatsSummary standing={makeStanding({ streakCode: 'W', streakCount: 3 })} />);
    expect(screen.getByText('W3')).toBeInTheDocument();
  });
});
