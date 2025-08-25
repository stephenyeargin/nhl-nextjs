'use client';
import React, { useEffect, useState } from 'react';
import TeamLogo from './TeamLogo';
import Link from 'next/link';

interface DraftPlayerName { default?: string }
interface DraftPick {
  overallPick: number;
  round: number;
  teamLogoLight: string;
  teamAbbrev: string;
  firstName?: DraftPlayerName;
  lastName?: DraftPlayerName;
  positionCode?: string;
}
interface DraftApiResponse {
  selectableRounds?: number[];
  picks: DraftPick[];
}

const DraftTicker: React.FC = () => {
  const [picks, setPicks] = useState<DraftPick[]>([]);
  const [draftYear, setDraftYear] = useState<number | null>(null);
  const [rounds, setRounds] = useState<number[]>([]);
  const [selectedRound, setSelectedRound] = useState<number>(1);

  useEffect(() => {
    const year = new Date().getFullYear();
    setDraftYear(year);
    fetch(`/api/nhl/draft/picks/${year}/all`)
      .then(res => res.json())
      .then((data: DraftApiResponse) => {
        setRounds(data.selectableRounds || [1]);
        setPicks(data.picks.filter(pick => pick.round === selectedRound));
      })
      .catch(() => {
        setRounds([1]);
        setPicks([]);
      });
  }, [selectedRound]);

  if (!picks.length) {return null;}

  return (
    <div className="px-2 mt-3 mb-10">
      <div className="flex text-xs gap-3 overflow-x-auto scrollbar-hidden items-center">
        <div className="font-bold text-base px-4 whitespace-nowrap">
          <div>
            <Link href="/draft">{draftYear} NHL Draft</Link>
          </div>
          <div className="text-center">
            <select
              className="w-full mt-3 p-2 rounded border bg-inherit text-xs"
              value={selectedRound}
              onChange={e => setSelectedRound(Number(e.target.value))}
            >
              {rounds.map((r) => (
                <option key={r} value={r}>Round {r}</option>
              ))}
            </select>
          </div>
        </div>
        {picks.map((pick) => (
          <div key={pick.overallPick} className="flex flex-col justify-center items-center gap-1 px-3 py-2 rounded-xl border min-w-[180px] max-w-xs overflow-hidden">
            <div className="flex items-center gap-2 w-full justify-center">
              <span className="text-lg font-extrabold text-blue-800 dark:text-blue-200 ">{pick.overallPick}</span>
              <TeamLogo src={pick.teamLogoLight} alt={pick.teamAbbrev} className="h-10 w-10 flex-shrink-0" team={pick.teamAbbrev} />
            </div>
            <div className="flex flex-col items-center w-full">
              <span className="text-xs font-bold leading-tight text-center break-words">{pick.firstName?.default} {pick.lastName?.default}</span>
              <span className="text-xs ">({pick.positionCode})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DraftTicker;
