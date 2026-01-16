import { getTeamSlugs } from '@/app/utils/teamData';
import { NextResponse, type NextRequest } from 'next/server';

const validTeamKeys = getTeamSlugs();

export default function proxy(request: NextRequest) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const response = NextResponse.next();

  // Add cache headers for static routes (ISR optimization)
  if (
    url.pathname === '/standings' ||
    url.pathname === '/team' ||
    url.pathname === '/playoffs' ||
    url.pathname.startsWith('/playoffs/') ||
    url.pathname === '/draft' ||
    url.pathname.startsWith('/draft/')
  ) {
    // Cache for 1 hour at edge, with stale-while-revalidate for 24 hours
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  }

  // Cache news pages for 30 minutes
  if (url.pathname === '/' || url.pathname.startsWith('/news')) {
    response.headers.set('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');
  }

  // Redirect if team key is prefixed to the URL
  if (pathParts.length > 0 && validTeamKeys.includes(pathParts[0])) {
    const newUrl = `https://nhl.com/${url.pathname}`;

    return NextResponse.redirect(newUrl, 301);
  }

  // Redirect to current year playoffs root
  if (pathParts.length === 1 && pathParts[0] === 'playoffs') {
    const currentYear = new Date().getFullYear();
    const rewrite = request.nextUrl.clone();
    rewrite.pathname = `/playoffs/${currentYear}`;

    return NextResponse.rewrite(rewrite);
  }

  // Redirect to current year draft root
  if (pathParts.length === 1 && pathParts[0] === 'draft') {
    const currentYear = new Date().getFullYear();
    const rewrite = request.nextUrl.clone();
    rewrite.pathname = `/draft/${currentYear}`;

    return NextResponse.rewrite(rewrite);
  }

  return response;
}
