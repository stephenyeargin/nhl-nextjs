import React from 'react';
import { render, screen } from '@testing-library/react';
import GameHeader from './GameHeader';
import { GameContext } from '../contexts/GameContext';

jest.mock('./TeamLogo', () => {
  // eslint-disable-next-line @next/next/no-img-element, react/display-name
  const Logo = ({ team, alt, className }: any) => <img alt={alt || team} data-team={team} className={className} />;
  (Logo as any).displayName = 'TeamLogoMock';

  return Logo;
});

const teamBase = (abbrev: string, score: number) => ({
  abbrev,
  score,
  logo: 'logo.svg',
  sog: 10,
  record: '1-0-0',
  placeName: { default: abbrev + ' City' },
  commonName: { default: abbrev + ' City ' + abbrev },
});

const ctxValue: any = {
  gameData: {
    game: {
      gameState: 'OFF',
      gameScheduleState: 'OK',
      homeTeam: teamBase('HOM', 3),
      awayTeam: teamBase('AWY', 2),
      venue: { default: 'Arena' },
      venueLocation: { default: 'Somewhere' },
      periodDescriptor: { number: 3, periodType: 'REG' },
      situation: { awayTeam: { strength: 5, situationDescriptions: [] }, homeTeam: { strength: 5, situationDescriptions: [] }, timeRemaining: '00:00' },
      clock: { timeRemaining: '00:00', inIntermission: false, running: false },
      startTimeUTC: '2024-03-10T12:00:00Z'
    },
    homeTeam: teamBase('HOM', 3),
    awayTeam: teamBase('AWY', 2),
  },
  gameState: 'OFF',
  pageError: null,
};

describe('GameHeader', () => {
  it('renders team names', () => {
    render(
      <GameContext.Provider value={ctxValue}>
        <GameHeader />
      </GameContext.Provider>
    );
  expect(screen.getAllByText(/AWY/)[0]).toBeInTheDocument();
  expect(screen.getAllByText(/HOM/)[0]).toBeInTheDocument();
  });
});
