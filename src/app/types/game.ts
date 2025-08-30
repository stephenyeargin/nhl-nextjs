// Shared game-related types

export interface PeriodDescriptor {
  number?: number; // some contexts supply number, others only type
  periodType?: string; // e.g., REG, OT, SO
  [key: string]: any;
}
