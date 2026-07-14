import React from 'react';
import { SkeletonBlock, SkeletonPulse } from './loading/SkeletonPrimitives';

const GameBodySkeleton = () => {
  return (
    <SkeletonPulse className="container mx-auto">
      <SkeletonBlock className="my-2 h-10" style={{ maxWidth: '40%' }} />

      <SkeletonBlock className="my-2 h-5" style={{ maxWidth: '30%' }} />
      <SkeletonBlock className="my-10 h-5" />
      <SkeletonBlock className="my-2 h-5" />
      <SkeletonBlock className="my-2 h-5" />
      <SkeletonBlock className="my-2 h-5" />
    </SkeletonPulse>
  );
};

GameBodySkeleton.propTypes = {};

export default GameBodySkeleton;
