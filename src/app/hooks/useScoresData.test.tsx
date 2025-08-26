import React from 'react';
import { render, screen, waitFor, act, cleanup } from '@testing-library/react';
import useScoresData from './useScoresData';

// Helper to build a minimal mock scores response
const buildScores = (date: string) => ({
  currentDate: date,
  prevDate: date,
  gameWeek: [],
  games: [],
});

describe('useScoresData', () => {
  let originalFetch: any;
  beforeEach(() => {
    originalFetch = global.fetch;
    global.fetch = jest.fn().mockImplementation((url: string) => {
      // Extract the date portion at end of URL
      const date = url.split('/').pop() || '1970-01-01';

      return Promise.resolve({ json: async () => buildScores(date) });
    });
  });
  afterEach(() => {
    cleanup();
    global.fetch = originalFetch;
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('loads initial scores (second effect run) after setting today', async () => {
    const TestComponent = () => {
      const { scores } = useScoresData();

      return <div>{scores ? 'scores-loaded' : 'loading'}</div>;
    };

    render(<TestComponent />);

    // Initial state
    expect(screen.getByText('loading')).toBeInTheDocument();

    // Wait for scores to load
    await waitFor(() => expect(screen.getByText('scores-loaded')).toBeInTheDocument());

    // fetch should have been called at least once with expected pattern
    expect(global.fetch).toHaveBeenCalled();
    const firstCall = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(firstCall).toMatch(/\/api\/nhl\/score\//);
  });

  it('handleDateChange triggers a new fetch with provided date', async () => {
    let changeDate: (_d: string) => void = () => {};
    const targetDate = '2024-10-05';

    const TestComponent = () => {
      const { scores, handleDateChange } = useScoresData();
      changeDate = handleDateChange; // capture for test

      return <div>{scores ? 'scores-loaded' : 'loading'}</div>;
    };

    render(<TestComponent />);
    await waitFor(() => expect(screen.getByText('scores-loaded')).toBeInTheDocument());
    const initialFetchCount = (global.fetch as jest.Mock).mock.calls.length;

    await act(async () => {
      changeDate(targetDate);
    });

    await waitFor(() => {
      // Expect an additional fetch containing the target date
      const calls = (global.fetch as jest.Mock).mock.calls.map((c) => c[0]);
      expect(calls.some((u: string) => u.includes(targetDate))).toBe(true);
    });

    expect((global.fetch as jest.Mock).mock.calls.length).toBeGreaterThan(initialFetchCount);
  });
});
