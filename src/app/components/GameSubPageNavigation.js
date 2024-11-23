import React from 'react';
import Link from 'next/link';
import { PropTypes } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHockeyPuck, faList, faTable } from '@fortawesome/free-solid-svg-icons';

const GameSubPageNavigation = ({ game }) => {

  const { id } = game;

  return (
    <div className="text-center my-3 text-xs font-bold flex gap-3 justify-center">
      <Link
        href={`/game/${id}`}
        className="text-sm underline"
      >
        <FontAwesomeIcon icon={faHockeyPuck} fixedWidth className="mr-1" />
        Back to Gamecenter
      </Link>
      <Link
        href={`/game/${id}/boxscore`}
        className="text-sm underline"
      >
        <FontAwesomeIcon icon={faTable} fixedWidth className="mr-1" />
        Box Score
      </Link>
      <Link
        href={`/game/${id}/play-by-play`}
        className="text-sm underline"
      >
        <FontAwesomeIcon icon={faList} fixedWidth className="mr-1" />
        Play-by-Play
      </Link>
    </div>
  );
};

GameSubPageNavigation.propTypes = {
  game: PropTypes.object.isRequired,
};

export default GameSubPageNavigation;
