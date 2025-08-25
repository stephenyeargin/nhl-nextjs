import React from 'react';
import { render, screen } from '@testing-library/react';
import FloatingVideoPlayer from './FloatingVideoPlayer';

describe('FloatingVideoPlayer', () => {
  it('mounts with provided title', () => {
    render(
      <FloatingVideoPlayer
        isVisible
        label="Clip Title"
        url="https://example.com/clip"
        onClose={() => {}}
      />
    );
    expect(screen.getByText(/clip title/i)).toBeInTheDocument();
  });
});
