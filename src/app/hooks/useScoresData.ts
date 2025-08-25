import { useEffect, useState, useCallback } from 'react';

interface GameWeekDay { date: string; dayAbbrev: string; numberOfGames: number }
interface ScoreGame { id: string | number; [k:string]: any }
export interface ScoresResponse {
  gameWeek: GameWeekDay[];
  games: ScoreGame[];
  prevDate: string; currentDate: string; nextDate?: string;
  [k:string]: any;
}

export interface UseScoresDataResult {
  scores: ScoresResponse | null;
  today: string | Date | null;
  setToday: (_value: string | Date) => void; // underscore to satisfy no-unused-vars in type
  handleDateChange: (_date: string) => void; // underscore to satisfy no-unused-vars in type
}

export const useScoresData = (): UseScoresDataResult => {
  const [scores, setScores] = useState<ScoresResponse | null>(null);
  const [today, setToday] = useState<string | Date | null>(null);

  const setTodayNoonET = useCallback(() => {
    const now = new Date();
    const easternTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    easternTime.setHours(12, 0, 0, 0);
    
  return easternTime.toISOString().split('T')[0];
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    const getScores = async () => {
      const todayString = typeof today === 'string' ? today : today?.toISOString().slice(0, 10);
  if (!todayString) { return; }
      try {
        const scoresResponse = await fetch(`/api/nhl/score/${todayString}`, { cache: 'no-store' });
        setScores(await scoresResponse.json());
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch scores:', e);
      }
    };

    if (!today) {
      setToday(setTodayNoonET());
    } else {
      getScores();
      interval = setInterval(getScores, 30000);
    }

    return () => {
  if (interval) { clearInterval(interval); }
    };
  }, [today, setTodayNoonET]);

  const handleDateChange = (date: string) => {
    setToday(new Date(date));
  };

  return { scores, today, setToday: (v) => setToday(v), handleDateChange };
};

export default useScoresData;
