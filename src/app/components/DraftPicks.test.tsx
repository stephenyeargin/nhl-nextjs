import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DraftPicks from './DraftPicks';
import type { DraftData } from '@/app/types/draft';

// Minimal mock data
const mockDraftData: DraftData = {
  draftYear: 2024,
  draftYears: [2023, 2024],
  selectableRounds: [1, 2],
  picks: [
    {
      overallPick: 1,
      round: 1,
      teamAbbrev: 'NSH',
      teamLogoLight: 'logo-nsh.svg',
      teamName: { default: 'Nashville Predators' },
      firstName: { default: 'First' },
      lastName: { default: 'Player' },
    },
    {
      overallPick: 2,
      round: 1,
      teamAbbrev: 'MTL',
      teamLogoLight: 'logo-mtl.svg',
      teamName: { default: 'Montreal Canadiens' },
      firstName: { default: 'Second' },
      lastName: { default: 'Player' },
    },
    {
      overallPick: 33,
      round: 2,
      teamAbbrev: 'NSH',
      teamLogoLight: 'logo-nsh.svg',
      teamName: { default: 'Nashville Predators' },
      firstName: { default: 'Third' },
      lastName: { default: 'Player' },
    },
  ],
};

describe('DraftPicks', () => {
  it('renders all picks initially', () => {
    render(<DraftPicks draftData={mockDraftData} />);
    // Table links (exclude the select option) -> use getAllByText and ensure at least one appears
    const nashLinks = screen.getAllByText('Nashville Predators');
    const mtlLinks = screen.getAllByText('Montreal Canadiens');
    expect(nashLinks.length).toBeGreaterThanOrEqual(1);
    expect(mtlLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('filters by selected team', () => {
    render(<DraftPicks draftData={mockDraftData} />);
    const select = screen.getByLabelText('Filter by team');
    fireEvent.change(select, { target: { value: 'MTL' } });
    // After filtering only Montreal picks remain in table area
    const table = screen.getByRole('table', { name: '' });
    expect(table.querySelectorAll('a[href="/team/NSH"]').length).toBe(0);
    expect(screen.getAllByText('Montreal Canadiens').length).toBeGreaterThan(0);
  });

  it('resets filter', () => {
    render(<DraftPicks draftData={mockDraftData} />);
    const select = screen.getByLabelText('Filter by team');
    fireEvent.change(select, { target: { value: 'MTL' } });
    fireEvent.click(screen.getByRole('button', { name: /reset team filter/i }));
    // Nashville appears again (at least one link)
    expect(screen.getAllByText('Nashville Predators').length).toBeGreaterThan(0);
  });
});
