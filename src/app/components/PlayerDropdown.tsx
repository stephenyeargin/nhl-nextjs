import React from 'react';
import { navigateTo } from '@/app/utils/navigation';

interface PlayerNamePart {
  default: string;
}
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
        navigateTo(`/player/${newPlayer}`);
      }}
      className=" p-2 rounded-sm text-xl border bg-inherit text-inherit"
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
