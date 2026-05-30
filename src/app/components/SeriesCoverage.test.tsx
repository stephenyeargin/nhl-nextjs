import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SeriesCoverage from './SeriesCoverage';

jest.mock('@/app/components/StoryCard', () => {
  const StoryCard = (props: any) => <div data-testid="story-card">{props.item?.slug}</div>;
  (StoryCard as any).displayName = 'StoryCardMock';

  return StoryCard;
});

const makeStory = (id: number) => ({
  _entityId: id,
  slug: `story-${id}`,
});

describe('SeriesCoverage', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('loads first page and shows load more button when next page exists', async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [makeStory(1), makeStory(2)],
        pagination: { nextUrl: '/next' },
      }),
    });

    render(<SeriesCoverage year={2025} seriesString="series-a-coverage" />);

    await waitFor(() => expect(screen.getByText('story-1')).toBeInTheDocument());

    expect(screen.getByText('story-2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument();
    expect((global as any).fetch).toHaveBeenCalledWith(
      expect.stringContaining('tags.slug=series-a'),
      expect.objectContaining({ cache: 'no-store' })
    );
    expect((global as any).fetch).toHaveBeenCalledWith(
      expect.stringContaining('$skip=0&$limit=24'),
      expect.objectContaining({ cache: 'no-store' })
    );
  });

  it('loads another page when clicking load more', async () => {
    (global as any).fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [makeStory(1)],
          pagination: { nextUrl: '/next' },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [makeStory(2)],
          pagination: { nextUrl: null },
        }),
      });

    render(<SeriesCoverage year={2025} seriesString="series-a" />);

    await waitFor(() => expect(screen.getByText('story-1')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /load more/i }));

    await waitFor(() => expect(screen.getByText('story-2')).toBeInTheDocument());

    expect((global as any).fetch).toHaveBeenCalledTimes(2);
    expect((global as any).fetch).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('$skip=24&$limit=24'),
      expect.objectContaining({ cache: 'no-store' })
    );
    expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument();
  });

  it('deduplicates stories when later pages repeat entity IDs', async () => {
    (global as any).fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [makeStory(1)],
          pagination: { nextUrl: '/next' },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [makeStory(1), makeStory(2)],
          pagination: { nextUrl: null },
        }),
      });

    render(<SeriesCoverage year={2025} seriesString="series-a" />);

    await waitFor(() => expect(screen.getByText('story-1')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /load more/i }));

    await waitFor(() => expect(screen.getByText('story-2')).toBeInTheDocument());

    expect(screen.getAllByTestId('story-card')).toHaveLength(2);
  });

  it('renders nothing when no stories are returned and there is no next page', async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [],
        pagination: { nextUrl: null },
      }),
    });

    render(<SeriesCoverage year={2025} seriesString="series-a" />);

    await waitFor(() => {
      expect(screen.queryByText('Series Coverage')).not.toBeInTheDocument();
    });
    expect((global as any).fetch).toHaveBeenCalledTimes(1);
  });
});
