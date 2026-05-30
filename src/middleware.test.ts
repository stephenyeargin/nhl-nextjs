import proxy from './proxy';
import type { NextRequest } from 'next/server';

// Minimal mock for NextResponse used in proxy
jest.mock('next/server', () => ({
  NextResponse: {
    redirect: (url: string) => ({ type: 'redirect', url }),
    rewrite: (urlObj: { href?: string; toString: () => string }) => ({
      type: 'rewrite',
      url: urlObj.href || urlObj.toString(),
    }),
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
  interface MockRequest {
    url: string;
    nextUrl: URL & { clone: () => URL };
  }

  const makeReq = (path: string) => {
    const url = new URL(`https://example.com${path}`);
    const nextUrl = url as URL & { clone: () => URL };
    nextUrl.clone = () => new URL(url.toString());

    return { url: url.toString(), nextUrl } as MockRequest;
  };

  test('redirects team slug root', () => {
    const res = proxy(makeReq('/bruins') as unknown as NextRequest);
    expect(res).toEqual(expect.objectContaining({ type: 'redirect' }));
  });

  test('rewrites playoffs root', () => {
    const res = proxy(makeReq('/playoffs') as unknown as NextRequest);
    expect(res.type).toBe('rewrite');
    expect(res.url).toContain(`/playoffs/${new Date().getFullYear()}`);
  });

  test('rewrites draft root', () => {
    const res = proxy(makeReq('/draft') as unknown as NextRequest);
    expect(res.type).toBe('rewrite');
    expect(res.url).toContain(`/draft/${new Date().getFullYear()}`);
  });

  test('falls through for other paths', () => {
    const res = proxy(makeReq('/other') as unknown as NextRequest);
    expect(res.type).toBe('next');
  });
});
