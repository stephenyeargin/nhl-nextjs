'use client';
import React from 'react';
import Link from 'next/link';
import standingsStyles from '@/app/components/StandingsTable.module.scss';
import type { DraftRankingsData } from '@/app/types/draft';
import { countryCodeToFlag } from '@/app/utils/formatters';

interface DraftRankingsProps {
  rankingsData: DraftRankingsData;
  viewMode?: 'picks' | 'rankings';
}

function formatHeight(inches: number): string {
  return `${Math.floor(inches / 12)}'${inches % 12}"`;
}

function formatPosition(positionCode: string): string {
  const normalized = positionCode?.toUpperCase();
  const positionLabels: Record<string, string> = {
    C: 'Center',
    LW: 'Left Wing',
    RW: 'Right Wing',
    D: 'Defenseman',
    G: 'Goalie',
  };

  return positionLabels[normalized] ?? positionCode;
}

function toFiniteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function isLimitedViewingRank(rank: number | null): boolean {
  return rank !== null && rank > 500;
}

function formatRankForDisplay(rank: number | null): string {
  if (rank === null) {
    return 'NR';
  }
  if (isLimitedViewingRank(rank)) {
    return '*';
  }

  return `${rank}`;
}

const DraftRankings: React.FC<DraftRankingsProps> = ({ rankingsData, viewMode }) => {
  const { rankings, categoryKey, categories } = rankingsData;
  const hasFinalRankings = rankings.some(
    (player) =>
      toFiniteNumber(player.finalRank) !== null || toFiniteNumber(player.finalRanking) !== null
  );

  const getFinalRank = (player: (typeof rankings)[number]): number | null => {
    return toFiniteNumber(player.finalRank) ?? toFiniteNumber(player.finalRanking);
  };

  const getMidtermRank = (player: (typeof rankings)[number]): number | null => {
    return toFiniteNumber(player.midtermRank);
  };

  const sortedRankings = [...rankings].sort((a, b) => {
    const aPrimaryRank = hasFinalRankings ? getFinalRank(a) : getMidtermRank(a);
    const bPrimaryRank = hasFinalRankings ? getFinalRank(b) : getMidtermRank(b);
    const aRank = aPrimaryRank ?? Number.MAX_SAFE_INTEGER;
    const bRank = bPrimaryRank ?? Number.MAX_SAFE_INTEGER;

    return aRank - bRank;
  });

  const hasLimitedViewing = rankings.some((player) => {
    const finalRank = getFinalRank(player);
    const midtermRank = getMidtermRank(player);

    return isLimitedViewingRank(finalRank) || isLimitedViewingRank(midtermRank);
  });

  if (!rankings || rankings.length === 0) {
    return (
      <div className="text-center text-slate-500 dark:text-slate-300 py-8">
        No rankings available.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 overflow-x-auto">
        <div className="inline-flex" role="tablist" aria-label="Draft ranking category">
          {categories.map((category, index) => {
            const active = category.consumerKey === categoryKey;
            let linkClasses =
              'cursor-pointer flex items-center p-2 text-sm whitespace-nowrap bg-inherit text-black dark:text-white border-t border-b border-slate-300 dark:border-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:ring-inset';

            if (index === 0) {
              linkClasses += ' border-l rounded-l-md';
            } else if (index === categories.length - 1) {
              linkClasses += ' border-l border-r rounded-r-md';
            } else {
              linkClasses += ' border-l';
            }

            if (active) {
              linkClasses += ' bg-slate-200 dark:bg-slate-800';
            }

            return (
              <Link
                key={category.id}
                href={`/draft/${rankingsData.draftYear}?category=${category.id}${viewMode === 'rankings' ? '&view=rankings' : ''}`}
                role="tab"
                aria-current={active ? 'page' : undefined}
                aria-selected={active}
                className={linkClasses}
              >
                {category.name}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className={`${standingsStyles.standingsTable} border-collapse`}>
          <thead>
            <tr>
              <th>{hasFinalRankings ? 'Final (Mid)' : '#'}</th>
              <th>Player</th>
              <th>Height</th>
              <th>Weight</th>
              <th>Pos</th>
              <th>Last Amateur Club</th>
              <th>League</th>
            </tr>
          </thead>
          <tbody>
            {sortedRankings.map((player, index) => {
              const finalRank = getFinalRank(player);
              const midtermRank = getMidtermRank(player);
              const rankCell = hasFinalRankings
                ? `${formatRankForDisplay(finalRank)} (${formatRankForDisplay(midtermRank)})`
                : formatRankForDisplay(midtermRank);
              const rowKey = `${player.firstName}-${player.lastName}-${finalRank ?? 'nr'}-${midtermRank ?? 'nr'}-${index}`;

              return (
                <tr key={rowKey}>
                  <td className="font-semibold">{rankCell}</td>
                  <td>
                    <span className="mr-1" title={player.birthCountry}>
                      {countryCodeToFlag(player.birthCountry)}
                    </span>
                    {player.firstName} {player.lastName}
                  </td>
                  <td>{player.heightInInches ? formatHeight(player.heightInInches) : ''}</td>
                  <td>{player.weightInPounds || ''}</td>
                  <td>{formatPosition(player.positionCode)}</td>
                  <td>{player.lastAmateurClub || ''}</td>
                  <td>{player.lastAmateurLeague || ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {hasLimitedViewing && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">* Limited Viewing</p>
      )}
    </div>
  );
};

export default DraftRankings;
