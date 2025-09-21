import React from 'react';
import { render, screen } from '@testing-library/react';
import TeamLogoByTeamId from './TeamLogoByTeamId';

// Mock TeamLogo to a simple div that echoes props
jest.mock('./TeamLogo', () => {
  const Mock = ({ alt, className }: any) => (
    <div data-testid="team-logo" data-alt={alt} className={className} />
  );
  (Mock as any).displayName = 'TeamLogoMock';

  return Mock;
});

const homeTeam = { id: 1, abbrev: 'NSH', logo: '/nsh.png' };
const awayTeam = { id: 2, abbrev: 'CBJ', logo: '/cbj.png' };

describe('TeamLogoByTeamId', () => {
  it('renders home team logo when teamId matches home', () => {
    const { asFragment } = render(
      <TeamLogoByTeamId
        teamId={1}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        size={16}
        theme="light"
      />
    );
    const logo = screen.getByTestId('team-logo');
    expect(logo).toHaveAttribute('data-alt', 'NSH');
    expect(logo).toHaveClass('h-16');
    expect(logo).toHaveClass('w-16');
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders away team logo when teamId matches away', () => {
    const { asFragment } = render(
      <TeamLogoByTeamId teamId={2} homeTeam={homeTeam} awayTeam={awayTeam} />
    );
    const logo = screen.getByTestId('team-logo');
    expect(logo).toHaveAttribute('data-alt', 'CBJ');
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders nothing when teamId is unknown', () => {
    const { container, asFragment } = render(
      <TeamLogoByTeamId teamId={999} homeTeam={homeTeam} awayTeam={awayTeam} />
    );
    expect(container).toBeEmptyDOMElement();
    expect(asFragment()).toMatchSnapshot();
  });
});
