import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingPlayoffsYearPage from './loading';

jest.mock('@/app/components/PlayoffsYearPageSkeleton', () => {
  const Mock = () => <div data-testid="playoffs-year-page-skeleton" />;
  Mock.displayName = 'PlayoffsYearPageSkeletonMock';

  return Mock;
});

describe('playoffs/[year] loading', () => {
  it('renders PlayoffsYearPageSkeleton', () => {
    render(<LoadingPlayoffsYearPage />);
    expect(screen.getByTestId('playoffs-year-page-skeleton')).toBeInTheDocument();
  });
});
