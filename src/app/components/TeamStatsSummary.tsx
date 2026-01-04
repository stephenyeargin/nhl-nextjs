import React from 'react';
import { formatStat } from '@/app/utils/formatters';

// Lightweight duplicate of needed fields (avoid broad import cycles)
export interface TeamStandingLite {
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
}

interface StatItem {
  key: string;
  label: string;
  value: React.ReactNode;
}

interface Props {
  standing: TeamStandingLite;
  className?: string;
}

// Helper to show a dash when value is nullish or empty string
const show = (v: any) => (v === 0 ? 0 : v ? v : '-');

export default function TeamStatsSummary({ standing }: Props) {
  if (!standing) {
    return null;
  }

  const stats: StatItem[] = [
    { key: 'gp', label: 'Games Played', value: show(standing.gamesPlayed) },
    {
      key: 'record',
      label: 'Overall Record',
      value: show(`${standing.wins}-${standing.losses}-${standing.otLosses}`),
    },
    { key: 'pts', label: 'Points', value: show(standing.points) },
    {
      key: 'ptpct',
      label: 'Points %',
      value:
        standing.pointPctg !== null && standing.pointPctg !== undefined
          ? formatStat(standing.pointPctg, 3)
          : '-',
    },
    { key: 'rw', label: 'Regulation Wins', value: show(standing.regulationWins) },
    { key: 'rotw', label: 'R+OT Wins', value: show(standing.regulationPlusOtWins) },
    { key: 'gf', label: 'Goals For', value: show(standing.goalFor) },
    { key: 'ga', label: 'Goals Against', value: show(standing.goalAgainst) },
    {
      key: 'gd',
      label: 'Goal Differential',
      value:
        standing.goalDifferential !== null &&
        standing.goalDifferential !== undefined &&
        standing.goalDifferential > 0
          ? `+${standing.goalDifferential}`
          : show(standing.goalDifferential),
    },
    {
      key: 'home',
      label: 'Home Record',
      value: show(`${standing.homeWins}-${standing.homeLosses}-${standing.homeOtLosses}`),
    },
    {
      key: 'road',
      label: 'Road Record',
      value: show(`${standing.roadWins}-${standing.roadLosses}-${standing.roadOtLosses}`),
    },
    {
      key: 'so',
      label: 'Shootout Record',
      value: show(`${standing.shootoutWins}-${standing.shootoutLosses}`),
    },
    {
      key: 'l10',
      label: 'Last 10 Record',
      value: show(`${standing.l10Wins}-${standing.l10Losses}-${standing.l10OtLosses}`),
    },
    {
      key: 'streak',
      label: 'Streak',
      value: show(`${standing.streakCode || ''}${standing.streakCount || ''}`.trim()),
    },
  ];

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {stats.map((s) => (
        <li
          key={s.key}
          className="group relative rounded-lg border bg-white/5 dark:bg-black/30 backdrop-blur-xs p-3 flex flex-col text-center shadow-xs hover:shadow-sm transition-shadow"
        >
          <div className="text-xl font-semibold mb-1 tabular-nums">{s.value}</div>
          <div className="text-[0.65rem] tracking-wide uppercase font-medium opacity-80">
            {s.label}
          </div>
          <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10 pointer-events-none" />
        </li>
      ))}
    </ul>
  );
}
