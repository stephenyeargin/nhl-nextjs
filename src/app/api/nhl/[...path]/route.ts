import { NextRequest } from 'next/server';

export const runtime = 'edge';
export const revalidate = 30; // default revalidation window

// Simple proxy to NHL API with basic caching.
// NOTE: Next.js 15 tightened validation of the second argument's type for Route Handlers.
// Providing a custom inline type for the context object can trigger a build-time error
// ("invalid 'GET' export"). We accept `any` here and narrow inside to stay compatible.
export async function GET(_req: NextRequest, context: any) {
  const pathSegs: string[] = context?.params?.path || [];
  const upstreamUrl = `https://api-web.nhle.com/v1/${pathSegs.join('/')}`;

  const res = await fetch(upstreamUrl, {
    headers: { 'accept': 'application/json' },
    next: { revalidate, tags: ['nhl'] },
  });

  return new Response(res.body, {
    status: res.status,
    headers: {
      'content-type': res.headers.get('content-type') ?? 'application/json',
      'cache-control': 'public, max-age=30, stale-while-revalidate=60',
    },
  });
}
