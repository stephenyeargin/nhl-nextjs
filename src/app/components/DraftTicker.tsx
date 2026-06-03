'use client';
import React, { useEffect, useState } from 'react';
import TeamLogo from './TeamLogo';
import Link from 'next/link';
import type { DraftPickTicker } from '@/app/types/draft';
import { countryCodeToFlag } from '../utils/formatters';

interface DraftApiResponse {
  selectableRounds?: number[];
  picks: DraftPickTicker[];
}

const DraftTicker: React.FC = () => {
  const [picks, setPicks] = useState<DraftPickTicker[]>([]);
  const [draftYear, setDraftYear] = useState<number | null>(null);
  const [rounds, setRounds] = useState<number[]>([]);
  const [selectedRound, setSelectedRound] = useState<number>(1);

  useEffect(() => {
    const year = new Date().getFullYear();
    setDraftYear(year);
    fetch(`/api/nhl/draft/picks/${year}/all`)
      .then((res) => res.json())
      .then((data: DraftApiResponse) => {
        setRounds(data.selectableRounds || [1]);
        setPicks(data.picks.filter((pick) => pick.round === selectedRound));
      })
      .catch(() => {
        setRounds([1]);
        setPicks([]);
      });
  }, [selectedRound]);

  if (!picks.length) {
    return null;
  }

  return (
    <div className="px-2 my-3">
      <div className="flex text-xs gap-3 overflow-x-auto scrollbar-hidden items-center">
        <div className="font-bold text-base px-4 whitespace-nowrap">
          <div>
            <Link href="/draft">{draftYear} NHL Draft</Link>
          </div>
          <div className="text-center">
            <select
              className="w-full mt-3 p-2 rounded-sm border bg-inherit text-xs"
              value={selectedRound}
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
        {picks.map((pick) => {
          const isPickIsIn = pick.lastName?.default && pick.firstName?.default;
          const isVoided = pick.lastName?.default === 'Void' && !pick.firstName;

          return (
            <div
              key={pick.overallPick}
              className={`flex flex-col justify-center items-center gap-1 px-3 py-2 border rounded-lg shadow-xs min-w-45 max-w-xs overflow-hidden${isVoided ? ' opacity-50' : ''}`}
            >
              <div className="flex items-center gap-2 w-full justify-center">
                <span className="text-lg font-extrabold text-blue-800 dark:text-blue-200">
                  {pick.overallPick}
                </span>
                <TeamLogo
                  src={pick.teamLogoLight}
                  alt={pick.teamAbbrev}
                  className="h-10 w-10 shrink-0"
                  team={pick.teamAbbrev}
                  loading="eager"
                />
              </div>
              <div className="flex flex-col items-center w-full">
                {isPickIsIn ? (
                  <>
                    <span className="text-xs font-bold leading-tight text-center wrap-break-word">
                      {pick.firstName?.default}&nbsp;{pick.lastName?.default}
                    </span>
                    <span className="text-xs">
                      {pick.positionCode}&nbsp;
                      <span title={`${pick.countryCode} Flag`}>
                        {countryCodeToFlag(pick.countryCode)}
                      </span>
                    </span>
                  </>
                ) : (
                  <>
                    {isVoided ? (
                      <span className="text-xs italic text-slate-500 leading-[2.5]">
                        — Voided —
                      </span>
                    ) : (
                      <>
                        <span className="text-xs font-bold leading-tight text-center wrap-break-word">
                          {pick.teamName?.default}
                        </span>
                        <span className="text-xs]">
                          {pick.teamPickHistory?.replace(/-/g, ' » ')}
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DraftTicker;
