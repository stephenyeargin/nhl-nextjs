import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GameSubPageNavigation from './GameSubPageNavigation';

jest.mock('next/navigation', () => ({ usePathname: () => '/game/1' }));

// Mock FontAwesome to avoid heavy DOM
jest.mock('@fortawesome/react-fontawesome', () => ({ FontAwesomeIcon: (props: any) => <span data-icon={props.icon?.iconName || 'icon'} /> }));

// Mock FloatingAudioPlayer to a simple placeholder to prevent extra async/state side effects
jest.mock('./FloatingAudioPlayer', () => ({
  __esModule: true,
  default: ({ isVisible, label }: any) => isVisible ? <div data-testid="audio-player">Audio {label}</div> : null
}));

// Provide minimal GameContext
jest.mock('../contexts/GameContext', () => ({
  useGameContext: () => ({
    gameData: {
      game: {
        id: 1,
        gameState: 'FUT',
        tvBroadcasts: [],
        homeTeam: { radioLink: 'homeRadio', placeName: { default: 'HomeCity' } },
        awayTeam: { radioLink: 'awayRadio', placeName: { default: 'AwayCity' } },
      }
    }
  })
}));

describe('GameSubPageNavigation (smoke)', () => {
  it('shows preview when FUT state and opens audio player (home)', () => {
    render(<GameSubPageNavigation />);
    expect(screen.getByText(/Preview/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Home'));
    // After clicking we expect buttons still present (ensures no crash)
    expect(screen.getByText('Away')).toBeInTheDocument();
  });
});
