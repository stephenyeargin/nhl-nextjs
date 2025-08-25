import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import LeagueToggle from './LeagueToggle';

jest.mock('./TeamLogo', () => {
  const Mock = ({ colorMode: _colorMode, ...rest }: any) => <div data-testid="team-logo" {...rest}>Logo</div>;
  (Mock as any).displayName = 'TeamLogoMock';

  return Mock;
});

jest.mock('../utils/formatters', () => ({
  ...(jest.requireActual('../utils/formatters')),
  formatTextColorByBackgroundColor: (color: string) => (color === '#ffffff' ? '#000' : '#FFF')
}));

describe('LeagueToggle', () => {
  it('calls handlers and applies active styles', () => {
    const handler = jest.fn();
    render(<LeagueToggle activeLeague="nhl" handleChangeLeagues={handler} activeColor="#123456" />);

    const nhlBtn = screen.getByRole('button', { name: /National Hockey League/i });
    const otherBtn = screen.getByRole('button', { name: /Other Leagues/i });

  // NHL button should have inline background color applied (JSDOM computes to rgb)
  expect((nhlBtn as HTMLElement).style.backgroundColor).toBe('rgb(18, 52, 86)');
    fireEvent.click(otherBtn);
    expect(handler).toHaveBeenCalledWith('other');
  });

  it('switches active league color path', () => {
    const handler = jest.fn();
    const { rerender } = render(<LeagueToggle activeLeague="other" handleChangeLeagues={handler} activeColor="#ffffff" />);

    const otherBtn = screen.getByRole('button', { name: /Other Leagues/i });
    fireEvent.click(otherBtn); // clicking active still triggers
    expect(handler).toHaveBeenCalledWith('other');

    rerender(<LeagueToggle activeLeague="nhl" handleChangeLeagues={handler} activeColor="#ffffff" />);
    const nhlBtn = screen.getByRole('button', { name: /National Hockey League/i });
    fireEvent.click(nhlBtn);
    expect(handler).toHaveBeenCalledWith('nhl');
  });
});
