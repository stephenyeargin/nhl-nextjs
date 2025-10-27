// Shared game-related types
import type { LocalizedString } from './content';

export interface PeriodDescriptor {
  number?: number;
  periodType?: string; // e.g., REG, OT, SO
  maxRegulationPeriods?: number;
}

export interface GameClock {
  timeRemaining?: string;
  secondsRemaining?: number;
  running?: boolean;
  inIntermission?: boolean;
}

export interface TeamData {
  teamColor?: string;
  secondaryTeamColor?: string;
}

export interface GameTeam {
  id?: number | string;
  abbrev: string;
  commonName?: LocalizedString;
  placeName?: LocalizedString;
  logo?: string;
  score?: number;
  sog?: number;
  data?: TeamData;
  record?: string;
}

export interface GameSituation {
  homeTeam?: {
    strength?: number;
    abbrev?: string;
    situationDescriptions?: string[];
  };
  awayTeam?: {
    strength?: number;
    abbrev?: string;
    situationDescriptions?: string[];
  };
  timeRemaining?: string;
}

export interface GameGoal {
  timeInPeriod: string;
  teamAbbrev: { default: string };
  strength?: string;
  situationCode?: string;
  highlightReelLink?: string;
}

export interface GameScoringPeriod {
  periodDescriptor: PeriodDescriptor;
  goals: GameGoal[];
}

export interface GameSummary {
  scoring?: Array<{
    periodDescriptor: PeriodDescriptor;
    goals?: GameGoal[];
  }>;
  shootout?: Array<{ sequence?: number }>;
  gameReports?: Record<string, string>;
  teamGameStats?: Array<{
    category: string;
    awayValue: number | string;
    homeValue: number | string;
  }>;
}
export interface Game {
  id?: number | string;
  season?: number;
  gameType?: number;
  gameDate?: string;
  gameState?: string;
  gameScheduleState?: string;
  awayTeam: GameTeam;
  homeTeam: GameTeam;
  clock?: GameClock;
  periodDescriptor?: PeriodDescriptor;
  situation?: GameSituation;
  summary?: GameSummary;
  venue?: { default?: string };
  venueLocation?: { default?: string };
  startTimeUTC?: string | number | Date;
  tvBroadcasts?: { network: string; market: string }[];
  ifNecessary?: boolean;
  matchup?: unknown;
  specialEvent?: { lightLogoUrl?: { default: string }; name?: { default: string } };
  regPeriods?: number;
}

export interface PlayerSeasonStats {
  gamesPlayed?: number;
  goals?: number;
  assists?: number;
  points?: number;
  plusMinus?: number;
  pim?: number;
  gameWinningGoals?: number;
  otGoals?: number;
  shots?: number;
  shootingPctg?: number;
  powerPlayGoals?: number;
  powerPlayPoints?: number;
  shorthandedGoals?: number;
  shorthandedPoints?: number;
  wins?: number;
  losses?: number;
  otLosses?: number;
  savePctg?: number;
  goalsAgainstAvg?: number;
  shutouts?: number;
  [key: string]: number | string | undefined;
}

export interface MatchupPlayer {
  playerId: number | string;
  headshot?: string;
  firstName?: LocalizedString;
  lastName?: LocalizedString;
  sweaterNumber?: number;
  positionCode?: string;
  teamAbbrev?: string;
  stats?: PlayerSeasonStats;
  [key: string]: unknown;
}

export interface TeamTotals {
  record?: string;
  gaa?: number;
  savePctg?: number;
  shutouts?: number;
  [key: string]: number | string | undefined;
}

export interface MatchupTeamData {
  id?: number;
  abbrev: string;
  logo: string;
  commonName?: { default: string };
  placeName?: { default: string };
  data?: TeamData;
  teamTotals?: TeamTotals;
}

export interface SkaterComparison {
  contextLabel?: string;
  leaders?: unknown[];
}

export interface Matchup {
  skaterSeasonStats?: { skaters?: unknown[] };
  goalieSeasonStats?: { goalies?: unknown[] };
  skaterComparison?: SkaterComparison;
  goalieComparison?: {
    awayTeam?: { leaders?: unknown[]; teamTotals?: unknown };
    homeTeam?: { leaders?: unknown[]; teamTotals?: unknown };
  };
}

export interface GamePreviewData {
  matchup: Matchup;
  awayTeam: MatchupTeamData;
  homeTeam: MatchupTeamData;
  [key: string]: unknown;
}

export interface Linescore {
  byPeriod: Array<{
    periodDescriptor: { number: number };
    away: number;
    home: number;
  }>;
  totals: {
    away: number;
    home: number;
  };
}

export interface GameVideo {
  threeMinRecap?: string;
  condensedGame?: string;
  [key: string]: unknown;
}

export interface RightRail {
  linescore?: Linescore;
  shotsByPeriod?: unknown[];
  gameVideo?: GameVideo;
  [key: string]: unknown;
}

export interface GameStory {
  summary?: GameSummary;
  [key: string]: unknown;
}

export interface GameContextData {
  game: Game;
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  rightRail?: RightRail;
  story?: GameStory;
  [key: string]: unknown;
}
