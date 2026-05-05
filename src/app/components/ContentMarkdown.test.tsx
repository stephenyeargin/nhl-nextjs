import React from 'react';
import { render, screen } from '@testing-library/react';
import ContentMarkdown from './ContentMarkdown';

jest.mock('../utils/formatters', () => ({
  formatMarkdownContent: (c: string) => c,
}));

jest.mock('./PlayerLink', () => {
  const MockPlayerLink = ({
    children,
    playerId,
    className,
  }: React.PropsWithChildren<{ playerId: string | number; className?: string }>) => (
    <button data-testid="player-link" data-player-id={String(playerId)} className={className}>
      {children}
    </button>
  );

  return {
    __esModule: true,
    default: MockPlayerLink,
  };
});

describe('ContentMarkdown', () => {
  test('renders markdown content as html', () => {
    render(
      <ContentMarkdown part={{ _entityId: 'x', content: '<p class="mb-4">Hello *World*</p>' }} />
    );
    expect(screen.getByText('Hello *World*')).toBeTruthy();
  });

  test('renders player links with PlayerLink component', () => {
    render(
      <ContentMarkdown
        part={{
          _entityId: 'x',
          content: '<p><a class="underline" href="/player/taylor-hall-8475791">Taylor Hall</a></p>',
        }}
      />
    );

    const link = screen.getByTestId('player-link');
    expect(link).toHaveAttribute('data-player-id', '8475791');
    expect(link).toHaveClass('underline');
    expect(screen.getByText('Taylor Hall')).toBeTruthy();
  });

  test('keeps non-player links as anchors', () => {
    render(
      <ContentMarkdown
        part={{
          _entityId: 'x',
          content: '<p><a class="underline" href="/team/bos">Boston Bruins</a></p>',
        }}
      />
    );

    const link = screen.getByRole('link', { name: 'Boston Bruins' });
    expect(link).toHaveAttribute('href', '/team/bos');
    expect(link).toHaveClass('underline');
  });
});
