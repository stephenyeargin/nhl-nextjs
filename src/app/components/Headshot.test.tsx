import React from 'react';
import { render, screen } from '@testing-library/react';
import Headshot from './Headshot';

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: any) => <a href={href}>{children}</a>;
  MockLink.displayName = 'MockLink';

  return MockLink;
});
jest.mock('next/image', () => {
  const MockImage = (props: any) => <span data-testid="mock-image" aria-label={props.alt}>{props.alt}</span>;
  MockImage.displayName = 'MockImage';

  return MockImage;
});
jest.mock('../utils/teamData', () => ({
  getTeamDataByAbbreviation: () => ({ teamColor: '#112233', secondaryTeamColor: '#445566' }),
}));

describe('Headshot', () => {
  test('renders placeholder when no src', () => {
    const { container } = render(<Headshot alt="No Image" />);
    expect(container.querySelector('div.rounded-full')).toBeTruthy();
  });

  test('renders linked image with styling when playerId and team provided', () => {
    render(<Headshot src="/img.png" alt="Player" playerId={99} team="BOS" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/player/99');
  expect(screen.getByTestId('mock-image').getAttribute('aria-label')).toBe('Player');
  });
});
