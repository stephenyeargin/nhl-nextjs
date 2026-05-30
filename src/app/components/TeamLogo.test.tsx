import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TeamLogo from './TeamLogo';

jest.mock('next/image', () => {
  const MockImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
    <img alt={props.alt || 'img'} {...props} />
  );
  MockImage.displayName = 'MockImage';

  return MockImage;
});
jest.mock(
  'next/link',
  () =>
    ({ children }: { children?: React.ReactNode }) =>
      children
);

jest.mock('../utils/teamData', () => ({
  getTeamDataByAbbreviation: (abbr: string) =>
    abbr === 'BOS' ? { teamId: 6, abbreviation: 'BOS' } : { teamId: 0 },
  getTeamDataByCommonName: (name: string) =>
    name === 'Bruins' ? { teamId: 6, abbreviation: 'BOS' } : { teamId: 0 },
}));

describe('TeamLogo', () => {
  const createMatchMedia = (matches: boolean): Window['matchMedia'] => {
    return () => ({
      matches,
      media: '',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  };

  test('renders provided src and alt', () => {
    render(<TeamLogo src="https://assets.nhle.com/logos/nhl/svg/BOS_light.svg" alt="Bruins" />);
    const img = screen.getByAltText('Bruins');
    expect(img.getAttribute('src')).toEqual(expect.stringContaining('BOS_light.svg'));
  });

  test('derives src from team abbreviation and dark mode override', () => {
    render(<TeamLogo team="BOS" alt="Bruins" colorMode="dark" />);
    const img = screen.getByAltText('Bruins');
    expect(img.getAttribute('src')).toContain('BOS_dark.svg');
  });

  test('wraps in link if short team code provided', () => {
    render(<TeamLogo team="BOS" alt="Bruins" />);
    const img = screen.getByAltText('Bruins');
    expect(img).not.toBeNull();
  });

  test('falls back to common name lookup when abbreviation missing', () => {
    render(<TeamLogo team="Bruins" alt="Bruins" />);
    expect(screen.getByAltText('Bruins')).toBeInTheDocument();
  });

  test('respects noLink flag', () => {
    render(<TeamLogo team="BOS" alt="Bruins" noLink />);
    const img = screen.getByAltText('Bruins');
    expect(img.closest('a')).toBeNull();
  });

  test('auto theme switching (light) when colorMode auto and media query light', () => {
    window.matchMedia = createMatchMedia(false);
    render(<TeamLogo team="BOS" alt="Bruins" />);
    const img = screen.getByAltText('Bruins');
    expect(img.getAttribute('src')).toContain('BOS_light');
  });

  test('auto theme switching (dark) when colorMode auto and media query dark', () => {
    window.matchMedia = createMatchMedia(true);
    render(<TeamLogo team="BOS" alt="Bruins" colorMode="auto" />);
    const img = screen.getByAltText('Bruins');
    expect(img.getAttribute('src')).toContain('BOS_dark');
  });

  test('long team name does not wrap in link', () => {
    render(<TeamLogo team="VERYLONG" alt="Long" />);
    const img = screen.getByAltText('Long');
    expect(img.closest('a')).toBeNull();
  });
});
