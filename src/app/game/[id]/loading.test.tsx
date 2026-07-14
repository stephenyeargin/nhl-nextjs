import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingGamePage from './loading';

jest.mock('@/app/components/GamePageSkeleton', () => {
  const Mock = () => <div data-testid="game-page-skeleton" />;
  Mock.displayName = 'GamePageSkeletonMock';

  return Mock;
});

describe('game/[id] loading', () => {
  it('renders GamePageSkeleton', () => {
    render(<LoadingGamePage />);
    expect(screen.getByTestId('game-page-skeleton')).toBeInTheDocument();
  });
});
