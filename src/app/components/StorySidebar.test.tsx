import React from 'react';
import { render, screen } from '@testing-library/react';
import StorySidebar from './StorySidebar';

jest.mock('./StoryCard', () => {
  const SC = (props: any) => (
    <div data-testid="story-card" {...props}>
      {props.item?.slug}
    </div>
  );
  (SC as any).displayName = 'StoryCardMock';

  return SC;
});
jest.mock('./GameTile', () => {
  const GT = (props: any) => (
    <div data-testid="game-tile" {...props}>
      GameTile
    </div>
  );
  (GT as any).displayName = 'GameTileMock';

  return GT;
});

jest.mock('../contexts/StoryContext', () => ({
  useStoryContext: () => ({
    story: { relations: [{ _entityId: '1', type: 'story', slug: 'story-one' }] },
    game: { id: 99 },
    sidebarStories: { items: [{ _entityId: '2', slug: 'top-story' }] },
  }),
}));

describe('StorySidebar (smoke)', () => {
  it('renders related, game tile, and top stories', () => {
    render(<StorySidebar />);
    expect(screen.getByTestId('game-tile')).toBeInTheDocument();
    expect(screen.getByText('story-one')).toBeInTheDocument();
    expect(screen.getByText('top-story')).toBeInTheDocument();
  });
});
