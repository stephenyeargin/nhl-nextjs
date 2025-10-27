import React from 'react';
import { render, waitFor } from '@testing-library/react';
import GameStory from './GameStory';

// Mock next/image (add displayName); allow native img for simplicity

jest.mock('next/image', () => {
  const MockImage = (props: any) => <img {...props} alt={props.alt || 'image'} />;
  (MockImage as any).displayName = 'NextImageMock';

  return MockImage;
});

// Mock fetch to return no items (empty state)
beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({ json: async () => ({ items: [] }) });
});

afterEach(() => {
  (global.fetch as jest.Mock).mockRestore?.();
});

describe('GameStory (smoke)', () => {
  it('renders nothing when no story items', async () => {
    const { container } = render(<GameStory game={{ id: 123, gameState: 'FUT' }} />);
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });
});
