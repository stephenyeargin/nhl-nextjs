'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { formatSeason } from '../utils/formatters';
import { formatTextColorByBackgroundColor } from '../utils/formatters';
import { getTeamDataByAbbreviation } from '../utils/teamData';
import { usePlayerCard } from '../contexts/PlayerCardContext';
import TeamLogo from './TeamLogo';

const POSITION_LABELS: Record<string, string> = {
  C: 'C',
  D: 'D',
  G: 'G',
  L: 'LW',
  R: 'RW',
};

const CARD_WIDTH = 288;
const CARD_HEIGHT = 252;
const OFFSET = 8;

type CardData = NonNullable<ReturnType<typeof usePlayerCard>['cardState']>['data'];

function usePortalRoot(): HTMLElement | null {
  const [root, setRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setRoot(document.body);
  }, []);

  return root;
}

function formatHeight(inches?: number): string | null {
  if (!inches) {
    return null;
  }

  const feet = Math.floor(inches / 12);
  const remainder = inches % 12;

  return `${feet}'${remainder}"`;
}

function formatBirthplace(data: CardData): string | null {
  const parts = [
    data.birthCity?.default,
    data.birthStateProvince?.default,
    data.birthCountry,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : null;
}

function formatPctg(value?: number): string | null {
  if (value === undefined) {
    return null;
  }

  return value.toFixed(3).replace(/^0/, '');
}

function buildSeasonSummary(data: CardData): string | null {
  const season = data.featuredStats?.season;
  const subSeason = data.featuredStats?.regularSeason?.subSeason;

  if (!season || !subSeason) {
    return null;
  }

  if (data.position === 'G' || subSeason.savePctg !== undefined || subSeason.gaa !== undefined) {
    const savePctg = formatPctg(subSeason.savePctg);
    const items = [
      subSeason.gamesPlayed !== undefined ? `${subSeason.gamesPlayed} GP` : null,
      subSeason.wins !== undefined ? `${subSeason.wins} W` : null,
      savePctg ? `${savePctg} SV%` : null,
      subSeason.gaa !== undefined ? `${Number(subSeason.gaa).toFixed(2)} GAA` : null,
    ].filter(Boolean);

    return items.length > 0 ? `${formatSeason(season)}: ${items.join(' • ')}` : null;
  }

  const items = [
    subSeason.gamesPlayed !== undefined ? `${subSeason.gamesPlayed} GP` : null,
    subSeason.goals !== undefined ? `${subSeason.goals} G` : null,
    subSeason.assists !== undefined ? `${subSeason.assists} A` : null,
    subSeason.points !== undefined ? `${subSeason.points} P` : null,
  ].filter(Boolean);

  return items.length > 0 ? `${formatSeason(season)}: ${items.join(' • ')}` : null;
}

function buildRecentSummary(data: CardData): string | null {
  if (!data.last5Games || data.last5Games.length === 0) {
    return null;
  }

  const goalieGames = data.last5Games.filter(
    (game) =>
      game.savePctg !== undefined ||
      game.shotsAgainst !== undefined ||
      game.goalsAgainst !== undefined
  );

  if (data.position === 'G' || goalieGames.length > 0) {
    const totals = goalieGames.reduce(
      (acc, game) => ({
        wins: acc.wins + Number(game.wins ?? 0),
        goalsAgainst: acc.goalsAgainst + Number(game.goalsAgainst ?? 0),
        shotsAgainst: acc.shotsAgainst + Number(game.shotsAgainst ?? 0),
      }),
      { wins: 0, goalsAgainst: 0, shotsAgainst: 0 }
    );
    const gamesPlayed = goalieGames.length || data.last5Games.length;
    const savePctg =
      totals.shotsAgainst > 0
        ? ((totals.shotsAgainst - totals.goalsAgainst) / totals.shotsAgainst)
            .toFixed(3)
            .replace(/^0/, '')
        : null;
    const gaa = gamesPlayed > 0 ? ((totals.goalsAgainst / gamesPlayed) * 1).toFixed(2) : null;
    const items = [
      `${gamesPlayed} GP`,
      totals.wins > 0 ? `${totals.wins} W` : null,
      savePctg ? `${savePctg} SV%` : null,
      gaa && totals.goalsAgainst > 0 ? `${gaa} GAA` : null,
    ].filter(Boolean);

    return items.length > 0 ? items.join(' • ') : null;
  }

  const totals = data.last5Games.reduce(
    (acc, game) => ({
      goals: acc.goals + Number(game.goals ?? 0),
      assists: acc.assists + Number(game.assists ?? 0),
      points: acc.points + Number(game.points ?? 0),
    }),
    { goals: 0, assists: 0, points: 0 }
  );

  return `${totals.goals} G • ${totals.assists} A • ${totals.points} P`;
}

function computePosition(rect: DOMRect): React.CSSProperties {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const width = Math.min(CARD_WIDTH, viewportWidth - OFFSET * 2);

  let top = rect.bottom + OFFSET;
  if (top + CARD_HEIGHT > viewportHeight) {
    top = rect.top - CARD_HEIGHT - OFFSET;
  }
  if (top < OFFSET) {
    top = OFFSET;
  }

  let left = rect.left;
  if (left + width > viewportWidth) {
    left = rect.right - width;
  }
  if (left < OFFSET) {
    left = OFFSET;
  }

  return { position: 'fixed', top, left, width };
}

const PlayerCardPopover: React.FC = () => {
  const { cardState, loading, closeCard, scheduleClose, cancelClose } = usePlayerCard();
  const portalRoot = usePortalRoot();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCard();
      }
    },
    [closeCard]
  );

  const handleViewportChange = useCallback(() => closeCard(), [closeCard]);

  useEffect(() => {
    if (!cardState && !loading) {
      return;
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleViewportChange, { passive: true });
    window.addEventListener('resize', handleViewportChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleViewportChange);
      window.removeEventListener('resize', handleViewportChange);
    };
  }, [cardState, loading, handleKeyDown, handleViewportChange]);

  useEffect(() => {
    if (!cardState && !loading) {
      return;
    }

    const handlePointerDown = (e: PointerEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        closeCard();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [cardState, loading, closeCard]);

  if (!portalRoot) {
    return null;
  }

  if (!cardState && !loading) {
    return null;
  }

  const positionStyle = cardState
    ? computePosition(cardState.rect)
    : { position: 'fixed' as const, top: -9999, left: -9999 };
  const data = cardState?.data;
  const detailLine = [
    data?.sweaterNumber ? `#${data.sweaterNumber}` : null,
    data?.position ? POSITION_LABELS[data.position] || data.position : null,
    data?.shootsCatches ? `Shoots ${data.shootsCatches}` : null,
  ]
    .filter(Boolean)
    .join(' • ');
  const measurements = [
    formatHeight(data?.heightInInches),
    data?.weightInPounds ? `${data.weightInPounds} lb` : null,
  ]
    .filter(Boolean)
    .join(' • ');
  const teamName = data?.fullTeamName?.default;
  const birthplace = data ? formatBirthplace(data) : null;
  const seasonSummary = data ? buildSeasonSummary(data) : null;
  const recentSummary = data ? buildRecentSummary(data) : null;
  const teamData = data?.currentTeamAbbrev
    ? getTeamDataByAbbreviation(data.currentTeamAbbrev, true)
    : null;
  const accentColor = teamData?.teamColor || '#0f172a';
  const accentTextColor = formatTextColorByBackgroundColor(accentColor);
  const accentStyle: React.CSSProperties = teamData?.secondaryTeamColor
    ? {
        backgroundImage: `linear-gradient(90deg, ${accentColor}, ${teamData.secondaryTeamColor})`,
      }
    : { backgroundColor: accentColor };

  const card = (
    <div
      ref={cardRef}
      role="dialog"
      aria-modal="false"
      aria-label={
        data
          ? `${data.firstName.default} ${data.lastName.default} player card`
          : 'Loading player card'
      }
      style={{ ...positionStyle, zIndex: 9999 }}
      onMouseEnter={cancelClose}
      onMouseLeave={() => scheduleClose()}
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5 dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="h-1.5 w-full" style={accentStyle} />
      {loading && !data && (
        <div className="flex h-24 items-center justify-center text-sm text-slate-500">Loading…</div>
      )}

      {data && (
        <>
          <div className="border-b border-slate-100 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-900/60">
            <div className="flex items-start gap-3">
              {data.headshot ? (
                <Image
                  src={data.headshot}
                  alt={`${data.firstName.default} ${data.lastName.default}`}
                  width={72}
                  height={72}
                  className="shrink-0 rounded-full bg-slate-200"
                />
              ) : (
                <div className="h-18 w-18 shrink-0 rounded-full bg-slate-200" />
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold leading-tight">
                      {data.firstName.default} {data.lastName.default}
                    </div>
                    {detailLine && (
                      <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                        {detailLine}
                      </div>
                    )}
                  </div>
                  <TeamLogo
                    team={data.currentTeamAbbrev}
                    noLink
                    className="h-9 w-9 shrink-0"
                    style={{ maxHeight: '2.25rem', maxWidth: '2.25rem' }}
                  />
                </div>

                <div className="mt-2 flex items-center gap-2">
                  {teamName && (
                    <div className="truncate text-xs font-medium text-slate-700 dark:text-slate-200">
                      {teamName}
                    </div>
                  )}
                  {data.currentTeamAbbrev && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide"
                      style={{ backgroundColor: accentColor, color: accentTextColor }}
                    >
                      {data.currentTeamAbbrev}
                    </span>
                  )}
                </div>

                {(measurements || birthplace) && (
                  <div className="mt-1 space-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {measurements && <div>{measurements}</div>}
                    {birthplace && <div className="truncate">{birthplace}</div>}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2 p-3">
            {seasonSummary && (
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Season Snapshot
                </div>
                <div className="mt-1 text-xs text-slate-800 dark:text-slate-100">
                  {seasonSummary}
                </div>
              </div>
            )}

            {recentSummary && (
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Last 5 Games
                </div>
                <div className="mt-1 text-xs text-slate-800 dark:text-slate-100">
                  {recentSummary}
                </div>
              </div>
            )}

            {data.isActive === false && (
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Inactive player profile
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 px-3 py-2 dark:border-slate-700">
            <Link
              href={`/player/${data.playerId}`}
              className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
              onClick={closeCard}
            >
              View full profile →
            </Link>
          </div>
        </>
      )}
    </div>
  );

  return ReactDOM.createPortal(card, portalRoot);
};

export default PlayerCardPopover;
