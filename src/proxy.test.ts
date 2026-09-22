import proxy from './proxy';
import type { NextRequest } from 'next/server';

// Minimal mock for NextResponse used in proxy
jest.mock('next/server', () => ({
  NextResponse: {
    redirect: (url: string) => ({ type: 'redirect', url }),
    next: () => ({
      type: 'next',
      headers: {
        set: jest.fn(),
      },
    }),
  },
}));

jest.mock('./app/utils/teamData', () => ({
  getTeamSlugs: () => ['bruins', 'rangers'],
}));

describe('proxy', () => {
  const makeReq = (path: string) => ({ url: `https://example.com${path}` });

  test('redirects team slug root', () => {
    const res = proxy(makeReq('/bruins') as unknown as NextRequest);
    expect(res).toEqual(expect.objectContaining({ type: 'redirect' }));
  });

  // The year roots are handled by real routes, not a proxy rewrite: rewriting them
  // produced an absolute URL that `next start` behind a TLS-terminating proxy treated
  // as external and tried to re-fetch over TLS.
  test.each(['/playoffs', '/draft'])('passes %s through with cache headers', (path) => {
    const res = proxy(makeReq(path) as unknown as NextRequest);
    expect(res.type).toBe('next');
    expect(res.headers.set).toHaveBeenCalledWith(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400'
    );
  });

  test('falls through for other paths', () => {
    const res = proxy(makeReq('/other') as unknown as NextRequest);
    expect(res.type).toBe('next');
  });
});
