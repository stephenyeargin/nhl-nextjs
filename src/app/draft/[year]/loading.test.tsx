import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingDraftYearPage from './loading';

jest.mock('@/app/components/DraftYearPageSkeleton', () => {
  const Mock = () => <div data-testid="draft-year-page-skeleton" />;
  Mock.displayName = 'DraftYearPageSkeletonMock';

  return Mock;
});

describe('draft/[year] loading', () => {
  it('renders DraftYearPageSkeleton', () => {
    render(<LoadingDraftYearPage />);
    expect(screen.getByTestId('draft-year-page-skeleton')).toBeInTheDocument();
  });
});
