'use client';

import React, { Suspense, use } from 'react';
import { PropTypes } from 'prop-types';
import { GameProvider } from '@/app/contexts/GameContext';
import GameSkeleton from '@/app/components/GameSkeleton';

const GameLayout = ({ children, params }) => {
  const { id: gameId } = use(params);

  return (
    <GameProvider gameId={gameId}>
      <Suspense fallback={<GameSkeleton />}>
        {children}
      </Suspense>
    </GameProvider>
  );
};

GameLayout.propTypes = {
  children: PropTypes.node.isRequired,
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default GameLayout;