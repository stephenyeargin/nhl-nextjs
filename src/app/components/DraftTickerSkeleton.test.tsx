import React from 'react';
import { render } from '@testing-library/react';
import DraftTickerSkeleton from './DraftTickerSkeleton';

describe('DraftTickerSkeleton', () => {
  it('renders', () => {
    render(<DraftTickerSkeleton />);
  });
});
