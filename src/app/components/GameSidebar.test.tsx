import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GameSidebar from './GameSidebar';

// Lightweight child component mocks to isolate conditional rendering logic
jest.mock('./Scoreboard', () => ({
  __esModule: true,
  default: () => <div data-testid="scoreboard">Scoreboard</div>,
}));
jest.mock('./TeamLogo', () => ({
  __esModule: true,
  default: (p: any) => <span data-testid={`logo-${p.team || p.alt}`}>{p.team || p.alt}</span>,
}));
jest.mock('./StatComparisonRow', () => ({
  __esModule: true,
  default: ({ stat }: any) => <div data-testid={`stat-${stat}`}>{stat}</div>,
}));
jest.mock('./FloatingVideoPlayer', () => ({
  __esModule: true,
  default: ({ isVisible, label }: any) =>
    isVisible ? <div data-testid="video-player">Video {label}</div> : null,
}));

// Mock formatter helpers that rely on date/time formatting for determinism
jest.mock('../utils/formatters', () => ({
  ...jest.requireActual('../utils/formatters'),
  formatSeriesStatus: () => 'Series Tied 1-1',
  formatLocalizedTime: () => '7:00 PM',
  formatPeriodLabel: () => 'P1',
  formatSeason: () => '2024-25',
}));

// Provide deterministic team data colors
jest.mock('../utils/teamData', () => ({
  getTeamDataByAbbreviation: () => ({ teamColor: '#123456', secondaryTeamColor: '#abcdef' }),
}));

// Construct minimal but complete gameData structure hitting most conditional blocks
const buildGameData = () => ({
  homeTeam: { abbrev: 'HOM', logo: 'home.png', data: {} },
  awayTeam: { abbrev: 'AWY', logo: 'away.png', data: {} },
  game: {
    id: 99,
    gameState: 'FINAL',
    homeTeam: { abbrev: 'HOM' },
    awayTeam: { abbrev: 'AWY' },
    startTimeUTC: '2024-10-01T23:00:00Z',
    periodDescriptor: { number: 1 },
  },
  rightRail: {
    gameVideo: { threeMinRecap: '12345', condensedGame: '98765' },
    linescore: { dummy: true },
    shotsByPeriod: [{ away: 5, home: 7, periodDescriptor: { number: 1 } }],
    teamSeasonStats: {
      contextLabel: 'REG',
      contextSeason: '20242025',
      awayTeam: {
        ppPctg: 10,
        ppPctgRank: 20,
        pkPctg: 80,
        pkPctgRank: 5,
        faceoffWinningPctg: 52,
        faceoffWinningPctgRank: 11,
        goalsForPerGamePlayed: 3.1,
        goalsForPerGamePlayedRank: 7,
        goalsAgainstPerGamePlayed: 2.7,
        goalsAgainstPerGamePlayedRank: 9,
      },
      homeTeam: {
        ppPctg: 15,
        ppPctgRank: 12,
        pkPctg: 82,
        pkPctgRank: 3,
        faceoffWinningPctg: 51,
        faceoffWinningPctgRank: 14,
        goalsForPerGamePlayed: 2.9,
        goalsForPerGamePlayedRank: 12,
        goalsAgainstPerGamePlayed: 2.5,
        goalsAgainstPerGamePlayedRank: 6,
      },
    },
    last10Record: {
      awayTeam: {
        record: '6-3-1',
        streakType: 'W',
        streak: 2,
        pastGameResults: [
          { opponentAbbrev: 'ABC', gameResult: 'W' },
          { opponentAbbrev: 'DEF', gameResult: 'L' },
        ],
      },
      homeTeam: {
        record: '5-4-1',
        streakType: 'L',
        streak: 1,
        pastGameResults: [
          { opponentAbbrev: 'XYZ', gameResult: 'L' },
          { opponentAbbrev: 'QRS', gameResult: 'W' },
        ],
      },
    },
    seasonSeries: [
      {
        id: 1001,
        gameType: 2,
        gameState: 'FINAL',
        gameScheduleState: 'OK',
        awayTeam: { abbrev: 'AWY', logo: 'away.png', score: 2 },
        homeTeam: { abbrev: 'HOM', logo: 'home.png', score: 3 },
        periodDescriptor: { number: 3 },
        startTimeUTC: '2024-10-01T23:00:00Z',
        clock: { inIntermission: false, timeRemaining: '10:00' },
      },
    ],
    gameInfo: {
      referees: [{ default: 'Ref A' }, { default: 'Ref B' }],
      linesmen: [{ default: 'Lines A' }, { default: 'Lines B' }],
      awayTeam: { headCoach: { default: 'Coach Away' }, scratches: [] },
      homeTeam: { headCoach: { default: 'Coach Home' }, scratches: [] },
    },
    gameReports: { GAME_SUMMARY: 'https://example.com/report' },
  },
  story: {
    summary: {
      teamGameStats: [
        { category: 'sog', awayValue: 30, homeValue: 28 },
        { category: 'faceoffWinningPctg', awayValue: 45, homeValue: 55 },
        { category: 'powerPlayPctg', awayValue: 20, homeValue: 25 },
        { category: 'powerPlay', awayValue: 1, homeValue: 2 },
        { category: 'pim', awayValue: 6, homeValue: 8 },
        { category: 'hits', awayValue: 10, homeValue: 12 },
        { category: 'blockedShots', awayValue: 5, homeValue: 7 },
        { category: 'giveaways', awayValue: 3, homeValue: 1 },
        { category: 'takeaways', awayValue: 4, homeValue: 6 },
      ],
    },
  },
});

jest.mock('../contexts/GameContext', () => ({
  useGameContext: () => ({ gameData: buildGameData() }),
}));

describe('GameSidebar (smoke)', () => {
  it('renders key sections and opens video player', async () => {
    const { asFragment } = render(<GameSidebar />);

    // Headings indicating most conditional blocks rendered
    expect(screen.getByText(/Game Stats/i)).toBeInTheDocument();
    expect(screen.getByText(/Season Stats/i)).toBeInTheDocument();
    expect(screen.getByText(/Last 10 Games/i)).toBeInTheDocument();
    expect(screen.getByText(/Game Info/i)).toBeInTheDocument();
    expect(screen.getByText(/Game Reports/i)).toBeInTheDocument();

    // Snapshot initial render
    expect(asFragment()).toMatchSnapshot();

    // Click recap button to trigger FloatingVideoPlayer visibility
    fireEvent.click(screen.getByText(/Recap/i));
    await waitFor(() => expect(screen.getByTestId('video-player')).toBeInTheDocument());

    // Snapshot after opening video
    expect(asFragment()).toMatchSnapshot();
  });
});
