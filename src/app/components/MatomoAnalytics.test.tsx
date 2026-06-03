import React from 'react';
import { render } from '@testing-library/react';
import MatomoAnalytics from './MatomoAnalytics';

jest.mock('@socialgouv/matomo-next', () => ({ trackAppRouter: jest.fn(), push: jest.fn() }));
jest.mock('next/navigation', () => ({
  usePathname: () => '/some-path',
  useSearchParams: () => new URLSearchParams('foo=bar'),
}));

describe('MatomoAnalytics (smoke)', () => {
  it('renders null', () => {
    const { container } = render(<MatomoAnalytics url="https://example.com" siteId="1" />);
    expect(container.firstChild).toBeNull();
  });
});
