import React from 'react';
import { render, screen } from '@testing-library/react';
import PlayoffSeriesTile from './PlayoffSeriesTile';

jest.mock('next/image', () => {
  // eslint-disable-next-line @next/next/no-img-element, react/display-name
  const Img = ({ src, alt }: any) => <img data-testid="img" src={src} alt={alt} />;
  (Img as any).displayName = 'NextImageMock';

  return Img;
});
jest.mock('./TeamLogo', () => {
  // eslint-disable-next-line react/display-name
  const Logo = ({ alt }: any) => <div data-testid={`logo-${alt}`} />;
  (Logo as any).displayName = 'TeamLogoMock';

  return Logo;
});
jest.mock('next/link', () => {
  // eslint-disable-next-line react/display-name
  const Link = ({ children, href }: any) => <a href={href}>{children}</a>;
  (Link as any).displayName = 'NextLinkMock';

  return Link;
});

describe('PlayoffSeriesTile', () => {
  test('returns null when no series', () => {
    const { container } = render(<PlayoffSeriesTile year={2025} series={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders series logo only variant', () => {
    render(<PlayoffSeriesTile year={2025} series={{ seriesLetter: 'A', seriesLogo: 'logo.png' }} />);
    expect(screen.getByTestId('img')).toHaveAttribute('src', 'logo.png');
  });

  test('renders SCF variant with teams and losing opacity', () => {
    render(<PlayoffSeriesTile year={2025} series={{ seriesAbbrev: 'SCF', seriesLetter: 'F', topSeedTeam: { id: 1, abbrev: 'TOP' }, bottomSeedTeam: { id: 2, abbrev: 'BOT' }, losingTeamId: 2, topSeedWins: 4, bottomSeedWins: 2 }} />);
    expect(screen.getByTestId('logo-TOP')).toBeTruthy();
    expect(screen.getByTestId('logo-BOT').parentElement?.className).toMatch(/opacity-50/);
  });

  test('renders non-SCF variant with TBD logo', () => {
    render(<PlayoffSeriesTile year={2025} series={{ seriesLetter: 'B', topSeedTeam: { id: -1, abbrev: 'TBD' }, bottomSeedTeam: { id: 2, abbrev: 'BOT' }, topSeedWins: 0, bottomSeedWins: 1 }} />);
    expect(screen.getAllByText('TBD').length).toBeGreaterThan(0);
  });
});
