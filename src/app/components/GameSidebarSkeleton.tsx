import React from 'react';
import { SkeletonBlock, SkeletonPulse } from './loading/SkeletonPrimitives';

const GameSidebarSkeleton = () => {
  return (
    <SkeletonPulse>
      <SkeletonBlock className="my-2 h-10" />
      <SkeletonBlock className="my-2 h-5" />
      <SkeletonBlock className="my-2 h-5" />
      <SkeletonBlock className="my-2 h-5" />
      <SkeletonBlock className="my-2 h-5" />

      <SkeletonBlock className="mt-10 mb-2 h-10" />
      <SkeletonBlock className="my-2 h-5" />
      <SkeletonBlock className="my-2 h-5" />
      <SkeletonBlock className="my-2 h-5" />
      <SkeletonBlock className="my-2 h-5" />
    </SkeletonPulse>
  );
};

GameSidebarSkeleton.propTypes = {};

export default GameSidebarSkeleton;
