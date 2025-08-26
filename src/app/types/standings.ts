// Standings-related shared lightweight interfaces
// Keep flexible (index signatures) to avoid over-coupling with upstream API.

export interface StandingRow {
  teamAbbrev: { default: string; [locale: string]: string | undefined } | string; // API sometimes nests localized abbrev
  conferenceSequence?: number;
  conferenceName?: string;
  divisionSequence?: number;
  divisionName?: string;
  gamesPlayed?: number;
  wins?: number;
  losses?: number;
  otLosses?: number;
  points?: number;
  pointPctg?: number;
  regulationWins?: number;
  regulationPlusOtWins?: number;
  goalFor?: number;
  goalAgainst?: number;
  goalDifferential?: number;
  homeWins?: number;
  homeLosses?: number;
  homeOtLosses?: number;
  roadWins?: number;
  roadLosses?: number;
  roadOtLosses?: number;
  shootoutWins?: number;
  shootoutLosses?: number;
  l10Wins?: number;
  l10Losses?: number;
  l10OtLosses?: number;
  streakCode?: string;
  streakCount?: number;
  [key: string]: any;
}
