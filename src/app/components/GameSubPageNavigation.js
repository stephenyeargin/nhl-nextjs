'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PropTypes } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHockeyPuck, faList, faRadio, faTable, faTelevision, faVideo } from '@fortawesome/free-solid-svg-icons';
import { usePathname } from 'next/navigation';
import { formatBroadcasts } from '../utils/formatters';
import FloatingAudioPlayer from './FloatingAudioPlayer';
import { useGameContext } from '../contexts/GameContext';

const GameSubPageNavigation = () => {
  const [audioPlayerUrl, setAudioPlayerUrl] = useState(null);
  const [audioPlayerLabel, setAudioPlayerLabel] = useState(null);
  const [isAudioPlayerVisible, setAudioPlayerVisible] = useState(false);
  const [isAudioPlayerPlaying, setAudioPlayerPlaying] = useState(true);

  const { gameData } = useGameContext();

  const activeRoute = usePathname();
  const activeClasses = 'bg-slate-500/10 border-slate-500 border-b-2';

  if (!gameData) {
    return <></>;
  }

  // Destructure data for rendering
  const { game } = gameData;
  const { id } = game;

  const handleAudioPlayerStop = () => {
    setAudioPlayerPlaying(false);
  };

  const handleAudioPlayerClose = () => {
    setAudioPlayerVisible(false);
  };

  const handleTogglePlaying = () => {
    setAudioPlayerPlaying(!isAudioPlayerPlaying);
  };

  return (
    <div className="my-5 text-xs font-bold flex flex-wrap md:justify-between items-center border-b-2">
      <div className="md:text-sm flex items-center justify-left order-last lg:order-first">
        <Link
          href={`/game/${id}`}
          className={`p-3 ${activeRoute === `/game/${id}` ? activeClasses : ''}`}
        >
          <FontAwesomeIcon icon={faHockeyPuck} fixedWidth className="mr-1 hidden md:inline" />
          {!['FUT', 'PRE'].includes(game.gameState) ? 'Summary' : 'Preview'}
        </Link>
        {!['FUT', 'PRE'].includes(game.gameState) && (
          <Link
            href={`/game/${id}/boxscore`}
            className={`p-3 ${activeRoute === `/game/${id}/boxscore` ? activeClasses : ''}`}
          >
            <FontAwesomeIcon icon={faTable} fixedWidth className="mr-1 hidden md:inline" />
            Box Score
          </Link>
        )}
        {!['FUT', 'PRE'].includes(game.gameState) && (
          <Link
            href={`/game/${id}/play-by-play`}
            className={`p-3 ${activeRoute === `/game/${id}/play-by-play` ? activeClasses : ''}`}
          >
            <FontAwesomeIcon icon={faList} fixedWidth className="mr-1 hidden md:inline" />
            Play-by-Play
          </Link>
        )}
        {!['FUT', 'PRE'].includes(game.gameState) && (
          <Link
            href={`/game/${id}/highlights`}
            className={`p-3 ${activeRoute === `/game/${id}/highlights` ? activeClasses : ''}`}
          >
            <FontAwesomeIcon icon={faVideo} fixedWidth className="mr-1 hidden md:inline" />
            Highlights
          </Link>
        )}
      </div>
      <div className="order-first lg:order-last p-3 flex-fill text-center flex gap-4 mb-3 md:mb-0 justify-center items-center lg:justify-end">
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
            <button
              className="font-bold underline"
              onClick={() => {
                setAudioPlayerUrl(game.homeTeam.radioLink);
                setAudioPlayerLabel(game.homeTeam.placeName.default);
                setAudioPlayerPlaying(true);
                setAudioPlayerVisible(true);
              }}
            >
              Home
            </button>
            {' '}|{' '}
            <button
              className="font-bold underline"
              onClick={() => {
                setAudioPlayerUrl(game.awayTeam.radioLink);
                setAudioPlayerLabel(game.awayTeam.placeName.default);
                setAudioPlayerPlaying(true);
                setAudioPlayerVisible(true);
              }}
            >
              Away
            </button>
          </span>
        )}
      </div>
      <FloatingAudioPlayer isVisible={isAudioPlayerVisible} isPlaying={isAudioPlayerPlaying} url={audioPlayerUrl} label={audioPlayerLabel} onStop={handleAudioPlayerStop} onTogglePlay={handleTogglePlaying} onClose={handleAudioPlayerClose} />
    </div>
  );
};

GameSubPageNavigation.propTypes = {
  game: PropTypes.object.isRequired,
};

export default GameSubPageNavigation;
