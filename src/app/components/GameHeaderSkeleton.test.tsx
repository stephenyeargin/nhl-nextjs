import React from 'react';
import { render } from '@testing-library/react';
import GameHeaderSkeleton from './GameHeaderSkeleton';

describe('GameHeaderSkeleton', () => {
  it('renders without crashing', () => {
    render(<GameHeaderSkeleton />);
  });
});
