// Shared team-related TypeScript interfaces consolidated from multiple components.
// Keep these shapes deliberately partial (focused on fields actually consumed by the UI)
// to avoid over-coupling to upstream APIs.

// Basic team identity (used widely for lookups, menus, schedule headers)
export interface TeamIdentity {
  abbreviation: string; // e.g., 'NSH'
  name?: string; // Full name e.g., 'Nashville Predators'
  slug?: string; // Local routing slug (if available)
}

// Color metadata used for theming / charts
export interface TeamColors {
  teamColor: string;
  secondaryTeamColor: string;
}

// Canonical entry from static teamData utility
export interface TeamDataEntry extends TeamIdentity, TeamColors {
  hashtag?: string;
  teamId: number;
  division?: string;
  // Allow passthrough of extra fields coming from future enrichments without widening everywhere.
  // Prefer adding explicit fields over relying on this when possible.
  [k: string]: unknown;
}

// Lightweight shape for scoreboard / tile contexts where only abbrev + optional logo are needed
export interface TeamAbbrevLogo {
  abbrev: string;
  logo?: string;
}

// Extended in live game contexts (score may be missing before game start)
export interface TeamSide extends TeamAbbrevLogo {
  id?: string | number;
  score?: number;
  record?: string; // e.g. 10-3-1
  sog?: number; // shots on goal (live)
  radioLink?: string; // radio broadcast link
  defeated?: boolean; // derived client-side
  // Localized naming variants; API sometimes returns multiple objects
  placeNameWithPreposition?: { default: string };
  placeName?: { default: string };
  commonName?: { default: string };
  name?: { default: string };
  // Passthrough for rarely used properties that some components probe dynamically
  data?: {
    teamColor?: string;
    secondaryTeamColor?: string;
    abbreviation?: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

// Schedule context minimal shape
export interface ScheduleTeam {
  abbrev: string;
  score: number;
  placeName: { default: string };
}

export interface PlayerName {
  sweaterNumber?: number;
  firstName: { default: string };
  lastName: { default: string };
}
