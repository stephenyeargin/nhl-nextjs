import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StoryProvider, { useStoryContext } from './StoryContext';

jest.mock('@/app/utils/formatters', () => ({
  formatHeadTitle: jest.fn(),
  formatLocalizedDate: (d: string) => d,
}));

const TestConsumer: React.FC = () => {
  const { story, game, players, sidebarStories, pageError } = useStoryContext();

  return (
    <div>
      <div data-testid="story-headline">{story.headline}</div>
      {game && <div data-testid="game-loaded">yes</div>}
      <div data-testid="players-count">{players.length}</div>
      <div data-testid="sidebar-count">{sidebarStories.items ? sidebarStories.items.length : 0}</div>
      {pageError && <div data-testid="story-error">{pageError.message}</div>}
    </div>
  );
};

const makeFetchResponse = (ok: boolean, jsonData: any) => ({ ok, json: async () => jsonData });

describe('StoryContext', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (global as any).fetch = jest.fn();
  });

  test('loads story, players, game, and sidebar', async () => {
    const story = {
      headline: 'Big Win',
      contentDate: '2025-01-02',
      tags: [
        { externalSourceName: 'game', extraData: { gameId: '5555' } },
        { externalSourceName: 'player', id: 1 },
        { externalSourceName: 'player', id: 2 },
      ],
    };
    (global.fetch as any)
      // story
      .mockResolvedValueOnce(makeFetchResponse(true, story))
      // sidebar stories
      .mockResolvedValueOnce(makeFetchResponse(true, { items: [{ id: 'a' }] }))
      // game
      .mockResolvedValueOnce(makeFetchResponse(true, { some: 'game' }));

    render(<StoryProvider storyId="abc123"><TestConsumer /></StoryProvider>);
    await waitFor(() => expect(screen.getByTestId('story-headline').textContent).toBe('Big Win'));
    expect(screen.getByTestId('players-count').textContent).toBe('2');
    expect(screen.getByTestId('game-loaded')).toBeTruthy();
  });

  test('legacy story redirects', async () => {
    (global as any).fetch.mockResolvedValueOnce(makeFetchResponse(true, { items: [{ slug: 'legacy-slug' }] }));
    const originalLocation = window.location;
    const replaceSpy = jest.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, replace: replaceSpy },
    });
    render(<StoryProvider storyId="c-12345"><div /> </StoryProvider>);
    await waitFor(() => expect(replaceSpy).toHaveBeenCalledWith('/news/legacy-slug'));
    Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
  });

  test('handles fetch error', async () => {
    (global as any).fetch.mockResolvedValueOnce({ ok: false });
    render(<StoryProvider storyId="broken"><TestConsumer /></StoryProvider>);
    await waitFor(() => expect(screen.getByTestId('story-error')).toBeTruthy());
  });
});
