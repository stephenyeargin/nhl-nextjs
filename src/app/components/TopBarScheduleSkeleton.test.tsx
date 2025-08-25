import React from 'react';
import { render } from '@testing-library/react';
import TopBarScheduleSkeleton from './TopBarScheduleSkeleton';

describe('TopBarScheduleSkeleton', () => {
  it('renders', () => {
    render(<TopBarScheduleSkeleton />);
  });
});
