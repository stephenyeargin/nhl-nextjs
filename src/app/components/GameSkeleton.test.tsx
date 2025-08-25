import React from 'react';
import { render } from '@testing-library/react';
import GameSkeleton from './GameSkeleton';

describe('GameSkeleton', () => {
  it('renders', () => {
    render(<GameSkeleton />);
  });
});
