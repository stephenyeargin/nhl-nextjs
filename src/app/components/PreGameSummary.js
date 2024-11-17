import React from 'react';
import Image from 'next/image';

import { STAT_CONTEXT, PLAYER_STATS } from '../utils/constants';

export const PreGameSummary = ({ game }) => {
  const { matchup, awayTeam, homeTeam } = game;

  return (
    <div>
      <div className="text-3xl font-bold underline">Players to Watch</div>
      <div className="text-xl">{STAT_CONTEXT[matchup.teamLeaders?.context] || matchup.teamLeaders?.context}</div>
      <div className="flex justify-between">
        <div className="">
          <Image src={awayTeam.logo} alt={awayTeam.name.default} className="w-20 h-20 mx-auto mb-2" width="100" height="100" />
        </div>
        <div className="">
          <Image src={homeTeam.logo} alt={homeTeam.name.default} className="w-20 h-20 mx-auto mb-2" width="100" height="100" />
        </div>
      </div>
      {matchup.teamLeaders?.leaders.map((leader) => (
        <div key={leader.category} className="border grid grid-cols-12 mb-3 py-2 items-center">
          <div className="col-span-3 p-2 flex">
            <Image
              src={leader.awayLeader.headshot} alt={`${leader.awayLeader.firstName.default} ${leader.awayLeader.lastName.default}`}
              height={128} width={128}
              className="w-16 h-16 rounded-full mr-2 hidden md:block bg-slate-300"
            />
            <div className="mx-1">
              <div>{leader.awayLeader.firstName.default}</div>
              <div className="font-bold">{leader.awayLeader.lastName.default}</div>
              <div className="text-sm">#{leader.awayLeader.sweaterNumber} • {leader.awayLeader.positionCode}</div>
            </div>
          </div>
          <div className="col-span-2 text-center text-xl md:text-5xl font-black">
            {leader.awayLeader.value}
          </div>
          <div className="col-span-2 text-center">
            {PLAYER_STATS[leader.category]}
          </div>
          <div className="col-span-2 text-center text-xl md:text-5xl font-black">
            {leader.homeLeader.value}
          </div>
          <div className="col-span-3 p-2 flex justify-end">
            <div className="mx-1 text-right">
              <div>{leader.homeLeader.firstName.default}</div>
              <div className="font-bold">{leader.homeLeader.lastName.default}</div>
              <div className="text-sm">#{leader.homeLeader.sweaterNumber} • {leader.homeLeader.positionCode}</div>
            </div>
            <Image
              src={leader.homeLeader.headshot}
              alt={`${leader.homeLeader.firstName.default}
              ${leader.homeLeader.lastName.default}`}
              height={128}
              width={128}
              className="w-16 h-16 rounded-full ml-2 hidden md:block"
            />
          </div>

          {/* TODO Goaltender comparison */}
        </div>
      ))}
    </div>
  );
}
