import React from 'react';
import Headshot from './Headshot';
import GameClock from './GameClock';

export const Skater = ({ player, game, isHomeTeam }) => {

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

  return (
    <div key={player.playerId} className="text-xs text-center m-5">
      <div
        title={player.name.default}
        className={`md:hidden font-bold border rounded-full w-10 h-10 p-3 ${isHomeTeam === false ? 'text-black bg-white' : 'text-white bg-black'}`}
      >
        {player.sweaterNumber}
      </div>
      <Headshot
        src={player.headshot}
        alt={`${player.name.default}`}
        size="2"
        className="hidden md:block m-1 mx-auto"
      />
      <div className="hidden md:block font-bold">{player.name.default}</div>
      <div className="hidden md:block text-sm my-1">
        #{player.sweaterNumber} • {player.positionCode}
        {game && player.secondsRemaining && (
          <span className="ml-1 border rounded p-1 text-xs"><GameClock timeRemaining={time} running={game.clock.running} /></span>
        )}
      </div>

    </div>
  )
};