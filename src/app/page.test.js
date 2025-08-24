import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import NewsPage from './page';

jest.mock('./components/StoryCard', () => {
  const StoryCard = () => <div>StoryCard</div>;
  StoryCard.displayName = 'StoryCard';

  return StoryCard;
});
jest.mock('./utils/formatters', () => ({
  formatMarkdownContent: jest.fn((content) => content),
}));

describe('NewsPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
  ok: true,
        json: () => Promise.resolve({ items: [] }),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders news items when available', async () => {
    const mockNews = [
      {
        _entityId: '1',
        slug: 'news-1',
        thumbnail: { templateUrl: 'https://example.com/image1.jpg' },
        headline: 'News Headline 1',
        summary: 'Summary 1',
      },
      {
        _entityId: '2',
        slug: 'news-2',
        thumbnail: { templateUrl: 'https://example.com/image2.jpg' },
        headline: 'News Headline 2',
        summary: 'Summary 2',
      },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
  ok: true,
        json: () => Promise.resolve({ items: mockNews }),
      })
    );

    render(<NewsPage />);

    await waitFor(() => expect(screen.getByText('Latest News')).toBeInTheDocument());
    expect(screen.getAllByText('StoryCard').length).toBe(2);
  });
});