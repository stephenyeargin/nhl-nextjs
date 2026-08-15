import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatLeaderboard from './StatLeaderboard';
import type { StatsLeaderPlayer } from '@/app/types/player';

jest.mock('./Headshot', () => {
  const Mock: React.FC<{ alt: string }> = ({ alt }) => <span data-testid="headshot">{alt}</span>;
  Mock.displayName = 'HeadshotMock';

  return Mock;
});
jest.mock('./TeamLogo', () => {
  const Mock: React.FC<{ team?: string }> = ({ team }) => (
    <span data-testid="team-logo">{team}</span>
  );
  Mock.displayName = 'TeamLogoMock';

  return Mock;
});
jest.mock('./PlayerLink', () => {
  const Mock: React.FC<{ children?: React.ReactNode; playerId: number | string }> = ({
    children,
    playerId,
  }) => <a href={`/player/${playerId}`}>{children}</a>;
  Mock.displayName = 'PlayerLinkMock';

  return Mock;
});

const makePlayer = (overrides: Partial<StatsLeaderPlayer> = {}): StatsLeaderPlayer => ({
  id: 8478402,
  firstName: { default: 'Connor' },
  lastName: { default: 'McDavid' },
  teamAbbrev: 'EDM',
  teamLogo: 'https://assets.nhle.com/logos/nhl/svg/EDM_light.svg',
  headshot: 'https://assets.nhle.com/mugs/nhl/20252026/EDM/8478402.png',
  position: 'C',
  value: 48,
  ...overrides,
});

describe('StatLeaderboard', () => {
  test('renders nothing when there are no rows', () => {
    const { container } = render(<StatLeaderboard heading="Goals" rows={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders heading, rank, player link, and raw value when no formatter given', () => {
    render(<StatLeaderboard heading="Goals" rows={[makePlayer()]} />);

    expect(screen.getByText('Goals')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveTextContent('Connor McDavid');
    expect(screen.getByRole('link')).toHaveAttribute('href', '/player/8478402');
    expect(screen.getByTestId('team-logo')).toHaveTextContent('EDM');
    expect(screen.getByText('48')).toBeInTheDocument();
  });

  test('applies the format function to each value', () => {
    render(
      <StatLeaderboard
        heading="Save %"
        rows={[makePlayer({ value: 0.921 })]}
        format={(value) => value.toFixed(3).replace(/^0/, '')}
      />
    );

    expect(screen.getByText('.921')).toBeInTheDocument();
  });

  test('numbers rows in order', () => {
    render(
      <StatLeaderboard
        heading="Points"
        rows={[
          makePlayer({ id: 1, lastName: { default: 'First' } }),
          makePlayer({ id: 2, lastName: { default: 'Second' } }),
        ]}
      />
    );

    const ranks = screen.getAllByText(/^[12]$/);
    expect(ranks.map((el) => el.textContent)).toEqual(['1', '2']);
  });
});
