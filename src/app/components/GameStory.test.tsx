import React from 'react';
import { render, waitFor } from '@testing-library/react';
import GameStory from './GameStory';

// Mock next/image (add displayName); allow native img for simplicity

jest.mock('next/image', () => {
  const MockImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
    <img {...props} alt={props.alt || 'image'} />
  );
  MockImage.displayName = 'NextImageMock';

  return MockImage;
});

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;

// Mock fetch to return no items (empty state)
beforeEach(() => {
  global.fetch = mockFetch;
  mockFetch.mockReset();
  mockFetch.mockResolvedValue({ json: async () => ({ items: [] }) } as Response);
});

afterEach(() => {
  mockFetch.mockReset();
});

describe('GameStory (smoke)', () => {
  it('renders nothing when no story items', async () => {
    const { container } = render(<GameStory game={{ id: 123, gameState: 'FUT' }} />);
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });
});
