// Generic fetch helpers to reduce repeated try/catch + status checks.
// Keep intentionally small; throw on unexpected errors to surface in Next.js error boundary.
import type { RequestInit } from 'next/dist/server/web/spec-extension/request';

export interface FetchError extends Error {
  status?: number;
  url?: string;
}

function buildError(message: string, status?: number, url?: string): FetchError {
  const err: FetchError = new Error(message);
  err.status = status;
  err.url = url;
  
  return err;
}

// Fetch JSON and return parsed value. If allow404 is true and response.status === 404, returns null instead of throwing.
export async function safeFetchJSON<T>(url: string, init?: RequestInit & { allow404?: boolean }): Promise<T | null> {
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (e) {
    throw buildError(`Network error while fetching ${url}`, undefined, url);
  }

  if (res.status === 404 && init?.allow404) {
    return null;
  }
  if (!res.ok) {
    throw buildError(`Failed request to ${url}: ${res.status}`, res.status, url);
  }

  try {
    return await res.json() as T;
  } catch {
    throw buildError(`Invalid JSON in response from ${url}`, res.status, url);
  }
}

// Convenience wrapper for APIs where we always disable caching.
export function noStoreInit(extra?: RequestInit): RequestInit {
  return { cache: 'no-store', ...extra };
}
