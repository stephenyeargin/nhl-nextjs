import React from 'react';

interface PlayerNamePart { default: string }
interface PlayerOption {
  playerId: string | number;
  firstName?: PlayerNamePart;
  lastName?: PlayerNamePart;
}

interface PlayerDropdownProps {
  players: PlayerOption[];
  activePlayer: string | number;
}

const PlayerDropdown: React.FC<PlayerDropdownProps> = ({ players, activePlayer }) => {
  return (
    <select
      value={activePlayer}
      onChange={(e) => {
        const newPlayer = encodeURIComponent(e.target.value);
        window.location.href = `/player/${newPlayer}`;
      }}
      className=" p-2 rounded text-xl border bg-inherit text-inherit"
    >
      {players.map((player) => (
        <option key={player.playerId} value={player.playerId}>
          {player.lastName?.default}, {player.firstName?.default}
        </option>
      ))}
    </select>
  );
};

export default PlayerDropdown;

