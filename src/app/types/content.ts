// Shared content-related TypeScript interfaces used by news/story pages.
// Keep shapes intentionally partial (only the fields we actually access) to avoid tight coupling to upstream API.

export interface LocalizedString {
  default?: string;
  [locale: string]: string | undefined;
}

export interface ThumbnailTemplate {
  templateUrl: string; // e.g. contains {formatInstructions}
  thumbnailUrl?: string; // pre-rendered smaller version
}

export interface StoryItem {
  _entityId?: string | number;
  slug: string;
  headline?: string;
  title?: string;
  contentDate?: string; // ISO date string
  summary?: string;
  thumbnail?: ThumbnailTemplate;
  [key: string]: any; // allow additional API props without forcing casts everywhere
}

export interface PaginatedContentResponse<T> {
  items: T[];
  pagination?: {
    nextUrl?: string | null;
    [key: string]: any;
  };
  [key: string]: any;
}
