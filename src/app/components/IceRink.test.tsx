import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import IceRink from './IceRink';

// Mock next/image with displayName
// eslint-disable-next-line @next/next/no-img-element
jest.mock('next/image', () => {
  const MockImg = (props: any) => <img {...props} alt={props.alt || 'img'} />; // eslint-disable-line @next/next/no-img-element
  (MockImg as any).displayName = 'NextImageMock';

  return MockImg;
});

jest.mock('./TeamLogo', () => {
  const TL = (props: any) => <div data-testid="team-logo" {...props} />;
  (TL as any).displayName = 'TeamLogoMock';

  return TL;
});

const baseProps = {
  game: { summary: { iceSurface: { awayTeam: { goalies: [], defensemen: [], forwards: [], penaltyBox: [] }, homeTeam: { goalies: [], defensemen: [], forwards: [], penaltyBox: [] } } } },
  plays: [
    { eventId: 1, sortOrder: 2, details: { xCoord: 10, yCoord: 5, eventOwnerTeamId: 1 }, typeDescKey: 'shot', timeRemaining: '10:00', periodDescriptor: {}, timeInPeriod: '10:00' },
    { eventId: 2, sortOrder: 1, details: { xCoord: -20, yCoord: -10, eventOwnerTeamId: 2 }, typeDescKey: 'goal', timeRemaining: '05:00', periodDescriptor: {}, timeInPeriod: '05:00' }
  ],
  homeTeam: { abbrev: 'NSH', logo: '/nsh.png', id: 1, data: { teamColor: '#000', secondaryTeamColor: '#ccc', abbreviation: 'NSH' } },
  awayTeam: { abbrev: 'CBJ', logo: '/cbj.png', id: 2, data: { teamColor: '#111', secondaryTeamColor: '#ddd', abbreviation: 'CBJ' } },
  renderPlayByPlayEvent: () => <div data-testid="play-event">Play</div>,
  renderTeamLogo: () => <div data-testid="hover-logo" />
};

describe('IceRink (smoke)', () => {
  it('renders plays and opens play box on click', () => {
    const { container } = render(<IceRink {...baseProps as any} />);
    const firstMarker = container.querySelector('div[data-index="0"]');
    expect(firstMarker).not.toBeNull();
    if (firstMarker) {
      fireEvent.click(firstMarker);
    }
    expect(screen.getByTestId('play-event')).toBeInTheDocument();
  });
});
