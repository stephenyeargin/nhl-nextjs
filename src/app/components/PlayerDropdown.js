import React from 'react';
import { PropTypes } from 'prop-types';

const PlayerDropdown = ({ players, activePlayer }) => {
  return (
    <select
      value={activePlayer}
      onChange={(e) => {
        const newPlayer = e.target.value;
        window.location = `/player/${newPlayer}`;
      }}
      className=" p-2 rounded text-xl border bg-inherit text-inherit"
    >
      {players.map((player) => (
        <option key={player.playerId} value={player.playerId}>
          {player.lastName.default}, {player.firstName.default}
        </option>
      ))}
    </select>
  );
};

PlayerDropdown.propTypes = {
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
  activePlayer: PropTypes.string.isRequired,
};

export default PlayerDropdown;

