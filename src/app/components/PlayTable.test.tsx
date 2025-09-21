import React from 'react';
import { render, screen } from '@testing-library/react';
import PlayTable from './PlayTable';

const plays = [
  {
    eventId: 1,
    timeRemaining: '12:34',
    periodDescriptor: { number: 1 },
    details: { eventOwnerTeamId: 1 },
    typeDescKey: 'goal',
  },
  {
    eventId: 2,
    timeRemaining: '05:00',
    periodDescriptor: { number: 1 },
    details: { eventOwnerTeamId: 2 },
    typeDescKey: 'hit',
  },
];

describe('PlayTable', () => {
  it('renders rows and delegates details and logos', () => {
    const { asFragment } = render(
      <PlayTable
        plays={plays as any}
        activePeriod={0}
        renderPlayByPlayEvent={(play) => <div data-testid={`details-${play.eventId}`}>D</div>}
        renderTeamLogo={(teamId?: number | string) => <div data-testid={`logo-${teamId}`} />}
      />
    );
    expect(screen.getByText('12:34')).toBeInTheDocument();
    expect(screen.getByTestId('details-1')).toBeInTheDocument();
    expect(screen.getByTestId('logo-1')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders empty state when no plays', () => {
    const { asFragment } = render(
      <PlayTable
        plays={[]}
        activePeriod={1}
        renderPlayByPlayEvent={() => null}
        renderTeamLogo={() => null}
      />
    );
    expect(screen.getByText('No matching plays.')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});
