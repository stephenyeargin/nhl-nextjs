// Central NHL API fetch helper with typed generics and Next.js caching integration.
// Use paths starting with '/' that will be appended to the base NHL API.

// Use globalThis.RequestInit to satisfy ESLint no-undef in type-only position.
export interface FetchOptions extends globalThis.RequestInit {
  revalidate?: number;
  tags?: string[];
  baseUrl?: string; // override for testing
}

const DEFAULT_BASE = 'https://api-web.nhle.com/v1';

export async function nhlFetch<T = unknown>(path: string, options: FetchOptions = {}): Promise<T> {
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  const { revalidate, tags, baseUrl = DEFAULT_BASE, ...init } = options;
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      accept: 'application/json',
      ...(init.headers || {}),
    },
    next: { revalidate, tags },
  });
  if (!res.ok) {
    // Attempt to include upstream error body for debugging (without throwing large blobs)
    let body: string | undefined;
    try {
      body = await res.text();
    } catch {
      /* noop */
    }
    throw new Error(
      `nhlFetch failed ${res.status} ${res.statusText} for ${url}${body ? ' :: ' + body.slice(0, 200) : ''}`
    );
  }

  // Rely on caller to know the shape.
  return res.json() as Promise<T>;
}

export function nhlStatic<T>(path: string, tags: string[] = [], revalidate = 300) {
  return nhlFetch<T>(path, { revalidate, tags });
}
