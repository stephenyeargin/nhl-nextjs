import React from 'react';
import { render, screen } from '@testing-library/react';
import GamePreview from './GamePreview';

// Minimal game object hitting the early fallback path (leaders missing)
const baseGame = {
  gameScheduleState: 'OK',
  homeTeam: { abbrev: 'NSH', logo: '/home.png', commonName: { default: 'Predators' }, id: 1 },
  awayTeam: { abbrev: 'CBJ', logo: '/away.png', commonName: { default: 'Blue Jackets' }, id: 2 },
  matchup: {
    skaterComparison: {
      leaders: [{ category: 'points' /* awayLeader intentionally undefined */ }],
    },
  },
};

describe('GamePreview (smoke)', () => {
  it('renders unavailable fallback when leaders missing', () => {
    render(<GamePreview game={baseGame as any} />);
    expect(screen.getByText(/Game preview unavailable/i)).toBeInTheDocument();
  });
});
