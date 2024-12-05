import React from 'react';
import Link from 'next/link';
import Headshot from './Headshot';
import GameClock from './GameClock';
import { PropTypes } from 'prop-types';
import { formatTextColorByBackgroundColor } from '../utils/formatters';

export const Skater = ({ player, game, isHomeTeam, teamColor }) => {

  // Add time remaining
  let time = '0:00';
  if (player.secondsRemaining) {
    const timeInSeconds = parseInt(player.secondsRemaining, 10);
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSeconds = seconds.toString().padStart(2, '0');
    time = `${paddedMinutes}:${paddedSeconds}`;
  }

  let skaterStyle = { backgroundColor: teamColor, color: formatTextColorByBackgroundColor(teamColor) };
  if (!isHomeTeam) {
    skaterStyle = { backgroundColor: '#FFF', color: '#000', border: `solid 2px ${teamColor}`};
  }

  return (
    <div key={player.playerId} className="text-xs text-center">
      <div className="lg:hidden my-3">
        <Link
          href={`/player/${player.playerId}`} target="_blank"
          title={player.commonName.default}
          className="font-bold rounded-full p-2 w-10 h-10" style={skaterStyle}
        >
          {player.sweaterNumber.toString().padStart(2, '0')}
        </Link>
      </div>
      <Headshot
        playerId={player.playerId}
        src={player.headshot}
        alt={`${player.commonName.default}`}
        size="2"
        className="hidden lg:block m-1 mx-auto"
      />
      <div className="hidden lg:block font-bold">
        <Link href={`/player/${player.playerId}`} target="_blank">{player.commonName.default}</Link>
      </div>
      <div className="">
        <div className="hidden xl:block">#{player.sweaterNumber} • {player.positionCode}</div>
        {game && player.secondsRemaining && (
          <div className="pt-1">
            <span className="border rounded p-1"><GameClock timeRemaining={time} running={game.clock.running} /></span>
          </div>
        )}
      </div>
    </div>
  );
};

Skater.propTypes = {
  player: PropTypes.object.isRequired,
  game: PropTypes.object,
  isHomeTeam: PropTypes.bool,
  teamColor: PropTypes.string
};

Skater.defaults = {
  isHomeTeam: true,
  teamColor: '#000000',
};
