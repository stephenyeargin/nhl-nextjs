'use client';

import React from 'react';
import Link from 'next/link';
import TeamLogo from '@/app/components/TeamLogo';
import { formatLocalizedDate, formatLocalizedTime, formatBroadcasts } from '@/app/utils/formatters';
import styles from '@/app/components/StatsTable.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faWarning } from '@fortawesome/free-solid-svg-icons';

interface TeamInfo {
  abbreviation: string;
}

interface PlaceName {
  default: string;
}

interface GameTeam {
  abbrev: string;
  score: number;
  placeName: PlaceName;
}

interface GameOutcome {
  lastPeriodType?: string;
}

interface BroadcastInfo { network: string; market: string }

interface Game {
  id: number | string;
  startTimeUTC: string;
  gameType: number;
  gameState: string;
  gameScheduleState?: string;
  gameOutcome?: GameOutcome;
  awayTeam: GameTeam;
  homeTeam: GameTeam;
  tvBroadcasts?: BroadcastInfo[] | null;
}

interface FullSeasonSchedule {
  games: Game[];
}

interface TeamScheduleProps {
  team: TeamInfo;
  fullSeasonSchedule: FullSeasonSchedule;
  headerStyle?: React.CSSProperties;
}

const TeamSchedule = ({ team, fullSeasonSchedule, headerStyle }: TeamScheduleProps) => {
  return (
    <div className="overflow-x-auto">
  <table className={styles.statsTable}>
        <thead>
          <tr>
            <th style={headerStyle} className="text-left">Date</th>
            <th style={headerStyle} className="text-left">Matchup</th>
            <th style={headerStyle} className="" colSpan={2}>Result</th>
            <th style={headerStyle} className="">Broadcasts</th>
          </tr>
        </thead>
        <tbody>
          {fullSeasonSchedule.games.map((game) => (
            <tr key={game.id}>
              <td>
                <time dateTime={game.startTimeUTC} suppressHydrationWarning={true}>
                  {formatLocalizedDate(game.startTimeUTC)}
                </time>
                {' '}
                <time dateTime={game.startTimeUTC} suppressHydrationWarning={true}>
                  {formatLocalizedTime(game.startTimeUTC)}
                </time>
              </td>
              <td>
                <div className="flex gap-2 items-center">
                  {game.gameType === 1 && (
                    <span className="text-xs p-1 border rounded">Preseason</span>
                  )}
                  <TeamLogo team={game.awayTeam.abbrev !== team.abbreviation ? game.awayTeam.abbrev : game.homeTeam.abbrev } className="h-8 w-8" />
                  <Link href={`/game/${game.id}`} className="underline">{game.awayTeam.placeName.default} @ {game.homeTeam.placeName.default}</Link>                   
                </div>
              </td>
              <td className="text-center">
                {(game.gameState === 'OFF' || game.gameState === 'FINAL') && (
                  <>
                    {game.gameOutcome?.lastPeriodType !== 'REG' ? game.gameOutcome?.lastPeriodType : '' }
                    {(team.abbreviation === game.awayTeam.abbrev && game.awayTeam.score > game.homeTeam.score) ? 'W' : (team.abbreviation === game.homeTeam.abbrev && game.homeTeam.score > game.awayTeam.score) ? 'W' : 'L'}
                  </>
                )}
                {['LIVE', 'CRIT'].includes(game.gameState) && (
                  <span className="p-1 text-xs font-bold rounded text-white bg-red-900 uppercase">Live</span>
                )}
              </td>
              <td>
                {['OFF', 'FINAL', 'LIVE', 'CRIT'].includes(game.gameState) && (
                  <Link href={`/game/${game.id}`} className="underline">
                    {game.awayTeam.abbrev} {game.awayTeam.score}-{game.homeTeam.score} {game.homeTeam.abbrev}
                  </Link>
                )}
                {game.gameScheduleState === 'CNCL' && (
                  <span className="text-sm font-medium px-2 py-1 bg-yellow-500 text-black rounded mr-1 uppercase"><FontAwesomeIcon icon={faBan} fixedWidth /> Cancelled</span>
                )}
                {game.gameScheduleState === 'PPD' && (
                  <span className="text-sm font-medium px-2 py-1 bg-yellow-500 text-black rounded mr-1 uppercase"><FontAwesomeIcon icon={faWarning} fixedWidth /> Postponed</span>
                )} 
              </td>
              <td>
                {formatBroadcasts(game.tvBroadcasts)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamSchedule;