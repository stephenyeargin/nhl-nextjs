import { getTeamSlugs } from './app/utils/teamData.js';
import { NextResponse } from 'next/server';

const validTeamKeys = getTeamSlugs();

export function middleware(request) {
  const url = new URL(request.url);
  
  // Split the pathname into segments
  const pathParts = url.pathname.split('/').filter(Boolean);

  // Redirect if team key is prefixed to the URL
  if (pathParts.length > 0 && validTeamKeys.includes(pathParts[0])) {
    // Build the new external URL
    const newUrl = `https://nhl.com/${url.pathname}`;
    
    // Perform the redirect
    return NextResponse.redirect(newUrl, 301); // Permanent redirect (301)
  }

  // If not a valid key, continue to the next handler
  return NextResponse.next();
}
