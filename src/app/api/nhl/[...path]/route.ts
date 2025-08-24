import { NextRequest } from 'next/server';

export const runtime = 'edge';
export const revalidate = 30; // default revalidation window

// Simple proxy to NHL API with basic caching.
export async function GET(_req: NextRequest, { params }: { params: { path: string[] } }) {
  const pathSegs = params.path || [];
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
