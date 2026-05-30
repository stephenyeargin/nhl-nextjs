import React from 'react';
import { render, waitFor } from '@testing-library/react';
import NewsPage from './page';

// Capture props passed to StoryCard to assert layout logic
type CapturedCard = {
  size?: string;
  showDate?: boolean;
  item?: { _entityId?: string; slug?: string };
};
const captured: CapturedCard[] = [];

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;

jest.mock('./components/StoryCard', () => {
  const StoryCard: React.FC<{
    size?: string;
    showDate?: boolean;
    item?: { _entityId?: string; slug?: string };
  }> = (props) => {
    captured.push({ size: props.size, showDate: !!props.showDate, item: props.item });

    return (
      <div data-testid={`story-card-${props.item?._entityId || 'unknown'}`}>
        StoryCard-{props.size || 'default'}
      </div>
    );
  };
  StoryCard.displayName = 'StoryCardMock';

  return StoryCard;
});

// Mock markdown formatter passthrough
jest.mock('./utils/formatters', () => ({
  formatMarkdownContent: (c: string) => c,
}));

const makeItem = (id: number) => ({
  _entityId: id.toString(),
  slug: `news-${id}`,
  thumbnail: { templateUrl: `https://example.com/image${id}.jpg` },
  headline: `News Headline ${id}`,
  summary: `Summary ${id}`,
});

describe('NewsPage (page component)', () => {
  beforeEach(() => {
    captured.length = 0;
    global.fetch = mockFetch;
    mockFetch.mockReset();
  });

  afterEach(() => {
    mockFetch.mockReset();
    jest.resetAllMocks();
  });

  it('renders skeleton when API returns empty list', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ items: [] }) } as Response);
    render(<NewsPage />);
    // Wait a tick to allow effect to settle
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    // No StoryCard rendered implies skeleton path exercised
    expect(captured.length).toBe(0);
  });

  it('renders only large card when one item', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ items: [makeItem(1)] }),
    } as Response);
    render(<NewsPage />);
    await waitFor(() => expect(captured.length).toBe(1));
    expect(captured[0].size).toBe('large');
  });

  it('renders large and medium cards when two items', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ items: [makeItem(1), makeItem(2)] }),
    } as Response);
    render(<NewsPage />);
    await waitFor(() => expect(captured.length).toBe(2));
    expect(captured[0].size).toBe('large');
    expect(captured[1].size).toBe('medium');
  });

  it('renders additional default cards with showDate when more than two items', async () => {
    const items = [1, 2, 3, 4].map(makeItem);
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ items }) } as Response);
    render(<NewsPage />);
    await waitFor(() => expect(captured.length).toBe(4));
    // first two sizes
    expect(captured[0].size).toBe('large');
    expect(captured[1].size).toBe('medium');
    // remaining have showDate true and no size prop
    expect(captured[2].showDate).toBe(true);
    expect(captured[2].size).toBeUndefined();
    expect(captured[3].showDate).toBe(true);
  });

  it('gracefully handles non-ok response (returns empty array)', async () => {
    mockFetch.mockResolvedValue({ ok: false, json: async () => ({}) } as Response);
    render(<NewsPage />);
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    expect(captured.length).toBe(0);
  });

  it('gracefully handles fetch rejection', async () => {
    mockFetch.mockRejectedValue(new Error('boom'));
    render(<NewsPage />);
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    expect(captured.length).toBe(0);
  });
});
