'use client';

import React, { Suspense } from 'react';
import { GameProvider } from '@/app/contexts/GameContext';
import GameSkeleton from '@/app/components/GameSkeleton';
import GameHeader from '@/app/components/GameHeader';
import GameSubPageNavigation from '@/app/components/GameSubPageNavigation';
import GameSidebar from '@/app/components/GameSidebar';
import { useParams } from 'next/navigation';

interface GameLayoutProps {
  children: React.ReactNode;
}

const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  const { id: gameId } = useParams() as { id: string };

  return (
    <div className="p-2">
      <GameProvider gameId={gameId}>
        <Suspense fallback={<GameSkeleton />}>
          <div className="container mx-auto">
            <GameHeader />
            <GameSubPageNavigation />
            <div className="grid grid-cols-4 gap-10">
              <div className="col-span-4 md:col-span-3">{children}</div>
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

export default GameLayout;
