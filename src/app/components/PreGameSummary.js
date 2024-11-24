'use-client';

import React, { useState } from 'react';
import { STAT_CONTEXT, PLAYER_STATS } from '../utils/constants';
import Headshot from './Headshot';
import StatsTable from './StatsTable';
import { formatStat } from '../utils/formatters';
import TeamLogo from './TeamLogo';
import { PropTypes } from 'prop-types';

const PreGameSummary = ({ game }) => {

  const [activeStatTeam, setActiveStatTeam] = useState('awayTeam');

  const { matchup, awayTeam, homeTeam } = game;
  const { skaterSeasonStats, goalieSeasonStats } = matchup;

  const logos = {};
  logos[homeTeam.abbrev] = homeTeam.logo;
  logos[awayTeam.abbrev] = awayTeam.logo;

  const handleStatTeamClick = (team) => {
    setActiveStatTeam(team);
  };

  const renderTeamTotals = ({ team, teamAbbrev }) => (
    <div className="grid grid-cols-12 mb-0 py-2 items-center">
      <div className="col-span-4">
        <TeamLogo
          src={logos[teamAbbrev]}
          alt={teamAbbrev}
          className="w-20 h-20"
        />
      </div>
      <div className="col-span-2 flex flex-col items-center">
        <div className="text-lg font-bold">{team.teamTotals.record}</div>
        <div className="text-sm font-light">Record</div>
      </div>
      <div className="col-span-2 flex flex-col items-center">
        <div className="text-lg font-bold">{formatStat(team.teamTotals.gaa, 3)}</div>
        <div className="text-sm font-light">GAA</div>
      </div>
      <div className="col-span-2 flex flex-col items-center">
        <div className="text-lg font-bold">{formatStat(team.teamTotals.savePctg, 3)}</div>
        <div className="text-sm font-light">Save %</div>
      </div>
      <div className="col-span-2 flex flex-col items-center">
        <div className="text-lg font-bold">{team.teamTotals.shutouts}</div>
        <div className="text-sm font-light">Shutouts</div>
      </div>
    </div>
  );

  const renderGoaltender = ({ goaltender }) => {
    return (
      <div className="border grid grid-cols-12 mb-3 py-2 items-center">
        <div className="col-span-4 p-2 flex">
          <Headshot
            playerId={goaltender.playerId}
            src={goaltender.headshot}
            alt={`${goaltender.firstName.default} ${goaltender.lastName.default}`}
            className="mr-2 hidden md:block"
            size="4"
          />
          <div className="mx-1">
            <div>{goaltender.firstName.default}</div>
            <div className="font-bold">{goaltender.lastName.default}</div>
            <div className="text-sm">#{goaltender.sweaterNumber} • {goaltender.positionCode}</div>
          </div>
        </div>
        <div className="col-span-2 flex flex-col items-center">
          <div className="text-lg font-bold">{formatStat(goaltender.record)}</div>
          <div className="text-sm font-light">Record</div>
        </div>
        <div className="col-span-2 flex flex-col items-center">
          <div className="text-lg font-bold">{formatStat(goaltender.gaa, 3)}</div>
          <div className="text-sm font-light">GAA</div>
        </div>
        <div className="col-span-2 flex flex-col items-center">
          <div className="text-lg font-bold">{formatStat(goaltender.savePctg, 3)}</div>
          <div className="text-sm font-light">Save %</div>
        </div>
        <div className="col-span-2 flex flex-col items-center">
          <div className="text-lg font-bold">{formatStat(goaltender.shutouts)}</div>
          <div className="text-sm font-light">Shutouts</div>
        </div>
      </div>
    );
  };

  return (
    <div className="my-5">
      <div className="flex justify-between">
        <div className="">
          <TeamLogo
            team={awayTeam.abbrev}
            src={logos[awayTeam.abbrev]}
            alt={awayTeam.name.default}
            className="w-20 h-20 mx-auto mb-2"
          />
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold underline">Players to Watch</div>
          <div className="text-xl">{STAT_CONTEXT[matchup.teamLeaders?.context] || matchup.teamLeaders?.context}</div>
        </div>
        <div className="">
          <TeamLogo
            team={homeTeam.abbrev}
            src={logos[homeTeam.abbrev]}
            alt={homeTeam.name.default}
            className="w-20 h-20 mx-auto mb-2"
          />
        </div>
      </div>
      {matchup.teamLeaders?.leaders.map((leader) => (
        <div key={leader.category} className="border grid grid-cols-12 mb-3 py-2 items-center">
          <div className="col-span-3 p-2 flex">
            <Headshot
              playerId={leader.awayLeader.playerId}
              src={leader.awayLeader.headshot}
              alt={`${leader.awayLeader.firstName.default} ${leader.awayLeader.lastName.default}`}
              size="4"
              className="mr-2 hidden md:block"
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
            <Headshot
              playerId={leader.homeLeader.playerId}
              src={leader.homeLeader.headshot}
              alt={`${leader.homeLeader.firstName.default} ${leader.homeLeader.lastName.default}`}
              size="4"
              className="ml-2 hidden md:block"
            />
          </div>
        </div>
      ))}

      <div className="my-5">
        <div className="text-3xl font-bold underline my-3 text-center">Goalie Comparison</div>

        {/* Away Team */}
        <div>
          {renderTeamTotals({team: matchup.goalieComparison.awayTeam, teamAbbrev: awayTeam.abbrev})}
          {matchup.goalieComparison.awayTeam.leaders.map((goaltender) => (
            <div key={goaltender.playerId}>
              {renderGoaltender({goaltender})}
            </div>
          ))}
        </div>

        {/* Home Team */}
        <div>
          {renderTeamTotals({team: matchup.goalieComparison.homeTeam, teamAbbrev: homeTeam.abbrev})}
          {matchup.goalieComparison.homeTeam.leaders.map((goaltender) => (
            <div key={goaltender.playerId}>
              {renderGoaltender({goaltender})}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <div className="text-3xl font-bold underline">Team Stats</div>
        <div>
          <div className="flex space-x-0">
            <button
              className={`flex gap-1 items-center text-sm p-2 border border-e-0 rounded-l-md ${activeStatTeam === 'awayTeam' ? 'text-black dark:text-white bg-slate-200 dark:bg-slate-800' : ''}`}
              onClick={() => handleStatTeamClick('awayTeam')}
            >
              <TeamLogo
                src={logos[awayTeam.abbrev]}
                alt={awayTeam.name.default}
                className="w-6 h-6"
              />
              <div>
                {awayTeam.placeName.default} <strong>{awayTeam.name.default.replace(awayTeam.placeName.default, '')}</strong>
              </div>
            </button>
            <button
              className={`flex gap-1 items-center text-sm p-2 border rounded-r-md ${activeStatTeam === 'homeTeam' ? 'text-black dark:text-white bg-slate-200 dark:bg-slate-800' : ''}`}
              onClick={() => handleStatTeamClick('homeTeam')}
            >
              <TeamLogo
                src={logos[homeTeam.abbrev]}
                alt={homeTeam.name.default}
                className="w-6 h-6"
              />
              <div>
                {homeTeam.placeName.default} <strong>{homeTeam.name.default.replace(homeTeam.placeName.default, '')}</strong>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div id="awayTeamStats" className={`${activeStatTeam === 'awayTeam' ? '' : 'hidden'} my-5`}>
        <div className="font-bold my-2">Forwards</div>
        <StatsTable stats={skaterSeasonStats.filter((t) => t.teamId === awayTeam.id && t.position !== 'D')} />
        <div className="font-bold my-2">Defensemen</div>
        <StatsTable stats={skaterSeasonStats.filter((t) => t.teamId === awayTeam.id && t.position === 'D')} />
        <div className="font-bold my-2">Goalies</div>
        <StatsTable stats={goalieSeasonStats.filter((t) => t.teamId === awayTeam.id)} />
      </div>

      <div id="homeTeamStats" className={`${activeStatTeam === 'homeTeam' ? '' : 'hidden'} my-5`}>
        <div className="font-bold my-2">Forwards</div>
        <StatsTable stats={skaterSeasonStats.filter((t) => t.teamId === homeTeam.id && t.position !== 'D')} />
        <div className="font-bold my-2">Defensemen</div>
        <StatsTable stats={skaterSeasonStats.filter((t) => t.teamId === homeTeam.id && t.position === 'D')} />
        <div className="font-bold my-2">Goalies</div>
        <StatsTable stats={goalieSeasonStats.filter((t) => t.teamId === homeTeam.id)} />
      </div>
    </div>
  );
};

PreGameSummary.propTypes = {
  game: PropTypes.object.isRequired,
};

export default PreGameSummary;
