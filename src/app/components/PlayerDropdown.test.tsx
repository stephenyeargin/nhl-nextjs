import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import PlayerDropdown from './PlayerDropdown';
import { navigateTo } from '@/app/utils/navigation';

jest.mock('@/app/utils/navigation', () => ({
  navigateTo: jest.fn(),
}));

describe('PlayerDropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates on change', () => {
    render(
      <PlayerDropdown
        players={[{ playerId: '1', firstName: { default: 'A' }, lastName: { default: 'B' } }]}
        activePlayer={'1'}
      />
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
    expect(navigateTo).toHaveBeenCalledWith('/player/1');
  });
});
