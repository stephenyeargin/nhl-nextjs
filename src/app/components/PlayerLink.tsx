'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePlayerCard } from '../contexts/PlayerCardContext';

const HOVER_OPEN_DELAY = 120;

interface PlayerLinkProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  playerId: number | string;
  children: React.ReactNode;
}

const PlayerLink: React.FC<PlayerLinkProps> = ({
  playerId,
  children,
  className,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onAuxClick,
  ...buttonProps
}) => {
  const { openCard, closeCard, scheduleClose, cancelClose, cardState } = usePlayerCard();
  const router = useRouter();
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOpen = String(cardState?.data.playerId) === String(playerId);

  const clearHoverIntent = () => {
    if (hoverTimerRef.current !== null) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  useEffect(() => () => clearHoverIntent(), []);

  const supportsHover = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    clearHoverIntent();
    onClick?.(e);
    if (e.defaultPrevented) {
      return;
    }

    // Ctrl/Cmd+click → navigate directly
    if (e.metaKey || e.ctrlKey) {
      router.push(`/player/${playerId}`);

      return;
    }

    if (isOpen) {
      closeCard();

      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    openCard(playerId, rect);
  };

  // Middle-click → navigate directly
  const handleAuxClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    clearHoverIntent();
    onAuxClick?.(e);
    if (e.defaultPrevented) {
      return;
    }

    if (e.button === 1) {
      router.push(`/player/${playerId}`);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    onMouseEnter?.(e);
    if (e.defaultPrevented || !supportsHover()) {
      return;
    }

    cancelClose();
    if (isOpen) {
      return;
    }

    clearHoverIntent();
    const rect = e.currentTarget.getBoundingClientRect();
    hoverTimerRef.current = setTimeout(() => {
      openCard(playerId, rect);
    }, HOVER_OPEN_DELAY);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    onMouseLeave?.(e);
    if (e.defaultPrevented || !supportsHover()) {
      return;
    }

    clearHoverIntent();
    scheduleClose(180);
  };

  const mergedStyle: React.CSSProperties = { cursor: 'pointer', ...style };

  return (
    <button
      type="button"
      onClick={handleClick}
      onAuxClick={handleAuxClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`appearance-none border-0 bg-transparent p-0 text-left text-inherit font-inherit ${className || ''}`.trim()}
      style={mergedStyle}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      {...buttonProps}
    >
      {children}
    </button>
  );
};

export default PlayerLink;
