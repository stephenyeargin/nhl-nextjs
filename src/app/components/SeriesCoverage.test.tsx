import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SeriesCoverage from './SeriesCoverage';

jest.mock('@/app/components/StoryCard', () => {
  const StoryCard: React.FC<{ item?: { slug?: string } }> = (props) => (
    <div data-testid="story-card">{props.item?.slug}</div>
  );
  StoryCard.displayName = 'StoryCardMock';

  return StoryCard;
});

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;

const makeStory = (id: number) => ({
  _entityId: id,
  slug: `story-${id}`,
});

describe('SeriesCoverage', () => {
  beforeEach(() => {
    global.fetch = mockFetch;
  });

  afterEach(() => {
    mockFetch.mockReset();
    jest.resetAllMocks();
  });

  it('loads first page and shows load more button when next page exists', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [makeStory(1), makeStory(2)],
        pagination: { nextUrl: '/next' },
      }),
    } as Response);

    render(<SeriesCoverage year={2025} seriesString="series-a-coverage" />);

    await waitFor(() => expect(screen.getByText('story-1')).toBeInTheDocument());

    expect(screen.getByText('story-2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('tags.slug=series-a'),
      expect.objectContaining({ cache: 'no-store' })
    );
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('$skip=0&$limit=24'),
      expect.objectContaining({ cache: 'no-store' })
    );
  });

  it('loads another page when clicking load more', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [makeStory(1)],
          pagination: { nextUrl: '/next' },
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [makeStory(2)],
          pagination: { nextUrl: null },
        }),
      } as Response);

    render(<SeriesCoverage year={2025} seriesString="series-a" />);

    await waitFor(() => expect(screen.getByText('story-1')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /load more/i }));

    await waitFor(() => expect(screen.getByText('story-2')).toBeInTheDocument());

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('$skip=24&$limit=24'),
      expect.objectContaining({ cache: 'no-store' })
    );
    expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument();
  });

  it('deduplicates stories when later pages repeat entity IDs', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [makeStory(1)],
          pagination: { nextUrl: '/next' },
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [makeStory(1), makeStory(2)],
          pagination: { nextUrl: null },
        }),
      } as Response);

    render(<SeriesCoverage year={2025} seriesString="series-a" />);

    await waitFor(() => expect(screen.getByText('story-1')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /load more/i }));

    await waitFor(() => expect(screen.getByText('story-2')).toBeInTheDocument());

    expect(screen.getAllByTestId('story-card')).toHaveLength(2);
  });

  it('renders nothing when no stories are returned and there is no next page', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [],
        pagination: { nextUrl: null },
      }),
    } as Response);

    render(<SeriesCoverage year={2025} seriesString="series-a" />);

    await waitFor(() => {
      expect(screen.queryByText('Series Coverage')).not.toBeInTheDocument();
    });
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
