// Shared video-related types

export interface VideoThumbnail {
  templateUrl: string;
  thumbnailUrl?: string; // sometimes not provided; we can derive from template
  [k: string]: unknown;
}

export interface VideoFields {
  brightcoveAccountId?: string;
  brightcoveId?: string;
  longDescription?: string;
  title?: string;
  description?: string;
  [k: string]: unknown;
}

// Base shape used by most video listings/cards
export interface VideoItemBase {
  slug: string;
  headline?: string;
  title?: string;
  summary?: string;
  contentDate?: string;
  thumbnail?: VideoThumbnail;
  fields: Partial<VideoFields>;
  [k: string]: unknown;
}

// Full detail item returned by single video endpoint (fields usually populated)
export interface VideoDetailItem extends VideoItemBase {
  status?: number;
  fields: VideoFields;
}

export interface VideoApiResponse<T extends VideoItemBase = VideoItemBase> {
  items: T[];
  pagination?: { nextUrl?: string | null; [k: string]: unknown };
  [k: string]: unknown;
}
