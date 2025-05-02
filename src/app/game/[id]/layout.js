'use client';

import React, { Suspense } from 'react';
import { PropTypes } from 'prop-types';
import { GameProvider } from '@/app/contexts/GameContext';
import GameSkeleton from '@/app/components/GameSkeleton';
import GameHeader from '@/app/components/GameHeader';
import GameSubPageNavigation from '@/app/components/GameSubPageNavigation';
import GameSidebar from '@/app/components/GameSidebar';
import { useParams } from 'next/navigation';

const GameLayout = ({ children }) => {
  const { id: gameId } = useParams();

  return (
    <div className="p-2">
      <GameProvider gameId={gameId}>
        <Suspense fallback={<GameSkeleton />}>
          <div className="container mx-auto">
            <GameHeader />

            <GameSubPageNavigation />

            <div className="grid grid-cols-4 gap-10">
              <div className="col-span-4 md:col-span-3">
                {children}
              </div>

              <div className="col-span-4 md:col-span-1">
                <GameSidebar />
              </div>
            </div>
          </div>
        </Suspense>
      </GameProvider>
    </div>
  );
};

GameLayout.propTypes = {
  children: PropTypes.node.isRequired,
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default GameLayout;
