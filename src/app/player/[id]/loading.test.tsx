import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingPlayerPage from './loading';

jest.mock('@/app/components/PlayerPageSkeleton', () => {
  const Mock = () => <div data-testid="player-page-skeleton" />;
  Mock.displayName = 'PlayerPageSkeletonMock';

  return Mock;
});

describe('player/[id] loading', () => {
  it('renders PlayerPageSkeleton', () => {
    render(<LoadingPlayerPage />);
    expect(screen.getByTestId('player-page-skeleton')).toBeInTheDocument();
  });
});
