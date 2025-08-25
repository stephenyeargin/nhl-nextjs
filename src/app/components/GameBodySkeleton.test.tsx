import React from 'react';
import { render } from '@testing-library/react';
import GameBodySkeleton from './GameBodySkeleton';

describe('GameBodySkeleton', () => {
  it('renders', () => {
    render(<GameBodySkeleton />);
  });
});
