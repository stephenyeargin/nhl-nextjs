// Draft-related shared types
import type { LocalizedString } from '@/app/types/content';

export type DraftYear = number;

export interface DraftYearSelectProps {
  draftYears: DraftYear[];
  draftYear: DraftYear;
  view?: 'rankings';
}

// Full draft pick shape (superset used on the draft year page)
export interface DraftPick {
  overallPick: number;
  round: number;
  teamLogoLight?: string;
  teamAbbrev: string;
  teamName?: LocalizedString;
  teamPickHistory?: string;
  firstName?: LocalizedString;
  lastName?: LocalizedString;
  positionCode?: string;
  countryCode?: string;
  height?: number; // inches
  weight?: number; // pounds
  amateurClubName?: string;
  amateurLeague?: string;
  [k: string]: unknown;
}

// API payload shape for draft year fetch
export interface DraftData {
  draftYear: number;
  draftYears: number[];
  selectableRounds: number[];
  picks: DraftPick[];
  [k: string]: unknown;
}

// Narrow type for lighter components (e.g., ticker) – derives needed fields
export type DraftPickTicker = Pick<
  DraftPick,
  | 'overallPick'
  | 'round'
  | 'teamLogoLight'
  | 'teamAbbrev'
  | 'firstName'
  | 'lastName'
  | 'positionCode'
>;

// Draft ranking player shape
export interface DraftRankingPlayer {
  midtermRank: number;
  finalRank?: number;
  finalRanking?: number;
  firstName: string;
  lastName: string;
  positionCode: string;
  shootsCatches: string;
  heightInInches: number;
  weightInPounds: number;
  lastAmateurClub: string;
  lastAmateurLeague: string;
  birthDate: string;
  birthCity: string;
  birthStateProvince?: string;
  birthCountry: string;
  [k: string]: unknown;
}

export interface DraftRankingCategory {
  id: number;
  name: string;
  consumerKey: string;
}

// API payload shape for draft rankings fetch
export interface DraftRankingsData {
  draftYear: number;
  categoryId: number;
  categoryKey: string;
  draftYears: number[];
  categories: DraftRankingCategory[];
  rankings: DraftRankingPlayer[];
}
