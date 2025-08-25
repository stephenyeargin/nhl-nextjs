import React from 'react';
import { render, screen } from '@testing-library/react';
import ContentMarkdown from './ContentMarkdown';

jest.mock('../utils/formatters', () => ({
  formatMarkdownContent: (c: string) => `<p class='mb-4'>${c}</p>`
}));

describe('ContentMarkdown', () => {
  test('renders markdown content as html', () => {
    render(<ContentMarkdown part={{ _entityId: 'x', content: 'Hello *World*' }} />);
    expect(screen.getByText('Hello *World*')).toBeTruthy();
  });
});
