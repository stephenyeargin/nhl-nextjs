import { nhlStatic } from '@/lib/fetcher';

export type TopBarMode = 'draft' | 'schedule';

interface ScoreboardGame {
  id: string | number;
}

interface ScoreboardByDate {
  date: string;
  games: ScoreboardGame[];
}

interface ScoreboardNowResponse {
  gamesByDate: ScoreboardByDate[];
}

const LOOKAHEAD_DAYS = 21;

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);

  return next;
}

function hasGamesInWindow(response: ScoreboardNowResponse, start: string, end: string): boolean {
  return response.gamesByDate.some((day) => {
    if (!day.games?.length) {
      return false;
    }

    return day.date >= start && day.date <= end;
  });
}

export async function getTopBarMode(now: Date = new Date()): Promise<TopBarMode> {
  const startDate = toDateKey(now);
  const endDate = toDateKey(addDays(now, LOOKAHEAD_DAYS));
  const scoreboard = await nhlStatic<ScoreboardNowResponse>('/scoreboard/now', ['nhl']);

  if (hasGamesInWindow(scoreboard, startDate, endDate)) {
    return 'schedule';
  }

  return 'draft';
}
