import { getTeamSlugs } from '@/app/utils/teamData';
import { NextResponse, type NextRequest } from 'next/server';

const validTeamKeys = getTeamSlugs();

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);

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

  return NextResponse.next();
}
