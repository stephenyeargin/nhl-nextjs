// Player-related types for player landing page and roster data
import type { LocalizedString } from './content';

export interface DraftDetails {
  round?: number;
  pickInRound?: number;
  overallPick?: number;
  year?: number;
  teamAbbrev?: string;
}

// Stats container; dynamic keys for various stat metrics (numbers) while preserving known fields
export interface PlayerSeasonTotals {
  season: string | number;
  leagueAbbrev: string;
  gameTypeId: number; // 2 regular, 3 playoffs
  teamName?: LocalizedString;
  // Dynamically keyed stat metrics (goalie or skater); values numeric or undefined
  [stat: string]: string | number | LocalizedString | undefined;
}

export interface PlayerGameSummary {
  gameId: string | number;
  gameDate: string;
  homeRoadFlag: 'H' | 'A';
  teamAbbrev: string;
  opponentAbbrev: string;
  [k: string]: unknown;
}

export interface PlayerBadge {
  logoUrl: LocalizedString;
  title: LocalizedString;
}

export interface PlayerFeaturedStatsSubSeason {
  [stat: string]: number | undefined;
}

export interface PlayerFeaturedStats {
  season?: string | number;
  regularSeason?: { subSeason?: PlayerFeaturedStatsSubSeason };
  playoffs?: { subSeason?: PlayerFeaturedStatsSubSeason };
  [k: string]: unknown;
}

export interface PlayerCareerTotals {
  regularSeason?: Record<string, number>;
  playoffs?: Record<string, number>;
}

export interface PlayerAwardSeason {
  seasonId: string | number;
  [k: string]: unknown;
}

export interface PlayerAward {
  trophy: LocalizedString;
  seasons: PlayerAwardSeason[];
  [k: string]: unknown;
}

export interface PlayerPhoto {
  _entityId?: string;
  image?: {
    templateUrl?: string;
  };
  fields?: {
    altText?: string;
    credit?: string;
  };
  contentDate?: string;
  [k: string]: unknown;
}

export interface PlayerEntityContent {
  _entityId: string | number;
  fields?: {
    biography?: unknown;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

export interface RosterPlayer {
  id?: number | string; // API may include id
  playerId: number | string; // Required by PlayerOption interface
  firstName: LocalizedString;
  lastName: LocalizedString;
  sweaterNumber?: number | string;
  positionCode?: string;
  headshot?: string;
  [k: string]: unknown;
}

export interface PlayerLandingResponse {
  playerId: number | string;
  firstName: LocalizedString;
  lastName: LocalizedString;
  heightInInches: number;
  weightInPounds: number;
  birthDate: string;
  birthCity: LocalizedString;
  birthStateProvince?: LocalizedString;
  birthCountry?: string;
  badges: PlayerBadge[];
  shootsCatches?: string;
  draftDetails?: DraftDetails;
  sweaterNumber?: number | string;
  currentTeamAbbrev: string;
  position: string;
  headshot?: string;
  teamLogo?: string;
  heroImage?: string;
  seasonTotals: PlayerSeasonTotals[];
  last5Games?: PlayerGameSummary[];
  featuredStats?: PlayerFeaturedStats;
  careerTotals?: PlayerCareerTotals;
  awards?: PlayerAward[];
  isActive?: boolean;
  currentTeamRoster?: RosterPlayer[];
  [k: string]: unknown;
}

// Stat header configuration
export interface StatHeader {
  key: string;
  label: string;
  title: string;
  altKey?: string;
  precision?: number;
  unit?: string;
}
