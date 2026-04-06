'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { PlayerCardData } from '@/app/types/player';

export interface CardState {
  data: PlayerCardData;
  rect: DOMRect;
}

interface PlayerCardContextValue {
  openCard: (playerId: number | string, rect: DOMRect) => void;
  closeCard: () => void;
  scheduleClose: (delay?: number) => void;
  cancelClose: () => void;
  cardState: CardState | null;
  loading: boolean;
}

const PlayerCardContext = createContext<PlayerCardContextValue | null>(null);

export function usePlayerCard(): PlayerCardContextValue {
  const ctx = useContext(PlayerCardContext);
  if (!ctx) {
    throw new Error('usePlayerCard must be used within PlayerCardProvider');
  }

  return ctx;
}

export function PlayerCardProvider({ children }: { children: React.ReactNode }) {
  const [cardState, setCardState] = useState<CardState | null>(null);
  const [loading, setLoading] = useState(false);
  const cache = useRef<Map<string, PlayerCardData>>(new Map());
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeCard = useCallback(() => {
    cancelClose();
    requestIdRef.current += 1;
    setCardState(null);
    setLoading(false);
  }, [cancelClose]);

  const scheduleClose = useCallback(
    (delay = 140) => {
      cancelClose();
      closeTimerRef.current = setTimeout(() => {
        closeCard();
      }, delay);
    },
    [cancelClose, closeCard]
  );

  useEffect(() => () => cancelClose(), [cancelClose]);

  const openCard = useCallback(
    async (playerId: number | string, rect: DOMRect) => {
      cancelClose();
      const key = String(playerId);
      const requestId = ++requestIdRef.current;

      if (cache.current.has(key)) {
        setCardState({ data: cache.current.get(key)!, rect });
        setLoading(false);

        return;
      }

      setLoading(true);
      setCardState(null);

      try {
        const res = await fetch(`/api/nhl/player/${key}/landing`);
        if (!res.ok) {
          throw new Error('Failed to fetch player');
        }

        const json = await res.json();
        const data: PlayerCardData = {
          playerId: json.playerId,
          firstName: json.firstName,
          lastName: json.lastName,
          position: json.position,
          headshot: json.headshot,
          currentTeamAbbrev: json.currentTeamAbbrev,
          fullTeamName: json.fullTeamName,
          sweaterNumber: json.sweaterNumber,
          shootsCatches: json.shootsCatches,
          heightInInches: json.heightInInches,
          weightInPounds: json.weightInPounds,
          birthCity: json.birthCity,
          birthStateProvince: json.birthStateProvince,
          birthCountry: json.birthCountry,
          featuredStats: json.featuredStats,
          last5Games: json.last5Games,
          isActive: json.isActive,
        };

        cache.current.set(key, data);
        if (requestId === requestIdRef.current) {
          setCardState({ data, rect });
        }
      } catch {
        // silently fail — user can still navigate via Ctrl/Cmd+click
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [cancelClose]
  );

  return (
    <PlayerCardContext.Provider
      value={{ openCard, closeCard, scheduleClose, cancelClose, cardState, loading }}
    >
      {children}
    </PlayerCardContext.Provider>
  );
}
