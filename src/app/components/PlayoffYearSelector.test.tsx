import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import PlayoffYearSelector from './PlayoffYearSelector';
import { navigateTo } from '@/app/utils/navigation';

jest.mock('@/app/utils/navigation', () => ({
  navigateTo: jest.fn(),
}));

describe('PlayoffYearSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates when selecting a valid numeric year fragment', () => {
    render(<PlayoffYearSelector seasons={[20232024, 20222023]} year={2023} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '2024' } }); // from first season 20232024 -> replace regex keeps second half
    expect(navigateTo).toHaveBeenCalledWith('/playoffs/2024');
  });

  it('logs error on invalid year', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<PlayoffYearSelector seasons={[20232024]} year={2023} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'bad' } });
    expect(err).toHaveBeenCalled();
    err.mockRestore();
  });
});
