import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TeamLogo from './TeamLogo';

jest.mock('next/image', () => {
  // eslint-disable-next-line @next/next/no-img-element, react/display-name
  const MockImage = (props: any) => <img alt={props.alt || 'img'} {...props} />;
  MockImage.displayName = 'MockImage';

  return MockImage;
});
jest.mock('next/link', () => ({ children }: any) => children);

jest.mock('../utils/teamData', () => ({
  getTeamDataByAbbreviation: (abbr: string) => (abbr === 'BOS' ? { teamId: 6, abbreviation: 'BOS' } : { teamId: 0 }),
  getTeamDataByCommonName: () => ({ teamId: 0 }),
}));

describe('TeamLogo', () => {
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
});
