import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FloatingAudioPlayer from './FloatingAudioPlayer';
import FloatingVideoPlayer from './FloatingVideoPlayer';

// Mock next/image (not strictly needed here) with display name & suppress @next/next rule
// eslint-disable-next-line @next/next/no-img-element
jest.mock('next/image', () => {
  // eslint-disable-next-line @next/next/no-img-element
  const Img = ({ alt }: any) => <img alt={alt || 'img'} />;
  (Img as any).displayName = 'MockImage';

  return Img;
});

// Mock react-player lazy import (suspends internally) to avoid act() Suspense warning
jest.mock('react-player/lazy', () => {
  // eslint-disable-next-line react/display-name
  const Player = () => <div data-testid="react-player" />;
  (Player as any).displayName = 'ReactPlayerMock';

  return Player;
});

describe('Floating media players (extra coverage)', () => {
  test('FloatingAudioPlayer visible & close handler', () => {
    const onClose = jest.fn();
    const onTogglePlay = jest.fn();
    render(
      <FloatingAudioPlayer
        url="https://example.com/audio.mp3"
        label="Sample Audio"
        isVisible
        isPlaying
        onClose={onClose}
        onTogglePlay={onTogglePlay}
      />
    );
    expect(screen.getByText(/Sample Audio/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalled();
  });

  test('FloatingVideoPlayer visible & close handler', () => {
    const onClose = jest.fn();
    render(
      <FloatingVideoPlayer
        url="https://example.com/video"
        label="Sample Video"
        isVisible
        onClose={onClose}
      />
    );
    expect(screen.getByText(/Sample Video/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalled();
  });
});
