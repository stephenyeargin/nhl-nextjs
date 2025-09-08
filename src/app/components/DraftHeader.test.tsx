import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// Mock next/image to avoid base URL issues in tests
jest.mock('next/image', () => {
  const MockImage = (props: any) => <span data-testid="mock-image" {...props} />;
  (MockImage as any).displayName = 'MockNextImage';

  return MockImage;
});
import DraftHeader from './DraftHeader';
import type { DraftData } from '@/app/types/draft';

// Minimal mock draft data
const mockDraftData: DraftData = {
  draftYear: 2025,
  draftYears: [2023, 2024, 2025],
  selectableRounds: [1],
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
  ],
};

describe('DraftHeader', () => {
  beforeEach(() => {
    // Ensure a valid base URL for components relying on window.location
    Object.defineProperty(window, 'location', {
      value: { href: 'http://localhost/' },
      writable: true,
    });
  });

  it('renders heading and year select', () => {
    render(<DraftHeader draftData={mockDraftData} />);
    expect(screen.getByRole('heading', { name: /2025 NHL Entry Draft/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Draft year')).toHaveDisplayValue('2025');
  });

  it('filters picks via team filter select and reset works', () => {
    render(<DraftHeader draftData={mockDraftData} />);
    const filterSelect = screen.getByLabelText('Filter by team');
    fireEvent.change(filterSelect, { target: { value: 'MTL' } });
    // Nashville link should be gone from table body
    const table = screen.getByRole('table');
    expect(table.querySelectorAll('a[href="/team/NSH"]').length).toBe(0);
    // Montreal remains
    expect(screen.getAllByText('Montreal Canadiens').length).toBeGreaterThan(0);
    // Reset
    fireEvent.click(screen.getByRole('button', { name: /reset team filter/i }));
    expect(table.querySelectorAll('a[href="/team/NSH"]').length).toBeGreaterThan(0);
  });
});
