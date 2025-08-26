import React from 'react';
import Link from 'next/link';
import Headshot from './Headshot';
import GameClock from './GameClock';
import { formatTextColorByBackgroundColor } from '../utils/formatters';
import { getTeamDataByAbbreviation } from '../utils/teamData';
import type { LocalizedString } from '@/app/types/content';

interface SkaterPlayer {
  playerId: number | string;
  headshot?: string;
  name?: LocalizedString;
  sweaterNumber?: string | number;
  positionCode?: string;
  secondsRemaining?: string | number;
}

interface GameClockInfo {
  running?: boolean;
}
interface GameInfo {
  clock?: GameClockInfo;
}

interface SkaterProps {
  player: SkaterPlayer;
  game?: GameInfo;
  isHomeTeam?: boolean;
  team?: string;
}

export const Skater: React.FC<SkaterProps> = ({
  player,
  game,
  isHomeTeam = true,
  team = 'NHL',
}) => {
  const { teamColor } = getTeamDataByAbbreviation(team, true);

  // Add time remaining
  let time = '0:00';
  if (player.secondsRemaining !== undefined && player.secondsRemaining !== null) {
    const sr =
      typeof player.secondsRemaining === 'string'
        ? parseInt(player.secondsRemaining, 10)
        : Number(player.secondsRemaining);
    const timeInSeconds = isNaN(sr) ? 0 : sr;
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSeconds = seconds.toString().padStart(2, '0');
    time = `${paddedMinutes}:${paddedSeconds}`;
  }

  let skaterStyle: React.CSSProperties = {
    backgroundColor: teamColor,
    color: formatTextColorByBackgroundColor(teamColor),
  };
  if (!isHomeTeam) {
    skaterStyle = {
      backgroundColor: '#FFF',
      color: '#000',
      border: `solid 2px ${teamColor}`,
    } as React.CSSProperties;
  }

  return (
    <div key={player.playerId} className="text-xs text-center">
      <div className="lg:hidden my-3">
        <Link
          href={`/player/${player.playerId}`}
          title={player.name?.default || ''}
          className="font-bold rounded-full p-2 w-10 h-10"
          style={skaterStyle}
        >
          {String(player.sweaterNumber ?? '').padStart(2, '0')}
        </Link>
      </div>
      <Headshot
        playerId={typeof player.playerId === 'number' ? player.playerId : undefined}
        src={player.headshot}
        alt={`${player.name?.default || ''}`}
        size="2"
        className="hidden lg:block m-1"
        team={team}
      />
      <div className="hidden lg:block font-bold">
        <Link href={`/player/${player.playerId}`}>{player.name?.default || player.playerId}</Link>
      </div>
      <div className="">
        <div className="hidden xl:block">
          #{player.sweaterNumber ?? ''} • {player.positionCode}
        </div>
        {game && player.secondsRemaining && (
          <div className="pt-1">
            <span className="border rounded p-1">
              <GameClock timeRemaining={time} running={!!game.clock?.running} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
