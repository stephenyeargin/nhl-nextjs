import React from 'react';
import { render } from '@testing-library/react';
import GamePageSkeleton from './GamePageSkeleton';

describe('GamePageSkeleton', () => {
  it('renders', () => {
    render(<GamePageSkeleton />);
  });
});
