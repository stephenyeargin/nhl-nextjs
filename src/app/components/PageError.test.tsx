import React from 'react';
import { render, screen } from '@testing-library/react';
import PageError from './PageError';

describe('PageError', () => {
  it('renders provided error message via pageError prop', () => {
    render(<PageError pageError={{ message: 'Something broke' }} />);
    expect(screen.getByText(/something broke/i)).toBeInTheDocument();
  });
});
