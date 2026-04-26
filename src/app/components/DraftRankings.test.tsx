import React from 'react';
import { render, screen } from '@testing-library/react';
import DraftRankings from './DraftRankings';
import type { DraftRankingsData, DraftRankingPlayer } from '@/app/types/draft';

// Mock next/link to render a simple anchor
jest.mock('next/link', () => {
  const MockLink = ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  MockLink.displayName = 'MockNextLink';

  return MockLink;
});

const mockCategories = [
  { id: 1, name: 'North American Skater', consumerKey: 'north-american-skater' },
  { id: 2, name: 'International Skater', consumerKey: 'international-skater' },
  { id: 3, name: 'North American Goalie', consumerKey: 'north-american-goalie' },
  { id: 4, name: 'International Goalie', consumerKey: 'international-goalie' },
];

function makePlayer(overrides: Partial<DraftRankingPlayer> = {}): DraftRankingPlayer {
  return {
    midtermRank: 1,
    firstName: 'John',
    lastName: 'Doe',
    positionCode: 'C',
    shootsCatches: 'L',
    heightInInches: 73,
    weightInPounds: 190,
    lastAmateurClub: 'London Knights',
    lastAmateurLeague: 'OHL',
    birthDate: '2007-01-01',
    birthCity: 'Toronto',
    birthCountry: 'CAN',
    ...overrides,
  };
}

function makeRankingsData(overrides: Partial<DraftRankingsData> = {}): DraftRankingsData {
  return {
    draftYear: 2026,
    categoryId: 1,
    categoryKey: 'north-american-skater',
    draftYears: [2024, 2025, 2026],
    categories: mockCategories,
    rankings: [makePlayer()],
    ...overrides,
  };
}

