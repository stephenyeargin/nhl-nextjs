import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatsFilterBar from './StatsFilterBar';

const mockReplace = jest.fn();
let mockPathname = '/stats';
let mockQueryString = '';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => mockPathname,
  useSearchParams: () => new URLSearchParams(mockQueryString),
}));

const seasons = [
  { value: '20252026', label: '2025-26' },
  { value: '20242025', label: '2024-25' },
];
const franchises = [
  { value: 'all', label: 'All Franchises' },
  { value: 'EDM', label: 'Edmonton Oilers' },
];

describe('StatsFilterBar', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockPathname = '/stats';
    mockQueryString = '';
  });

  it('renders the current selections', () => {
    render(
      <StatsFilterBar
        seasons={seasons}
        franchises={franchises}
        season="20252026"
        gameType="2"
        team="all"
      />
    );

    expect(screen.getByLabelText('Season')).toHaveValue('20252026');
    expect(screen.getByLabelText('Season Type')).toHaveValue('2');
    expect(screen.getByLabelText('Franchise')).toHaveValue('all');
  });

  it('sets the season query param when a non-default season is chosen', () => {
    render(
      <StatsFilterBar
        seasons={seasons}
        franchises={franchises}
        season="20252026"
        gameType="2"
        team="all"
      />
    );

    fireEvent.change(screen.getByLabelText('Season'), { target: { value: '20242025' } });

    expect(mockReplace).toHaveBeenCalledWith('/stats?season=20242025', { scroll: false });
  });

  it('removes the season query param when the default (first) season is chosen', () => {
    mockQueryString = 'season=20242025';

    render(
      <StatsFilterBar
        seasons={seasons}
        franchises={franchises}
        season="20242025"
        gameType="2"
        team="all"
      />
    );

    fireEvent.change(screen.getByLabelText('Season'), { target: { value: '20252026' } });

    expect(mockReplace).toHaveBeenCalledWith('/stats', { scroll: false });
  });

  it('sets the gameType query param when Playoffs is chosen', () => {
    render(
      <StatsFilterBar
        seasons={seasons}
        franchises={franchises}
        season="20252026"
        gameType="2"
        team="all"
      />
    );

    fireEvent.change(screen.getByLabelText('Season Type'), { target: { value: '3' } });

    expect(mockReplace).toHaveBeenCalledWith('/stats?gameType=3', { scroll: false });
  });

  it('sets the team query param and preserves existing params', () => {
    mockQueryString = 'gameType=3';

    render(
      <StatsFilterBar
        seasons={seasons}
        franchises={franchises}
        season="20252026"
        gameType="3"
        team="all"
      />
    );

    fireEvent.change(screen.getByLabelText('Franchise'), { target: { value: 'EDM' } });

    expect(mockReplace).toHaveBeenCalledWith('/stats?gameType=3&team=EDM', { scroll: false });
  });

  it('removes the team query param when All Franchises is chosen again', () => {
    mockQueryString = 'team=EDM';

    render(
      <StatsFilterBar
        seasons={seasons}
        franchises={franchises}
        season="20252026"
        gameType="2"
        team="EDM"
      />
    );

    fireEvent.change(screen.getByLabelText('Franchise'), { target: { value: 'all' } });

    expect(mockReplace).toHaveBeenCalledWith('/stats', { scroll: false });
  });
});
