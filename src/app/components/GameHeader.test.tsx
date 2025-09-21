import React from 'react';
import { render, screen } from '@testing-library/react';
import GameHeader from './GameHeader';
import { GameContext } from '../contexts/GameContext';

jest.mock('./TeamLogo', () => {
  const Logo = ({ team, alt, className }: any) => (
    <span
      role="img"
      aria-label={alt || team}
      data-team={team}
      data-mock="team-logo"
      className={className}
    />
  );
  (Logo as any).displayName = 'TeamLogoMock';

  return Logo;
});

const teamBase = (abbrev: string, score: number) => ({
  abbrev,
  score,
  logo: 'logo.svg',
  sog: 10,
  record: '1-0-0',
  placeName: { default: `${abbrev} City` },
  commonName: { default: `${abbrev} City ${abbrev}` },
});

const baseGame = (overrides: any = {}) => ({
  gameState: 'OFF',
  gameScheduleState: 'OK',
  homeTeam: teamBase('HOM', 3),
  awayTeam: teamBase('AWY', 2),
  venue: { default: 'Arena' },
  venueLocation: { default: 'Somewhere' },
  periodDescriptor: { number: 3, periodType: 'REG' },
  situation: {
    awayTeam: { strength: 5, situationDescriptions: [] },
    homeTeam: { strength: 5, situationDescriptions: [] },
    timeRemaining: '00:00',
  },
  clock: { timeRemaining: '00:00', inIntermission: false, running: false },
  startTimeUTC: '2024-03-10T12:00:00Z',
  summary: { scoring: [] },
  ...overrides,
});

const ctx = (gameOverrides: any = {}) => {
  const game = baseGame(gameOverrides);

  return {
    gameData: {
      game,
      homeTeam: game.homeTeam,
      awayTeam: game.awayTeam,
    },
    gameState: game.gameState,
    pageError: null,
  } as any;
};

describe('GameHeader', () => {
  it('renders team names (baseline OFF state)', () => {
    const { asFragment } = render(
      <GameContext.Provider value={ctx()}>
        <GameHeader />
      </GameContext.Provider>
    );
    expect(screen.getAllByText(/AWY/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/HOM/)[0]).toBeInTheDocument();
    expect(screen.getByText('Final')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('shows preseason badge when gameType = 1', () => {
    render(
      <GameContext.Provider value={ctx({ gameType: 1, gameState: 'FUT' })}>
        <GameHeader />
      </GameContext.Provider>
    );
    expect(screen.getByText(/Preseason/i)).toBeInTheDocument();
  });

  it('shows playoffs badge when gameType = 3', () => {
    render(
      <GameContext.Provider value={ctx({ gameType: 3, gameState: 'FUT' })}>
        <GameHeader />
      </GameContext.Provider>
    );
    expect(screen.getByText(/Stanley Cup Playoffs/i)).toBeInTheDocument();
  });

  it('shows Pregame state badge for PRE gameState', () => {
    render(
      <GameContext.Provider value={ctx({ gameState: 'PRE' })}>
        <GameHeader />
      </GameContext.Provider>
    );
    expect(screen.getByText(/Pregame/i)).toBeInTheDocument();
  });

  it('shows TBD when future game schedule is TBD', () => {
    render(
      <GameContext.Provider
        value={ctx({
          gameState: 'FUT',
          gameScheduleState: 'TBD',
          startTimeUTC: '2024-03-10T12:00:00Z',
        })}
      >
        <GameHeader />
      </GameContext.Provider>
    );
    expect(screen.getAllByText(/TBD/i)[0]).toBeInTheDocument();
  });

  it('shows situation strength when not 5-on-5', () => {
    render(
      <GameContext.Provider
        value={ctx({
          gameState: 'LIVE',
          periodDescriptor: { number: 1, periodType: 'REG' },
          situation: {
            awayTeam: { strength: 3, situationDescriptions: ['PP'] },
            homeTeam: { strength: 5, situationDescriptions: [] },
            timeRemaining: '01:30',
          },
          clock: { timeRemaining: '10:00', inIntermission: false, running: false },
        })}
      >
        <GameHeader />
      </GameContext.Provider>
    );
    expect(screen.getByText(/3-on-5/)).toBeInTheDocument();
  });

  it('shows goal siren when recent goal scored', () => {
    // Elapsed 5 seconds into period -> goal at 00:05 counts as recent
    render(
      <GameContext.Provider
        value={ctx({
          gameState: 'LIVE',
          periodDescriptor: { number: 1, periodType: 'REG' },
          clock: { timeRemaining: '19:55', inIntermission: false, running: false },
          summary: {
            scoring: [
              {
                periodDescriptor: { number: 1 },
                goals: [{ teamAbbrev: { default: 'AWY' }, timeInPeriod: '00:05' }],
              },
            ],
          },
        })}
      >
        <GameHeader />
      </GameContext.Provider>
    );
    expect(screen.getAllByAltText('Goal')[0]).toBeInTheDocument();
  });

  it('shows cancelled badge for CNCL schedule state', () => {
    render(
      <GameContext.Provider value={ctx({ gameScheduleState: 'CNCL' })}>
        <GameHeader />
      </GameContext.Provider>
    );
    expect(screen.getByText(/Cancelled/i)).toBeInTheDocument();
  });

  it('shows postponed badge for PPD schedule state', () => {
    render(
      <GameContext.Provider value={ctx({ gameScheduleState: 'PPD' })}>
        <GameHeader />
      </GameContext.Provider>
    );
    expect(screen.getByText(/Postponed/i)).toBeInTheDocument();
  });
});
