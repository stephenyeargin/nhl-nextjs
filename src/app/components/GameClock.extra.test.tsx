import React from 'react';
import { render, screen, act } from '@testing-library/react';
import GameClock from './GameClock';

jest.useFakeTimers();

describe('GameClock (extra)', () => {
  test('counts down when running', () => {
    render(<GameClock timeRemaining="00:03" running />);
    expect(screen.getByText('00:03')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('00:02')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    // Should not go past 00:00
    expect(screen.getByText('00:00')).toBeInTheDocument();
  });
});
