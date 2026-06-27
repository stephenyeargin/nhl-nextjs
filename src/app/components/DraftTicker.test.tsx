import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DraftTicker from './DraftTicker';

jest.mock('./TeamLogo', () => {
  const Mock: React.FC<Record<string, unknown>> = () => <div data-testid="logo" />;
  Mock.displayName = 'TeamLogoMock';

  return Mock;
});

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe('DraftTicker', () => {
  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockReset();
  });

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
    } as Response);
    render(<DraftTicker />);
    await waitFor(() => expect(screen.getByText('Last')).toBeInTheDocument());
    expect(screen.getByText('First')).toBeInTheDocument();
  });

  it('renders voided picks with "\u2014 Voided \u2014" instead of player name', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          selectableRounds: [1],
          picks: [
            {
              overallPick: 1,
              round: 1,
              teamLogoLight: 'x',
              teamAbbrev: 'ARI',
              lastName: { default: 'Void' },
            },
          ],
        }),
    } as Response);
    render(<DraftTicker />);
    await waitFor(() => expect(screen.getByText('— Voided —')).toBeInTheDocument());
    expect(screen.queryByText('Void', { exact: true })).not.toBeInTheDocument();
  });

  it('renders forfeited picks with "\u2014 Forfeited \u2014" instead of player name', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          selectableRounds: [1],
          picks: [
            {
              overallPick: 1,
              round: 1,
              teamLogoLight: 'x',
              teamAbbrev: 'VGK',
              lastName: { default: 'Forfeited' },
            },
          ],
        }),
    } as Response);
    render(<DraftTicker />);
    await waitFor(() => expect(screen.getByText('— Forfeited —')).toBeInTheDocument());
  });

  it('renders score ticker empty state when no picks are available', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          selectableRounds: [1],
          picks: [],
        }),
    } as Response);

    render(<DraftTicker />);

    await waitFor(() => expect(screen.getByText('Draft order pending.')).toBeInTheDocument());
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });
});
