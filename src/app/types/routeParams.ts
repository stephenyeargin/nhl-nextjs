// Centralized route params types to replace scattered `any` usage on Next.js App Router pages.
// Keep them minimal and string-based because Next.js will supply strings in params.

export interface YearParam { year: string }
export interface SeriesParam extends YearParam { seriesLetter: string }
export interface TeamSlugParam { slug: string }

// Draft year page (same as YearParam but explicit alias for clarity)
export type DraftYearParam = YearParam;

// Utility generic for a Page component's prop shape when we only care about params.
// Next.js may treat the page's param prop as either an object or a promise (internal typing).
// We keep it broad but sufficient for our usage.
// Utility generic for a Page component's param shape (avoid naming collision with Next.js internal PageProps constraint)
export type RouteParamsWrapper<P> = { params: P | Promise<P> };
