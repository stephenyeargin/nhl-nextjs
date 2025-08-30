// Shared Tag-related types

export interface TagExtraData {
  playerId?: string;
  abbreviation?: string; // team abbreviation
  gameId?: string; // game identifier
  // Future-proof: accept unknown additional metadata keys while discouraging implicit any
  [k: string]: unknown;
}

export interface Tag {
  _entityId?: string | number; // sometimes absent in context uses
  slug?: string;
  title?: string;
  externalSourceName?: 'player' | 'team' | 'game' | string;
  extraData?: TagExtraData;
  // Allow unknown passthrough for upstream fields (e.g., SEO metadata) without losing type safety
  [k: string]: unknown;
}
