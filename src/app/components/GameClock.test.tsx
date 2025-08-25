import React from 'react';
import { render, screen, act } from '@testing-library/react';
import GameClock from './GameClock';

describe('GameClock', () => {
  jest.useFakeTimers();

  test('counts down when running', () => {
    render(<GameClock timeRemaining="00:03" running />);
    expect(screen.getByText('00:03')).toBeTruthy();
    act(() => { jest.advanceTimersByTime(1000); });
    expect(screen.getByText('00:02')).toBeTruthy();
    act(() => { jest.advanceTimersByTime(3000); });
    expect(screen.getByText('00:00')).toBeTruthy();
  });

  test('updates when prop changes', () => {
    const { rerender } = render(<GameClock timeRemaining="00:10" />);
    expect(screen.getByText('00:10')).toBeTruthy();
    rerender(<GameClock timeRemaining="00:05" />);
    expect(screen.getByText('00:05')).toBeTruthy();
  });
});
