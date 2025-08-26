import { middleware } from './middleware';

// Minimal mock for NextResponse used in middleware
jest.mock('next/server', () => ({
  NextResponse: {
    redirect: (url: string) => ({ type: 'redirect', url }),
    rewrite: (urlObj: any) => ({ type: 'rewrite', url: urlObj.href || urlObj.toString() }),
    next: () => ({ type: 'next' }),
  },
}));

jest.mock('./app/utils/teamData', () => ({
  getTeamSlugs: () => ['bruins', 'rangers'],
}));

describe('middleware', () => {
  const makeReq = (path: string) => {
    const url = new URL(`https://example.com${path}`);
    const nextUrl: any = url;
    nextUrl.clone = () => new URL(url.toString());

    return { url: url.toString(), nextUrl } as any;
  };

  test('redirects team slug root', () => {
    const res = middleware(makeReq('/bruins'));
    expect(res).toEqual(expect.objectContaining({ type: 'redirect' }));
  });

  test('rewrites playoffs root', () => {
    const res = middleware(makeReq('/playoffs'));
    expect(res.type).toBe('rewrite');
    expect(res.url).toContain(`/playoffs/${new Date().getFullYear()}`);
  });

  test('rewrites draft root', () => {
    const res = middleware(makeReq('/draft'));
    expect(res.type).toBe('rewrite');
    expect(res.url).toContain(`/draft/${new Date().getFullYear()}`);
  });

  test('falls through for other paths', () => {
    const res = middleware(makeReq('/other'));
    expect(res.type).toBe('next');
  });
});
