'use client';

import React from 'react';
import StandingsTable from '@/app/components/StandingsTable';
import type { StandingsEntry, StandingsView } from '@/app/components/StandingsTable';

interface StandingsSwitcherProps {
  western: StandingsEntry[];
  eastern: StandingsEntry[];
  standingsDate?: string;
}

const viewOptions: { key: StandingsView; label: string }[] = [
  { key: 'wildcard', label: 'Wildcard' },
  { key: 'division', label: 'By Division' },
  { key: 'conference', label: 'By Conference' },
  { key: 'league', label: 'League' },
];

const getTodayDateString = () => {
  const now = new Date();
  const timezoneOffsetInMs = now.getTimezoneOffset() * 60_000;

  return new Date(now.getTime() - timezoneOffsetInMs).toISOString().split('T')[0];
};

const handleOnChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
  const selectedDate = event.target.value;
  const todayDate = getTodayDateString();
  const nextDate = selectedDate > todayDate ? todayDate : selectedDate;
  const params = new URLSearchParams(window.location.search);
  params.set('date', nextDate);
  window.location.search = params.toString();
};

const StandingsSwitcher: React.FC<StandingsSwitcherProps> = ({
  western,
  eastern,
  standingsDate,
}) => {
  const [view, setView] = React.useState<StandingsView>('wildcard');
  const leagueRows = React.useMemo(() => [...western, ...eastern], [western, eastern]);
  const todayDate = React.useMemo(getTodayDateString, []);

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
        <div className="border rounded-md sm:mt-5 md:mt-0 md:ml-auto p-3">
          <label>
            <span className="font-bold">As of</span>
            <input
              type="date"
              value={
                !standingsDate || standingsDate === 'now' ? getTodayDateString() : standingsDate
              }
              max={todayDate}
              className="ml-3"
              onChange={handleOnChangeDate}
            />
          </label>
        </div>
      </div>

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
    </div>
  );
};

export default StandingsSwitcher;
