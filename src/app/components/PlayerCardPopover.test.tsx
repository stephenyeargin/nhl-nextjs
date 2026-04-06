import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlayerCardPopover from './PlayerCardPopover';

const mockCloseCard = jest.fn();
const mockUsePlayerCard = jest.fn();

// Portal: render inline instead of into document.body for easier querying
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode) => node,
}));

jest.mock('../contexts/PlayerCardContext', () => ({
  usePlayerCard: (...args: unknown[]) => mockUsePlayerCard(...args),
}));

jest.mock('./TeamLogo', () => ({ team }: { team: string }) => <span>{team}</span>);
jest.mock('../utils/teamData', () => ({
  getTeamDataByAbbreviation: () => ({ teamColor: '#00205b', secondaryTeamColor: '#ff4c00' }),
}));

jest.mock('next/image', () => ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} />
));

jest.mock('next/link', () => ({ children, href }: { children: React.ReactNode; href: string }) => (
  <a href={href}>{children}</a>
));

const playerData = {
  playerId: 8478402,
  firstName: { default: 'Wayne' },
  lastName: { default: 'Gretzky' },
  position: 'C',
  headshot: 'https://assets.nhle.com/mugs/nhl/8478402.png',
  currentTeamAbbrev: 'EDM',
  fullTeamName: { default: 'Edmonton Oilers' },
  sweaterNumber: 99,
  shootsCatches: 'L',
  heightInInches: 72,
  weightInPounds: 185,
  birthCity: { default: 'Brantford' },
  birthCountry: 'CAN',
  featuredStats: {
    season: 19851986,
    regularSeason: {
      subSeason: {
        gamesPlayed: 80,
        goals: 52,
        assists: 163,
        points: 215,
      },
    },
  },
  last5Games: [
    {
      gameId: 1,
      gameDate: '1986-04-01',
      homeRoadFlag: 'H',
      teamAbbrev: 'EDM',
      opponentAbbrev: 'CGY',
      goals: 1,
      assists: 2,
      points: 3,
    },
    {
      gameId: 2,
      gameDate: '1986-04-03',
      homeRoadFlag: 'A',
      teamAbbrev: 'EDM',
      opponentAbbrev: 'VAN',
      goals: 1,
      assists: 1,
      points: 2,
    },
  ],
  isActive: true,
};

const makeRect = () =>
  ({ top: 100, bottom: 120, left: 50, right: 200, width: 150, height: 20 }) as DOMRect;

const goalieData = {
  ...playerData,
  playerId: 31,
  position: 'G',
  firstName: { default: 'Martin' },
  lastName: { default: 'Brodeur' },
  featuredStats: {
    season: 20062007,
    regularSeason: {
      subSeason: {
        gamesPlayed: 78,
        wins: 48,
        savePctg: 0.922,
        gaa: 2.18,
      },
    },
  },
  last5Games: [
    {
      gameId: 10,
      gameDate: '2007-04-01',
      homeRoadFlag: 'H',
      teamAbbrev: 'NJD',
      opponentAbbrev: 'NYR',
      shotsAgainst: 30,
      goalsAgainst: 2,
      wins: 1,
    },
    {
      gameId: 11,
      gameDate: '2007-04-03',
      homeRoadFlag: 'A',
      teamAbbrev: 'NJD',
      opponentAbbrev: 'PHI',
      shotsAgainst: 28,
      goalsAgainst: 1,
      wins: 1,
    },
  ],
};

