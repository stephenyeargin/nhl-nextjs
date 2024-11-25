import React from 'react';
import GameTile from '@/app/components/GameTile';
import StatsTable from '@/app/components/StatsTable';
import TeamLogo from '@/app/components/TeamLogo';
import { PropTypes } from 'prop-types';
import { getTeamDataByAbbreviation } from '@/app/utils/teamData';
import { formatTextColorByBackgroundColor } from '@/app/utils/formatters';

export const metadata = {
  title: 'Team Schedule & Stats',
  description: 'View the schedule and stats for a team in the NHL.',
};

export default async function SchedulePage({ params }) {
  const { slug } = await params;
  const team = getTeamDataByAbbreviation(slug);

  if (!team) {
    return <div className="p-5 text-center text-2xl">
      Team not found!
    </div>;
  }

  metadata.title = `${team.name} - Stats & Schedule`;

  const teamStatsResponse = await fetch(`https://api-web.nhle.com/v1/club-stats/${slug}/now`, { cache: 'no-store' });
  const scheduleResponse = await fetch(`https://api-web.nhle.com/v1/club-schedule-season/${slug}/now`, { cache: 'no-store' });

  const schedule = await scheduleResponse.json();
  const teamStats = await teamStatsResponse.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <div style={{ backgroundColor: team.teamColor }} className="mb-5 flex items-center rounded-xl">
        <h1 className="text-3xl font-bold p-5" style={{ color: formatTextColorByBackgroundColor(team.teamColor) }}>{team.name}</h1>
        <TeamLogo
          src={`https://assets.nhle.com/logos/nhl/svg/${slug}_dark.svg`}
          className="w-64 h-64 mx-auto"
        />
      </div>

      <h1 className="text-3xl font-bold mb-6">Team Stats</h1>
      <div className="mb-5">
        <div className="font-bold my-2">Forwards</div>
        <StatsTable stats={teamStats.skaters.filter((t) => t.positionCode !== 'D')} teamColor={team.teamColor} />
        <div className="font-bold my-2">Defensemen</div>
        <StatsTable stats={teamStats.skaters.filter((t) => t.positionCode === 'D')} teamColor={team.teamColor} />
        <div className="font-bold my-2">Goalies</div>
        <StatsTable stats={teamStats.goalies} teamColor={team.teamColor} />
      </div>

      <h1 className="text-3xl font-bold mb-6">Season Schedule</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {schedule.games.map((game) => (
          <GameTile key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}

SchedulePage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
