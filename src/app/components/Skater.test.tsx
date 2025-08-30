import React from 'react';
import { render, screen } from '@testing-library/react';
import { Skater } from './Skater';

jest.mock('./Headshot', () => {
  // eslint-disable-next-line react/display-name
  const HS = ({ alt }: any) => <div data-testid="headshot">{alt}</div>;
  (HS as any).displayName = 'HeadshotMock';

  return HS;
});

describe('Skater', () => {
  it('renders player name', () => {
    render(
      <Skater
        player={{
          playerId: 1,
          name: { default: 'Player One' },
          sweaterNumber: 9,
          positionCode: 'C',
        }}
        team="ANA"
      />
    );
    expect(screen.getAllByText(/Player One/).length).toBeGreaterThan(0);
  });
});
