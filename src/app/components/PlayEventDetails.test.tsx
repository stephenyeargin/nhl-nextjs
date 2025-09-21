import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlayEventDetails from './PlayEventDetails';

jest.mock('./Headshot', () => {
  const Mock = ({ playerId, className }: any) => (
    <div data-testid={`headshot-${playerId}`} className={className} />
  );
  (Mock as any).displayName = 'HeadshotMock';

  return Mock;
});

jest.mock('./TeamLogo', () => {
  const Mock = (props: any) => <div data-testid="team-logo" {...props} />;
  (Mock as any).displayName = 'TeamLogoMock';

  return Mock;
});

const game = { periodDescriptor: { number: 1 } };
const rosterSpots = [
  {
    playerId: 9,
    sweaterNumber: 9,
    headshot: '/9.jpg',
    firstName: { default: 'Filip' },
    lastName: { default: 'Forsberg' },
  },
  {
    playerId: 92,
    sweaterNumber: 92,
    headshot: '/92.jpg',
    firstName: { default: 'Ryan' },
    lastName: { default: 'Johansen' },
  },
];

const lookupTeamDataByTeamId = (teamId: number) =>
  teamId === 1
    ? { teamColor: '#111', abbreviation: 'NSH' }
    : { teamColor: '#222', abbreviation: 'CBJ' };

describe('PlayEventDetails', () => {
  it('renders goal with highlight button and triggers callback', () => {
    const onOpenHighlight = jest.fn();
    const play = {
      typeDescKey: 'goal',
      details: {
        scoringPlayerId: 9,
        assist1PlayerId: 92,
        assist1PlayerTotal: 1,
        awayScore: 1,
        homeScore: 0,
        eventOwnerTeamId: 1,
        highlightClip: '12345',
      },
      timeInPeriod: '10:00',
      periodDescriptor: { number: 1 },
    };
    const { asFragment } = render(
      <PlayEventDetails
        play={play}
        game={game}
        rosterSpots={rosterSpots as any}
        lookupTeamDataByTeamId={lookupTeamDataByTeamId as any}
        onOpenHighlight={onOpenHighlight}
      />
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onOpenHighlight).toHaveBeenCalled();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders penalty summary', () => {
    const play = {
      typeDescKey: 'penalty',
      details: {
        committedByPlayerId: 92,
        duration: 2,
        typeCode: 'minor',
        descKey: 'tripping',
        eventOwnerTeamId: 1,
      },
      periodDescriptor: { number: 1 },
    };
    const { asFragment } = render(
      <PlayEventDetails
        play={play}
        game={game}
        rosterSpots={rosterSpots as any}
        lookupTeamDataByTeamId={lookupTeamDataByTeamId as any}
      />
    );
    expect(screen.getByText(/minutes/)).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders faceoff details', () => {
    const play = {
      typeDescKey: 'faceoff',
      details: {
        winningPlayerId: 92,
        losingPlayerId: 9,
        zoneCode: 'O',
        eventOwnerTeamId: 2,
      },
      periodDescriptor: { number: 1 },
    };
    const { asFragment } = render(
      <PlayEventDetails
        play={play}
        game={game}
        rosterSpots={rosterSpots as any}
        lookupTeamDataByTeamId={lookupTeamDataByTeamId as any}
      />
    );
    expect(screen.getByText(/won a faceoff/)).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders shootout goal without player total parentheses', () => {
    const play = {
      typeDescKey: 'goal',
      details: {
        scoringPlayerId: 9,
        awayScore: 0,
        homeScore: 1,
        eventOwnerTeamId: 1,
      },
      timeInPeriod: 'SO',
      periodDescriptor: { number: 5, periodType: 'SO' },
    };
    const { container, asFragment } = render(
      <PlayEventDetails
        play={play}
        game={game}
        rosterSpots={rosterSpots as any}
        lookupTeamDataByTeamId={lookupTeamDataByTeamId as any}
      />
    );
    // Name should render
    expect(screen.getByText('Filip Forsberg')).toBeInTheDocument();
    // Should not render a goals total like "(1)" after the name for SO
    expect(container).not.toHaveTextContent(/\(\d+\)/);
    expect(asFragment()).toMatchSnapshot();
  });
});
