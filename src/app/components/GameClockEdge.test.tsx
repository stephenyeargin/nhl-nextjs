import React from 'react';
import { render, screen, act } from '@testing-library/react';
import GameClock from './GameClock';

describe('GameClock edge cases', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test('does not go negative from 00:00', () => {
    render(<GameClock timeRemaining="00:00" running />);
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('00:00')).toBeTruthy();
  });
});
