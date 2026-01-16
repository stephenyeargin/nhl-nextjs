import proxy from './proxy';

// Minimal mock for NextResponse used in proxy
jest.mock('next/server', () => ({
  NextResponse: {
    redirect: (url: string) => ({ type: 'redirect', url }),
    rewrite: (urlObj: any) => ({ type: 'rewrite', url: urlObj.href || urlObj.toString() }),
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
  const makeReq = (path: string) => {
    const url = new URL(`https://example.com${path}`);
    const nextUrl: any = url;
    nextUrl.clone = () => new URL(url.toString());

    return { url: url.toString(), nextUrl } as any;
  };

  test('redirects team slug root', () => {
    const res = proxy(makeReq('/bruins'));
    expect(res).toEqual(expect.objectContaining({ type: 'redirect' }));
  });

  test('rewrites playoffs root', () => {
    const res = proxy(makeReq('/playoffs'));
    expect(res.type).toBe('rewrite');
    expect(res.url).toContain(`/playoffs/${new Date().getFullYear()}`);
  });

  test('rewrites draft root', () => {
    const res = proxy(makeReq('/draft'));
    expect(res.type).toBe('rewrite');
    expect(res.url).toContain(`/draft/${new Date().getFullYear()}`);
  });

  test('falls through for other paths', () => {
    const res = proxy(makeReq('/other'));
    expect(res.type).toBe('next');
  });
});
