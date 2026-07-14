'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import TeamLogo from './TeamLogo';
import Link from 'next/link';
import type { DraftPickTicker } from '@/app/types/draft';
import { countryCodeToFlag } from '../utils/formatters';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DraftTickerSkeleton from './DraftTickerSkeleton';

interface ApiResponse {
  selectableRounds?: number[];
  picks: DraftPickTicker[];
}

const POLL_INTERVAL_MS = 60_000;

const DraftTicker: React.FC = () => {
  const [allPicks, setAllPicks] = useState<DraftPickTicker[]>([]);
  const [draftYear, setDraftYear] = useState<number | null>(null);
  const [rounds, setRounds] = useState<number[]>([]);
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const onTheClockRef = useRef<HTMLDivElement>(null);

  const fetchPicks = useCallback(async (year: number) => {
    try {
      const res = await fetch(`/api/nhl/draft/picks/${year}/all`);
      const data: ApiResponse = await res.json();
      setRounds(data.selectableRounds ?? [1]);
      setAllPicks(data.picks);

      return data.picks;
    } catch {
      setRounds([1]);
      setAllPicks([]);

      return [];
    }
  }, []);

  // Initial load: fetch and set the active round
  useEffect(() => {
    const year = new Date().getFullYear();
    setDraftYear(year);
    fetchPicks(year).then((picks) => {
      const onTheClock = picks.find(
        (p) =>
          !p.firstName?.default &&
          p.lastName?.default !== 'Void' &&
          p.lastName?.default !== 'Forfeited'
      );
      setSelectedRound(onTheClock?.round ?? picks[0]?.round ?? 1);
    });
  }, [fetchPicks]);

  // Poll every minute while draft is active (on-the-clock pick exists)
  const onTheClockPick = allPicks.find(
    (p) =>
      !p.firstName?.default && p.lastName?.default !== 'Void' && p.lastName?.default !== 'Forfeited'
  );

  useEffect(() => {
    if (!draftYear || !onTheClockPick) {
      return;
    }
    const interval = setInterval(() => fetchPicks(draftYear), POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [draftYear, onTheClockPick, fetchPicks]);

  const picks = allPicks.filter((p) => p.round === (selectedRound ?? 1));

  useEffect(() => {
    if (onTheClockRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = onTheClockRef.current;
      const offset = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
      container.scrollTo({ left: offset, behavior: 'smooth' });
    }
  }, [picks]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  const onTheClockIdx = onTheClockPick ? allPicks.indexOf(onTheClockPick) : -1;
  const lastDraftedPick =
    onTheClockIdx > 0
      ? allPicks
          .slice(0, onTheClockIdx)
          .reverse()
          .find((p) => !!p.firstName?.default)
      : allPicks.filter((p) => !!p.firstName?.default).at(-1);

  if (!allPicks.length) {
    return <DraftTickerSkeleton />;
  }

  return (
    <div className="px-2 my-3">
      <div className="flex items-center gap-2">
        <div className="font-bold text-base px-2 whitespace-nowrap shrink-0">
          <div>
            <Link href="/draft">{draftYear} NHL Draft</Link>
          </div>
          <div className="mt-1">
            <select
              className="w-full p-1 rounded-sm border bg-inherit text-xs"
              value={selectedRound ?? 1}
              onChange={(e) => setSelectedRound(Number(e.target.value))}
            >
              {rounds.map((r) => (
                <option key={r} value={r}>
                  Round {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          aria-label="Scroll left"
          className="shrink-0 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          onClick={() => scroll('left')}
        >
          ‹
        </button>

        <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hidden">
          {picks.map((pick) => {
            const isVoided = pick.lastName?.default === 'Void' && !pick.firstName;
            const isForfeited = pick.lastName?.default === 'Forfeited' && !pick.firstName;
            const isDrafted = !!pick.firstName?.default;
            const isOnTheClock = pick.overallPick === onTheClockPick?.overallPick;
            const isLastDrafted = pick.overallPick === lastDraftedPick?.overallPick;

            let cardClass =
              'flex flex-col justify-center items-center gap-1 px-3 py-2 border rounded-lg shadow-xs min-w-[160px] max-w-xs overflow-hidden shrink-0';

            if (isLastDrafted) {
              cardClass += ' ring-2 ring-amber-400';
            } else if (isVoided || isForfeited) {
              cardClass += ' opacity-50';
            }

            return (
              <div
                key={pick.overallPick}
                ref={isOnTheClock ? onTheClockRef : undefined}
                className={cardClass}
              >
                <div className="flex items-center gap-2 w-full justify-center">
                  <span className="text-sm font-extrabold text-blue-800 dark:text-blue-200 shrink-0">
                    {pick.overallPick}
                  </span>
                  <TeamLogo
                    src={pick.teamLogoLight}
                    alt={pick.teamAbbrev}
                    className="h-8 w-8 shrink-0"
                    team={pick.teamAbbrev}
                    loading="eager"
                  />
                </div>

                <div className="flex flex-col items-center w-full text-center">
                  {isVoided || isForfeited ? (
                    <span className="text-xs italic text-slate-500 leading-[2.5]">
                      — {isVoided ? 'Voided' : 'Forfeited'} —
                    </span>
                  ) : isDrafted ? (
                    <>
                      <span className="text-xs leading-tight">{pick.firstName?.default}</span>
                      <span className="text-xs font-bold leading-tight">
                        {pick.lastName?.default}
                      </span>
                      <span className="text-xs text-slate-500">
                        {pick.positionCode}&nbsp;
                        <span title={pick.countryCode}>{countryCodeToFlag(pick.countryCode)}</span>
                      </span>
                    </>
                  ) : isOnTheClock ? (
                    <>
                      <span className="text-xs leading-tight">
                        {pick.teamPlaceNameWithPreposition?.default ?? pick.teamAbbrev}
                      </span>
                      <span className="text-xs font-bold leading-tight">
                        {pick.teamCommonName?.default ?? pick.teamName?.default}
                      </span>
                      <span className="text-xs font-semibold text-orange-500">
                        <FontAwesomeIcon icon={faClock} /> On the Clock
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs leading-tight text-slate-500">
                        {pick.teamPlaceNameWithPreposition?.default ?? pick.teamAbbrev}
                      </span>
                      <span className="text-xs font-bold leading-tight">
                        {pick.teamCommonName?.default ?? pick.teamName?.default}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Scroll right"
          className="shrink-0 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          onClick={() => scroll('right')}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default DraftTicker;
