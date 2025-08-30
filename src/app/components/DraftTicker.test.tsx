import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DraftTicker from './DraftTicker';

jest.mock('./TeamLogo', () => {
  const Mock = (_props: any) => <div data-testid="logo" />;
  (Mock as any).displayName = 'TeamLogoMock';

  return Mock;
});

const mockFetch = jest.fn();
(global as any).fetch = mockFetch;

describe('DraftTicker', () => {
  it('renders picks after fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          selectableRounds: [1],
          picks: [
            {
              overallPick: 1,
              round: 1,
              teamLogoLight: 'x',
              teamAbbrev: 'NSH',
              firstName: { default: 'First' },
              lastName: { default: 'Last' },
              positionCode: 'C',
            },
          ],
        }),
    });
    render(<DraftTicker />);
    await waitFor(() => expect(screen.getByText(/First Last/)).toBeInTheDocument());
  });
});
