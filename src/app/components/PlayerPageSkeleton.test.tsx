import React from 'react';
import { render } from '@testing-library/react';
import PlayerPageSkeleton from './PlayerPageSkeleton';

describe('PlayerPageSkeleton', () => {
  it('renders', () => {
    render(<PlayerPageSkeleton />);
  });
});
