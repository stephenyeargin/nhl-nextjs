import React from 'react';
import { PropTypes } from 'prop-types';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHockeyPuck, faPeopleGroup, faTag, faUser } from '@fortawesome/free-solid-svg-icons';

const ContentTag = ({ tag }) => {
  let url = `/news/topic/${tag.slug}`;
  let icon = faTag;

  if (tag.externalSourceName === 'player') {
    url = `/player/${tag.extraData.playerId}`;
    icon = faUser;
  }

  if (tag.externalSourceName === 'team') {
    url = `/team/${tag.extraData.abbreviation}`;
    icon = faPeopleGroup;
  }

  if (tag.externalSourceName === 'game') {
    url = `/game/${tag.extraData.gameId}`;
    icon = faHockeyPuck;
  }

  return (
    <Link href={url} key={tag._entityId} className="inline-block rounded p-1 border text-xs m-1">
      <FontAwesomeIcon icon={icon} fixedWidth className="mr-1" /> {tag.title}
    </Link>
  );
};

ContentTag.propTypes = {
  tag: PropTypes.shape({
    _entityId: PropTypes.string.isRequired,
    extraData: PropTypes.object,
    externalSourceName: PropTypes.string,
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default ContentTag;