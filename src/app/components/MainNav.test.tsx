import React from 'react';
import { render, screen } from '@testing-library/react';
import MainNav from './MainNav';

jest.mock('next/navigation', () => ({ usePathname: () => '/' }));

describe('MainNav', () => {
  it('renders navigation links', () => {
    render(<MainNav />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
