import React from 'react';
import Headshot from './Headshot';
import TeamLogo from './TeamLogo';
import PlayerLink from './PlayerLink';
import { formatPlayerName } from '@/app/utils/formatters';
import type { StatsLeaderPlayer } from '@/app/types/player';

interface StatLeaderboardProps {
  heading: string;
  rows: StatsLeaderPlayer[];
  format?: (value: number) => string;
}

const StatLeaderboard: React.FC<StatLeaderboardProps> = ({ heading, rows, format }) => {
  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="border rounded-sm p-3">
      <h3 className="font-bold text-lg mb-2">{heading}</h3>
      <div className="space-y-2">
        {rows.map((player, index) => (
          <div key={player.id} className="flex items-center gap-2">
            <div className="w-4 text-sm text-center text-gray-500">{index + 1}</div>
            <Headshot
              playerId={player.id}
              src={player.headshot}
              alt={formatPlayerName(player)}
              team={player.teamAbbrev}
              size="2.5"
            />
            <div className="flex-1 truncate font-bold">
              <PlayerLink playerId={player.id}>{formatPlayerName(player)}</PlayerLink>
            </div>
            <TeamLogo
              team={player.teamAbbrev}
              src={player.teamLogo}
              alt={player.teamAbbrev}
              className="w-8 h-8"
            />
            <div className="w-14 text-right font-bold">
              {format ? format(player.value) : player.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatLeaderboard;
