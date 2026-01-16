import { revalidatePath } from 'next/cache';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * On-demand ISR endpoint
 * Revalidates specific routes when called
 *
 * Usage: POST /api/revalidate?tag=standings&secret=YOUR_SECRET
 */
export async function POST(request: NextRequest) {
  // Verify secret token for security
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    const tag = request.nextUrl.searchParams.get('tag');

    // Revalidate based on tag
    switch (tag) {
      case 'standings':
        revalidatePath('/standings');
        break;
      case 'scores':
        revalidatePath('/scores');
        break;
      case 'news':
        revalidatePath('/');
        revalidatePath('/news');
        break;
      case 'all':
        revalidatePath('/', 'layout');
        break;
      default:
        return NextResponse.json({ message: 'Unknown tag' }, { status: 400 });
    }

    return NextResponse.json(
      { revalidated: true, tag, now: new Date().toISOString() },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: 'Error revalidating', error: String(err) },
      { status: 500 }
    );
  }
}
