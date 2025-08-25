import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoadMoreButton from './LoadMoreButton';

describe('LoadMoreButton', () => {
  it('fires click handler', () => {
    const fn = jest.fn();
    render(<LoadMoreButton handleClick={fn} />);
    fireEvent.click(screen.getByRole('button', { name: /load more/i }));
    expect(fn).toHaveBeenCalled();
  });
});
