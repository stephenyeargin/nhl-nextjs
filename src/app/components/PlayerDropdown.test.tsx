import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import PlayerDropdown from './PlayerDropdown';

describe('PlayerDropdown', () => {
  it('navigates on change', () => {
    delete (window as any).location;
    (window as any).location = { href: '' };
    render(
      <PlayerDropdown
        players={[{ playerId: '1', firstName: { default: 'A' }, lastName: { default: 'B' } }]}
        activePlayer={'1'}
      />
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
    expect(window.location.href).toContain('/player/1');
  });
});
