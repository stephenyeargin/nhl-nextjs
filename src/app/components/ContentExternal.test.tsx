import React from 'react';
import { render } from '@testing-library/react';
import ContentExternal from './ContentExternal';

describe('ContentExternal', () => {
  it('renders provided html', () => {
    const { container } = render(
      <ContentExternal part={{ _entityId: '1', content: { html: '<p>Hi</p>' } }} />
    );
    expect(container.querySelector('.content-external')?.innerHTML).toContain('Hi');
  });
});
