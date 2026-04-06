import React from 'react';
import Link from 'next/link';
import PlayerLink from './PlayerLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHockeyPuck, faPeopleGroup, faTag, faUser } from '@fortawesome/free-solid-svg-icons';
import type { Tag } from '@/app/types/tag';
interface ContentTagProps {
  tag: Tag;
}

const ContentTag: React.FC<ContentTagProps> = ({ tag }) => {
  let url = `/news/topic/${tag.slug}`;
  let icon = faTag;
  let playerId: string | number | undefined;

  if (tag.externalSourceName === 'player' && tag.extraData?.playerId) {
    playerId = tag.extraData.playerId;
    icon = faUser;
  }

  if (tag.externalSourceName === 'team' && tag.extraData?.abbreviation) {
    url = `/team/${tag.extraData.abbreviation}`;
    icon = faPeopleGroup;
  }

  if (tag.externalSourceName === 'game' && tag.extraData?.gameId) {
    url = `/game/${tag.extraData.gameId}`;
    icon = faHockeyPuck;
  }

  return playerId ? (
    <PlayerLink
      playerId={playerId}
      key={tag._entityId}
      className="inline-block rounded-sm p-1 border text-xs m-1"
    >
      <FontAwesomeIcon icon={icon} fixedWidth className="mr-1" /> {tag.title}
    </PlayerLink>
  ) : (
    <Link href={url} key={tag._entityId} className="inline-block rounded-sm p-1 border text-xs m-1">
      <FontAwesomeIcon icon={icon} fixedWidth className="mr-1" /> {tag.title}
    </Link>
  );
};

export default ContentTag;
