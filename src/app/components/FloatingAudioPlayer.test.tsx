import React from 'react';
import { render, screen } from '@testing-library/react';
import FloatingAudioPlayer from './FloatingAudioPlayer';

jest.mock('react-player/lazy', () => {
  // eslint-disable-next-line react/display-name
  const Player = () => <div data-testid="react-player" />;
  (Player as any).displayName = 'ReactPlayerMock';

  return Player;
});

describe('FloatingAudioPlayer', () => {
  it('shows label when visible', () => {
    render(<FloatingAudioPlayer url="https://example.com/stream" label="Test" isVisible onClose={() => {}} onTogglePlay={() => {}} />);
    expect(screen.getByText(/test radio/i)).toBeInTheDocument();
  });
});
