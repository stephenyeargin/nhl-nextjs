import React from 'react';
import Link from 'next/link';
import { PropTypes } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHockeyPuck, faList, faRadio, faTable, faTelevision } from '@fortawesome/free-solid-svg-icons';
import { usePathname } from 'next/navigation';
import { formatBroadcasts } from '../utils/formatters';
import RadioLink from './RadioLink';

const GameSubPageNavigation = ({ game }) => {

  const { id } = game;
  const activeRoute = usePathname();  
  const activeClasses = 'bg-slate-500/10 border-slate-500 border-b-2';

  return (
    <div className="my-5 text-xs font-bold flex flex-wrap md:justify-between items-center border-b-2">
      <div className="text-sm flex items-center justify-left">
        <Link
          href={`/game/${id}`}
          className={`text-sm p-3 ${activeRoute === `/game/${id}` ? activeClasses : ''}`}
        >
          <FontAwesomeIcon icon={faHockeyPuck} fixedWidth className="mr-1" />
          {!['FUT', 'PRE'].includes(game.gameState) ? 'Summary' : 'Preview'}
        </Link>
        {!['FUT', 'PRE'].includes(game.gameState) && (
          <Link
            href={`/game/${id}/boxscore`}
            className={`text-sm p-3 ${activeRoute === `/game/${id}/boxscore` ? activeClasses : ''}`}
          >
            <FontAwesomeIcon icon={faTable} fixedWidth className="mr-1" />
            Box Score
          </Link>
        )}
        {!['FUT', 'PRE'].includes(game.gameState) && (
          <Link
            href={`/game/${id}/play-by-play`}
            className={`text-sm p-3 ${activeRoute === `/game/${id}/play-by-play` ? activeClasses : ''}`}
          >
            <FontAwesomeIcon icon={faList} fixedWidth className="mr-1" />
            Play-by-Play
          </Link>
        )}
      </div>
      <div className="order-first md:order-last p-3 flex-fill text-center flex gap-4 mb-3 md:mb-0 justify-center lg:justify-end">
        <span className="">
          <FontAwesomeIcon icon={faHockeyPuck} fixedWidth className="mr-1" />
          <Link href={`https://www.nhl.com/gamecenter/${game.id}`} className="underline">NHL.com GameCenter</Link>
        </span>
        {game.tvBroadcasts.length > 0 && (
          <span className="text-center">
            <FontAwesomeIcon icon={faTelevision} fixedWidth className="mr-1" /> {formatBroadcasts(game.tvBroadcasts)}
          </span>
        )}
        {game.homeTeam.radioLink && (
          <span className="text-center">
            <FontAwesomeIcon icon={faRadio} fixedWidth className="mr-1" />
            {' '}{' '}
            <RadioLink m3u8Url={game.homeTeam.radioLink} label="Home" />
            {' '}|{' '}
            <RadioLink m3u8Url={game.awayTeam.radioLink} label="Away" />
          </span>
        )}
      </div>
    </div>
  );
};

GameSubPageNavigation.propTypes = {
  game: PropTypes.object.isRequired,
};

export default GameSubPageNavigation;
