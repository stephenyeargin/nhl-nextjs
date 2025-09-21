import React from 'react';
import { render, screen } from '@testing-library/react';
import StatBox from '@/app/components/StatBox';

const headers = [
  { key: 'plusMinus', label: '+/-', title: 'Plus/Minus' },
  { key: 'goals', label: 'G', title: 'Goals' },
] as const;

describe('StatBox', () => {
  it('renders + sign for positive plusMinus', () => {
    render(<StatBox statKey="plusMinus" value={3} statHeaders={headers} />);
    expect(screen.getByText('+3')).toBeInTheDocument();
  });

  it('renders negative value for minus plusMinus', () => {
    render(<StatBox statKey="plusMinus" value={-2} statHeaders={headers} />);
    expect(screen.getByText('-2')).toBeInTheDocument();
  });

  it('renders -- for undefined plusMinus', () => {
    render(<StatBox statKey="plusMinus" value={undefined} statHeaders={headers} />);
    expect(screen.getByText('--')).toBeInTheDocument();
  });

  it('renders plain number for regular stat', () => {
    render(<StatBox statKey="goals" value={10} statHeaders={headers} />);
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('matches snapshot (plusMinus positive)', () => {
    const { container } = render(<StatBox statKey="plusMinus" value={4} statHeaders={headers} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
