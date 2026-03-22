'use client';

import React from 'react';
import StandingsTable from '@/app/components/StandingsTable';
import type { StandingsEntry, StandingsView } from '@/app/components/StandingsTable';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface StandingsSwitcherProps {
  western: StandingsEntry[];
  eastern: StandingsEntry[];
  standingsDate?: string;
  hideTables?: boolean;
}

const viewOptions: { key: StandingsView; label: string }[] = [
  { key: 'wildcard', label: 'Wildcard' },
  { key: 'division', label: 'By Division' },
  { key: 'conference', label: 'By Conference' },
  { key: 'league', label: 'League' },
];

const MANUAL_DATE_CHANGE_DELAY_MS = 600;

const getTodayDateString = () => {
  const now = new Date();
  const timezoneOffsetInMs = now.getTimezoneOffset() * 60_000;

  return new Date(now.getTime() - timezoneOffsetInMs).toISOString().split('T')[0];
};

const StandingsSwitcher: React.FC<StandingsSwitcherProps> = ({
  western,
  eastern,
  standingsDate,
  hideTables = false,
}) => {
  const [view, setView] = React.useState<StandingsView>('wildcard');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const leagueRows = React.useMemo(() => [...western, ...eastern], [western, eastern]);
  const todayDate = React.useMemo(getTodayDateString, []);
  const selectedDate = React.useMemo(
    () => (!standingsDate || standingsDate === 'now' ? todayDate : standingsDate),
    [standingsDate, todayDate]
  );
  const [dateInputValue, setDateInputValue] = React.useState(selectedDate);
  const lastValidDateRef = React.useRef(selectedDate);
  const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isManualEditRef = React.useRef(false);

  React.useEffect(() => {
    setDateInputValue(selectedDate);
    lastValidDateRef.current = selectedDate;
  }, [selectedDate]);

  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const updateStandingsDate = React.useCallback(
    (rawDate: string) => {
      if (!rawDate) {
        return;
      }

      const nextDate = rawDate > todayDate ? todayDate : rawDate;
      const nextParams = new URLSearchParams(searchParams.toString());

      if (nextDate === todayDate) {
        nextParams.delete('date');
      } else {
        nextParams.set('date', nextDate);
      }

      const query = nextParams.toString();
      const href = query ? `${pathname}?${query}` : pathname;
      router.replace(href, { scroll: false });
    },
    [pathname, router, searchParams, todayDate]
  );

  const handleOnChangeDate = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const rawDate = event.target.value;
      if (!rawDate) {
        setDateInputValue(lastValidDateRef.current);
        isManualEditRef.current = false;

        return;
      }

      setDateInputValue(rawDate);
      lastValidDateRef.current = rawDate;

      if (isManualEditRef.current) {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
          updateStandingsDate(rawDate);
          isManualEditRef.current = false;
        }, MANUAL_DATE_CHANGE_DELAY_MS);

        return;
      }

      updateStandingsDate(rawDate);
    },
    [updateStandingsDate]
  );

  const handleDateKeyDown = React.useCallback(() => {
    isManualEditRef.current = true;
  }, []);

  const handleDateBlur = React.useCallback(() => {
    if (!isManualEditRef.current || !dateInputValue) {
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    updateStandingsDate(dateInputValue);
    isManualEditRef.current = false;
  }, [dateInputValue, updateStandingsDate]);

  const handleDatePickerOpen = React.useCallback(() => {
    isManualEditRef.current = false;
  }, []);

  return (
    <div className="flex flex-col gap-4 text-sm align-middle">
      <div className="flex flex-wrap" role="tablist" aria-label="Standings view">
        {viewOptions.map(({ key, label }) => {
          let buttonClasses =
            'cursor-pointer flex gap-1 items-center p-2 bg-inherit text-black dark:text-white border-t border-b';
          if (key === 'wildcard') {
            buttonClasses += ' border-l rounded-l-md';
          } else if (key === 'league') {
            buttonClasses += ' border-l border-r rounded-r-md';
          } else {
            buttonClasses += ' border-l';
          }

          if (view === key) {
            buttonClasses += ' bg-slate-200 dark:bg-slate-800';
          }

          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={view === key}
              className={` ${buttonClasses}`}
              onClick={() => setView(key)}
            >
              {label}
            </button>
          );
        })}
        <div className="border rounded-md sm:mt-5 md:mt-0 md:ml-auto px-3 py-2 bg-slate-100 dark:bg-slate-900 shadow-sm">
          <label htmlFor="standings-date" className="flex items-center gap-2 text-sm">
            <span className="font-bold whitespace-nowrap">As of</span>
            <input
              id="standings-date"
              type="date"
              value={dateInputValue}
              max={todayDate}
              className="h-9 min-w-[9.5rem] rounded border border-slate-400 dark:border-slate-600 px-2 py-1 bg-white text-black [color-scheme:light] focus:outline-none focus:ring-2 focus:ring-slate-500"
              onChange={handleOnChangeDate}
              onKeyDown={handleDateKeyDown}
              onBlur={handleDateBlur}
              onFocus={handleDatePickerOpen}
            />
          </label>
        </div>
      </div>

      {!hideTables && (
        <div className="flex flex-col gap-6">
          {view === 'league' ? (
            <section>
              <h2 className="text-xl py-2">League</h2>
              <StandingsTable standings={leagueRows} view="league" />
            </section>
          ) : (
            <>
              <section>
                <h2 className="text-xl py-2">Western Conference</h2>
                <StandingsTable standings={western} view={view} />
              </section>
              <section>
                <h2 className="text-xl py-2">Eastern Conference</h2>
                <StandingsTable standings={eastern} view={view} />
              </section>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StandingsSwitcher;
