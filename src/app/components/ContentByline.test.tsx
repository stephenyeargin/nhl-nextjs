import React from 'react';
import { render, screen } from '@testing-library/react';
import ContentByline from './ContentByline';

jest.mock('../utils/formatters', () => ({
  ...(jest.requireActual('../utils/formatters')),
  formatLocalizedDate: (d: string) => `DATE(${d})`
}));

describe('ContentByline', () => {
  const baseStory = {
    contentDate: '2024-01-01T00:00:00Z',
    fields: {},
    references: {},
  } as any;

  it('renders contributor override when present', () => {
    render(<ContentByline story={{ ...baseStory, fields: { contributorOverride: 'Jane Writer' } }} />);
    expect(screen.getByText(/Jane Writer/)).toBeInTheDocument();
    expect(screen.getByText('DATE(2024-01-01T00:00:00Z)')).toBeInTheDocument();
  });

  it('lists contributors with source and date', () => {
    const story = {
      ...baseStory,
      references: {
        contributor: [
          { _entityId: '1', title: 'Reporter One', fields: { source: 'NHL.com' } },
          { _entityId: '2', title: 'Reporter Two' },
        ]
      }
    };
    render(<ContentByline story={story} />);
    const text = screen.getByText(/Reporter One/).textContent;
    expect(text).toContain('Reporter One, NHL.com');
    expect(screen.getByText(/Reporter Two/)).toBeInTheDocument();
    expect(screen.getByText('DATE(2024-01-01T00:00:00Z)')).toBeInTheDocument();
  });
});