describe('PlayerCardPopover', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when no cardState and not loading', () => {
    mockUsePlayerCard.mockReturnValue({
      cardState: null,
      loading: false,
      closeCard: mockCloseCard,
      scheduleClose: jest.fn(),
      cancelClose: jest.fn(),
    });
    const { container } = render(<PlayerCardPopover />);
    expect(container.firstChild).toBeNull();
  });

  it('shows loading state', () => {
    mockUsePlayerCard.mockReturnValue({
      cardState: null,
      loading: true,
      closeCard: mockCloseCard,
      scheduleClose: jest.fn(),
      cancelClose: jest.fn(),
    });
    render(<PlayerCardPopover />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('renders player name, position, and team logo when data present', () => {
    mockUsePlayerCard.mockReturnValue({
      cardState: { data: playerData, rect: makeRect() },
      loading: false,
      closeCard: mockCloseCard,
      scheduleClose: jest.fn(),
      cancelClose: jest.fn(),
    });
    render(<PlayerCardPopover />);
    expect(screen.getByText('Wayne Gretzky')).toBeInTheDocument();
    expect(screen.getByText('#99 • C • Shoots L')).toBeInTheDocument();
    expect(screen.getAllByText('EDM')).toHaveLength(2);
    expect(screen.getByText('Edmonton Oilers')).toBeInTheDocument();
    expect(screen.getByText('1985-86: 80 GP • 52 G • 163 A • 215 P')).toBeInTheDocument();
    expect(screen.getByText('Last 5 Games')).toBeInTheDocument();
    expect(screen.getByText('2 G • 3 A • 5 P')).toBeInTheDocument();
  });

  it('renders a "View full profile" link pointing to the player page', () => {
    mockUsePlayerCard.mockReturnValue({
      cardState: { data: playerData, rect: makeRect() },
      loading: false,
      closeCard: mockCloseCard,
      scheduleClose: jest.fn(),
      cancelClose: jest.fn(),
    });
    render(<PlayerCardPopover />);
    const link = screen.getByRole('link', { name: /view full profile/i });
    expect(link).toHaveAttribute('href', '/player/8478402');
  });

  it('calls closeCard when Escape is pressed', () => {
    mockUsePlayerCard.mockReturnValue({
      cardState: { data: playerData, rect: makeRect() },
      loading: false,
      closeCard: mockCloseCard,
      scheduleClose: jest.fn(),
      cancelClose: jest.fn(),
    });
    render(<PlayerCardPopover />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(mockCloseCard).toHaveBeenCalledTimes(1);
  });

  it('calls closeCard when clicking outside the card', () => {
    mockUsePlayerCard.mockReturnValue({
      cardState: { data: playerData, rect: makeRect() },
      loading: false,
      closeCard: mockCloseCard,
      scheduleClose: jest.fn(),
      cancelClose: jest.fn(),
    });
    render(<PlayerCardPopover />);
    fireEvent.pointerDown(document.body);
    expect(mockCloseCard).toHaveBeenCalledTimes(1);
  });

  it('keeps the popover open while hovered and schedules close on leave', () => {
    const scheduleClose = jest.fn();
    const cancelClose = jest.fn();

    mockUsePlayerCard.mockReturnValue({
      cardState: { data: playerData, rect: makeRect() },
      loading: false,
      closeCard: mockCloseCard,
      scheduleClose,
      cancelClose,
    });
    render(<PlayerCardPopover />);

    const dialog = screen.getByRole('dialog');
    fireEvent.mouseEnter(dialog);
    fireEvent.mouseLeave(dialog);

    expect(cancelClose).toHaveBeenCalled();
    expect(scheduleClose).toHaveBeenCalled();
  });

  it('renders goalie-specific season and last-five summaries', () => {
    mockUsePlayerCard.mockReturnValue({
      cardState: { data: goalieData, rect: makeRect() },
      loading: false,
      closeCard: mockCloseCard,
      scheduleClose: jest.fn(),
      cancelClose: jest.fn(),
    });

    render(<PlayerCardPopover />);

    expect(screen.getByText('2006-07: 78 GP • 48 W • .922 SV% • 2.18 GAA')).toBeInTheDocument();
    expect(screen.getByText('2 GP • 2 W • .948 SV% • 1.50 GAA')).toBeInTheDocument();
  });
});
