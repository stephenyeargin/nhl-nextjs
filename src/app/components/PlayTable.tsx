'use client';

import React from 'react';
import Image from 'next/image';
import SirenOnSVG from '@/app/assets/siren-on-solid.svg';
import { GAME_EVENTS } from '@/app/utils/constants';
import { formatPeriodLabel } from '@/app/utils/formatters';

interface PlayTableProps {
  plays: any[];
  activePeriod: number | null;
  renderPlayByPlayEvent: (_play: any) => React.ReactNode;
  renderTeamLogo: (_teamId?: number | string) => React.ReactNode;
}

const PlayTable: React.FC<PlayTableProps> = ({
  plays,
  activePeriod,
  renderPlayByPlayEvent,
  renderTeamLogo,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="text-xs min-w-full table-auto">
        <thead>
          <tr className="hidden">
            <th className="p-2 text-center">Time</th>
            <th className="p-2 text-center">Event Type</th>
            <th className="p-2 text-center">Details</th>
          </tr>
        </thead>
        <tbody>
          {(!plays || plays.length === 0) && (
            <tr>
              <td colSpan={3} className="p-2 text-center">
                No matching plays.
              </td>
            </tr>
          )}
          {plays &&
            plays.map((play: any, i: number) => (
              <tr key={play.eventId} className={i % 2 === 0 ? 'bg-slate-500/10' : ''}>
                <td className="p-2 text-xs text-center">
                  <div className="mt-1">
                    <span className="p-1 mx-auto font-bold border rounded-sm">
                      {play.timeRemaining}
                    </span>
                  </div>
                  {activePeriod === 0 && (
                    <div className="p-2">{formatPeriodLabel(play.periodDescriptor, true)}</div>
                  )}
                </td>
                <td className="p-2 flex flex-wrap gap-2 items-center">
                  <div className="w-10 h-10">
                    {play.details?.eventOwnerTeamId &&
                      renderTeamLogo(play.details?.eventOwnerTeamId)}
                  </div>
                  <div>
                    <span className="hidden lg:block p-1 border rounded-sm font-bold text-xs uppercase">
                      {(GAME_EVENTS as Record<string, string>)[play.typeDescKey]}
                    </span>
                    {play.typeDescKey === 'goal' && (
                      <div>
                        <Image
                          src={SirenOnSVG}
                          className="p-2 w-12 h-12 animate-pulse mx-auto"
                          width={200}
                          height={200}
                          alt="Goal"
                        />
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-2 text-sm">{renderPlayByPlayEvent(play)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayTable;