describe('DraftRankings', () => {
  describe('empty state', () => {
    it('shows a no-rankings message when rankings array is empty', () => {
      render(<DraftRankings rankingsData={makeRankingsData({ rankings: [] })} />);
      expect(screen.getByText(/no rankings available/i)).toBeInTheDocument();
    });
  });

  describe('category switcher', () => {
    it('renders all four category tabs', () => {
      render(<DraftRankings rankingsData={makeRankingsData()} />);
      expect(screen.getByRole('tab', { name: 'North American Skater' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'International Skater' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'North American Goalie' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'International Goalie' })).toBeInTheDocument();
    });

    it('marks the active category with aria-current="page"', () => {
      render(
        <DraftRankings rankingsData={makeRankingsData({ categoryKey: 'international-skater' })} />
      );
      const activeTab = screen.getByRole('tab', { name: 'International Skater' });
      expect(activeTab).toHaveAttribute('aria-current', 'page');
      expect(screen.getByRole('tab', { name: 'North American Skater' })).not.toHaveAttribute(
        'aria-current'
      );
    });

    it('category links include the correct category id in href', () => {
      render(<DraftRankings rankingsData={makeRankingsData()} />);
      const intlTab = screen.getByRole('tab', { name: 'International Skater' });
      expect(intlTab).toHaveAttribute('href', '/draft/2026?category=2');
    });

    it('appends &view=rankings to category links when viewMode is rankings', () => {
      render(<DraftRankings rankingsData={makeRankingsData()} viewMode="rankings" />);
      const intlTab = screen.getByRole('tab', { name: 'International Skater' });
      expect(intlTab).toHaveAttribute('href', '/draft/2026?category=2&view=rankings');
    });

    it('does not append view=rankings when viewMode is picks', () => {
      render(<DraftRankings rankingsData={makeRankingsData()} viewMode="picks" />);
      const intlTab = screen.getByRole('tab', { name: 'International Skater' });
      expect(intlTab).toHaveAttribute('href', '/draft/2026?category=2');
    });
  });

  describe('midterm-only rankings (no finalRank)', () => {
    it('shows "#" as the rank column header', () => {
      const rankings = [makePlayer({ midtermRank: 5 })];
      render(<DraftRankings rankingsData={makeRankingsData({ rankings })} />);
      expect(screen.getByRole('columnheader', { name: '#' })).toBeInTheDocument();
    });

    it('displays the midterm rank number', () => {
      const rankings = [makePlayer({ midtermRank: 7 })];
      render(<DraftRankings rankingsData={makeRankingsData({ rankings })} />);
      expect(screen.getByRole('cell', { name: '7' })).toBeInTheDocument();
    });

    it('displays NR when midtermRank is missing', () => {
      const rankings = [makePlayer({ midtermRank: undefined as unknown as number })];
      render(<DraftRankings rankingsData={makeRankingsData({ rankings })} />);
      expect(screen.getByRole('cell', { name: 'NR' })).toBeInTheDocument();
    });
  });

  describe('final rankings (with finalRank)', () => {
    it('shows "Final (Mid)" as the rank column header', () => {
      const rankings = [makePlayer({ midtermRank: 3, finalRank: 2 })];
      render(<DraftRankings rankingsData={makeRankingsData({ rankings })} />);
      expect(screen.getByRole('columnheader', { name: 'Final (Mid)' })).toBeInTheDocument();
    });

    it('displays "finalRank (midtermRank)" in the rank cell', () => {
      const rankings = [makePlayer({ midtermRank: 3, finalRank: 2 })];
      render(<DraftRankings rankingsData={makeRankingsData({ rankings })} />);
      expect(screen.getByRole('cell', { name: '2 (3)' })).toBeInTheDocument();
    });

    it('shows NR for missing finalRank with midterm in parens', () => {
      // hasFinalRankings triggers when ANY player has a finalRank; the NR player also gets final-mode display
      const rankings = [
        makePlayer({ midtermRank: 1, finalRank: 1 }),
        makePlayer({ firstName: 'Jane', lastName: 'Smith', midtermRank: 10, finalRank: undefined }),
      ];
      render(<DraftRankings rankingsData={makeRankingsData({ rankings })} />);
      expect(screen.getByRole('cell', { name: 'NR (10)' })).toBeInTheDocument();
    });

    it('shows finalRank and NR in parens when midtermRank is missing', () => {
      const rankings = [makePlayer({ midtermRank: undefined as unknown as number, finalRank: 8 })];
      render(<DraftRankings rankingsData={makeRankingsData({ rankings })} />);
      expect(screen.getByRole('cell', { name: '8 (NR)' })).toBeInTheDocument();
    });

    it('also uses finalRanking field as fallback for finalRank', () => {
      const rankings = [makePlayer({ midtermRank: 5, finalRanking: 4 })];
      render(<DraftRankings rankingsData={makeRankingsData({ rankings })} />);
      expect(screen.getByRole('columnheader', { name: 'Final (Mid)' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '4 (5)' })).toBeInTheDocument();
    });
  });

  describe('limited viewing (rank > 500)', () => {
    it('renders * for a rank greater than 500', () => {
      const rankings = [makePlayer({ midtermRank: 925 })];
      render(<DraftRankings rankingsData={makeRankingsData({ rankings })} />);
      expect(screen.getByRole('cell', { name: '*' })).toBeInTheDocument();
    });

    it('shows "* Limited Viewing" footnote when any rank exceeds 500', () => {
      const rankings = [
        makePlayer({ midtermRank: 1 }),
        makePlayer({ firstName: 'Jane', lastName: 'Smith', midtermRank: 750 }),
      ];
      render(<DraftRankings rankingsData={makeRankingsData({ rankings })} />);
      expect(screen.getByText('* Limited Viewing')).toBeInTheDocument();
    });

    it('does not show the footnote when no rank exceeds 500', () => {
      const rankings = [
        makePlayer({ midtermRank: 100 }),
        makePlayer({ firstName: 'Jane', lastName: 'Smith', midtermRank: 200 }),
      ];
      render(<DraftRankings rankingsData={makeRankingsData({ rankings })} />);
      expect(screen.queryByText('* Limited Viewing')).not.toBeInTheDocument();
    });

    it('shows * in final rank cell when finalRank > 500', () => {
      const rankings = [makePlayer({ midtermRank: 3, finalRank: 600 })];
      render(<DraftRankings rankingsData={makeRankingsData({ rankings })} />);
      expect(screen.getByRole('cell', { name: '* (3)' })).toBeInTheDocument();
    });
  });

  describe('player row rendering', () => {
    it('renders flag emoji before player name', () => {
      const rankings = [
        makePlayer({ birthCountry: 'CAN', firstName: 'Connor', lastName: 'McDavid' }),
      ];
      render(<DraftRankings rankingsData={makeRankingsData({ rankings })} />);
      const cell = screen.getByText('Connor McDavid').closest('td');
      expect(cell).toBeInTheDocument();
      // Flag emoji span appears before the name
      const flagSpan = cell!.querySelector('span');
      expect(flagSpan).toBeInTheDocument();
    });

    it('renders all separate column headers', () => {
      render(<DraftRankings rankingsData={makeRankingsData()} />);
      expect(screen.getByRole('columnheader', { name: 'Player' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Height' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Weight' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Pos' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Last Amateur Club' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'League' })).toBeInTheDocument();
    });

    it('formats height from inches to feet and inches', () => {
      const rankings = [makePlayer({ heightInInches: 73 })]; // 6'1"
      render(<DraftRankings rankingsData={makeRankingsData({ rankings })} />);
      expect(screen.getByRole('cell', { name: '6\'1"' })).toBeInTheDocument();
    });

    it('formats position code as full name', () => {
      const rankings = [makePlayer({ positionCode: 'LW' })];
      render(<DraftRankings rankingsData={makeRankingsData({ rankings })} />);
      expect(screen.getByRole('cell', { name: 'Left Wing' })).toBeInTheDocument();
    });

    it('renders last amateur club in its own column', () => {
      const rankings = [
        makePlayer({ lastAmateurClub: 'London Knights', lastAmateurLeague: 'OHL' }),
      ];
      render(<DraftRankings rankingsData={makeRankingsData({ rankings })} />);
      expect(screen.getByRole('cell', { name: 'London Knights' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: 'OHL' })).toBeInTheDocument();
    });
  });

  describe('sorting', () => {
    it('sorts players by midtermRank ascending when no finalRank', () => {
      const rankings = [
        makePlayer({ firstName: 'Third', lastName: 'Player', midtermRank: 3 }),
        makePlayer({ firstName: 'First', lastName: 'Player', midtermRank: 1 }),
        makePlayer({ firstName: 'Second', lastName: 'Player', midtermRank: 2 }),
      ];
      render(<DraftRankings rankingsData={makeRankingsData({ rankings })} />);
      const rows = screen.getAllByRole('row');
      // rows[0] is thead, rows[1..n] are data rows
      expect(rows[1]).toHaveTextContent('First Player');
      expect(rows[2]).toHaveTextContent('Second Player');
      expect(rows[3]).toHaveTextContent('Third Player');
    });

    it('sorts players by finalRank ascending when finalRank is present', () => {
      const rankings = [
        makePlayer({ firstName: 'Second', lastName: 'Player', midtermRank: 1, finalRank: 2 }),
        makePlayer({ firstName: 'First', lastName: 'Player', midtermRank: 2, finalRank: 1 }),
      ];
      render(<DraftRankings rankingsData={makeRankingsData({ rankings })} />);
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('First Player');
      expect(rows[2]).toHaveTextContent('Second Player');
    });

    it('places NR players at the end of the sorted list', () => {
      const rankings = [
        makePlayer({
          firstName: 'NR',
          lastName: 'Player',
          midtermRank: undefined as unknown as number,
        }),
        makePlayer({ firstName: 'Ranked', lastName: 'Player', midtermRank: 5 }),
      ];
      render(<DraftRankings rankingsData={makeRankingsData({ rankings })} />);
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('Ranked Player');
      expect(rows[2]).toHaveTextContent('NR Player');
    });
  });
});
