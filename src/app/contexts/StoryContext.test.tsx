import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StoryProvider, { useStoryContext } from './StoryContext';
import { replaceLocation } from '@/app/utils/navigation';

jest.mock('@/app/utils/formatters', () => ({
  formatHeadTitle: jest.fn(),
  formatLocalizedDate: (d: string) => d,
}));

jest.mock('@/app/utils/navigation', () => ({
  replaceLocation: jest.fn(),
}));

const TestConsumer: React.FC = () => {
  const { story, game, players, sidebarStories, pageError } = useStoryContext();
  const sidebarCount =
    sidebarStories && typeof sidebarStories === 'object' && 'items' in sidebarStories
      ? Array.isArray((sidebarStories as { items?: unknown[] }).items)
        ? ((sidebarStories as { items?: unknown[] }).items?.length ?? 0)
        : 0
      : 0;

  return (
    <div>
      <div data-testid="story-headline">{story.headline}</div>
      {game && <div data-testid="game-loaded">yes</div>}
      <div data-testid="players-count">{players.length}</div>
      <div data-testid="sidebar-count">{sidebarCount}</div>
      {pageError && <div data-testid="story-error">{pageError.message}</div>}
    </div>
  );
};

const makeFetchResponse = (ok: boolean, jsonData: unknown) =>
  ({ ok, json: async () => jsonData }) as Response;

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe('StoryContext', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = mockFetch;
    mockFetch.mockReset();
    jest.useFakeTimers();
    jest.spyOn(console, 'error').mockImplementation(() => {
      /* silent expected error */
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    (console.error as unknown as jest.Mock).mockRestore?.();
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
    mockFetch
      // story
      .mockResolvedValueOnce(makeFetchResponse(true, story))
      // sidebar stories
      .mockResolvedValueOnce(makeFetchResponse(true, { items: [{ id: 'a' }] }))
      // game
      .mockResolvedValueOnce(makeFetchResponse(true, { some: 'game' }));

    render(
      <StoryProvider storyId="abc123">
        <TestConsumer />
      </StoryProvider>
    );
    await waitFor(() => expect(screen.getByTestId('story-headline').textContent).toBe('Big Win'));
    expect(screen.getByTestId('players-count').textContent).toBe('2');
    expect(screen.getByTestId('game-loaded')).toBeTruthy();
  });

  test('legacy story redirects', async () => {
    mockFetch.mockResolvedValueOnce(makeFetchResponse(true, { items: [{ slug: 'legacy-slug' }] }));
    render(
      <StoryProvider storyId="c-12345">
        <div />{' '}
      </StoryProvider>
    );
    await waitFor(() => expect(replaceLocation).toHaveBeenCalledWith('/news/legacy-slug'));
  });

  test('handles fetch error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false } as Response);
    render(
      <StoryProvider storyId="broken">
        <TestConsumer />
      </StoryProvider>
    );
    await waitFor(() => expect(screen.getByTestId('story-error')).toBeTruthy());
  });
});
