import React from 'react';
import { render, screen } from '@testing-library/react';
import TeamsMenu from './TeamsMenu';

jest.mock('next/navigation', () => ({ usePathname: () => '/' }));

describe('TeamsMenu', () => {
  it('renders a team abbreviation', () => {
    render(<TeamsMenu onMouseLeave={() => {}} />);
    expect(screen.getByText(/ANA/)).toBeInTheDocument();
  });
});
