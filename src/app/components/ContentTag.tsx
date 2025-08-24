import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHockeyPuck, faPeopleGroup, faTag, faUser } from '@fortawesome/free-solid-svg-icons';

interface TagExtraData { playerId?: string; abbreviation?: string; gameId?: string }
interface Tag { _entityId: string; slug: string; title: string; externalSourceName?: string; extraData?: TagExtraData }
interface ContentTagProps { tag: Tag }

const ContentTag: React.FC<ContentTagProps> = ({ tag }) => {
  let url = `/news/topic/${tag.slug}`;
  let icon = faTag;

  if (tag.externalSourceName === 'player' && tag.extraData?.playerId) {
    url = `/player/${tag.extraData.playerId}`;
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

  return (
    <Link href={url} key={tag._entityId} className="inline-block rounded p-1 border text-xs m-1">
      <FontAwesomeIcon icon={icon} fixedWidth className="mr-1" /> {tag.title}
    </Link>
  );
};

export default ContentTag;