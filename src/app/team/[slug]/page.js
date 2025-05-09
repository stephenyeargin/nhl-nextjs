import React from 'react';
import GameTile from '@/app/components/GameTile';
import StatsTable from '@/app/components/StatsTable';
import TeamLogo from '@/app/components/TeamLogo';
import { PropTypes } from 'prop-types';
import { getTeamDataByAbbreviation, getTeamDataBySlug } from '@/app/utils/teamData';
import { formatOrdinalNumber, formatStat, formatTextColorByBackgroundColor } from '@/app/utils/formatters';
import StoryCard from '@/app/components/StoryCard';
import TeamSchedule from '@/app/components/TeamSchedule';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faNewspaper } from '@fortawesome/free-solid-svg-icons';

export const metadata = {
  title: 'Team Schedule & Stats',
  description: 'View the schedule and stats for a team in the NHL.',
};

export default async function SchedulePage({ params }) {
  const { slug } = await params;
  let team = getTeamDataByAbbreviation(slug?.toUpperCase(), true);
  if (!team.teamId || team.abbreviation === 'NHL') {
    team = getTeamDataBySlug(slug);
  }

  if (!team.teamId || team.abbreviation === 'NHL') {
    return (
      <div className="py-10 text-center text-2xl" style={{ minHeight: '60vh'}}>
        Team not found matching {slug}.
      </div>
    );
  }

  let headerStyle = {};
  if (team.teamColor) {
    headerStyle = { backgroundColor: team.teamColor, color: formatTextColorByBackgroundColor(team.teamColor) };
  }

  metadata.title = `${team.name} - Stats & Schedule`;

  const teamStatsResponse = await fetch(`https://api-web.nhle.com/v1/club-stats/${team.abbreviation}/now`, { cache: 'no-store' });
  const standingsResponse = await fetch('https://api-web.nhle.com/v1/standings/now', { cache: 'no-store' });
  const scheduleResponse = await fetch(`https://api-web.nhle.com/v1/scoreboard/${team.abbreviation}/now`, { cache: 'no-store' });
  const fullSeasonScheduleResponse = await fetch(`https://api-web.nhle.com/v1/club-schedule-season/${team.abbreviation}/now`, { cache: 'no-store' });
  const newsResponse = await fetch(`https://forge-dapi.d3.nhle.com/v2/content/en-us/stories?tags.slug=teamid-${team.teamId}&context.slug=teamid-${team.teamId}&$limit=8`, { cache: 'no-store' });

  const schedule = await scheduleResponse.json();
  const standings = await standingsResponse.json();
  const fullSeasonSchedule = await fullSeasonScheduleResponse.json();
  const teamStats = await teamStatsResponse.json();
  const news = await newsResponse.json();

  const teamStanding = standings.standings.find((standing) => standing.teamAbbrev.default === team.abbreviation.toUpperCase());

  return (
    <div className="container mx-auto px-2 py-8">
      <div style={{ backgroundColor: team.teamColor, borderWidth: 4, borderColor: team.secondaryTeamColor }} className="mb-5 flex items-center rounded-xl">
        <div className="p-5">
          <h1 className="text-3xl font-bold mb-3" style={{ color: formatTextColorByBackgroundColor(team.teamColor) }}>{team.name}</h1>
          <div className="flex gap-2" style={{ color: formatTextColorByBackgroundColor(team.teamColor) }}>
            <div className="">{formatOrdinalNumber(teamStanding.conferenceSequence)} {teamStanding.conferenceName} Conference</div>
            <div className="hidden sm:block">•</div>
            <div className="">{formatOrdinalNumber(teamStanding.divisionSequence)} {teamStanding.divisionName} Division</div>
          </div>
        </div>
        <TeamLogo
          src={`https://assets.nhle.com/logos/nhl/svg/${team.abbreviation}_dark.svg`}
          className="w-64 h-64 mx-auto hidden md:block"
          colorMode="dark"
        />
        <h1 className="text-5xl font-bold opacity-25 p-5 italic hidden lg:block"style={{ color: formatTextColorByBackgroundColor(team.teamColor)}}>#{team.hashtag}</h1>
      </div>

      {teamStanding && (
        <div className="mb-5 overflow-x-scroll scrollbar-hidden">
          <div className="flex flex-row mb-5 gap-2">
            <div className="flex flex-col p-2 bg-transparent text-center border rounded content-center" style={{minWidth: '7rem'}}>
              <div className="text-2xl capitalize">{teamStanding.gamesPlayed}</div>
              <div className="text-xs font-light">Games Played</div>
            </div>
            <div className="flex flex-col p-2 bg-transparent text-center border rounded content-center" style={{minWidth: '7rem'}}>
              <div className="text-2xl capitalize">{teamStanding.wins}-{teamStanding.losses}-{teamStanding.otLosses}</div>
              <div className="text-xs font-light">Overall Record</div>
            </div>
            <div className="flex flex-col p-2 bg-transparent text-center border rounded content-center" style={{minWidth: '7rem'}}>
              <div className="text-2xl capitalize">{teamStanding.points}</div>
              <div className="text-xs font-light">Points</div>
            </div>
            <div className="flex flex-col p-2 bg-transparent text-center border rounded content-center" style={{minWidth: '7rem'}}>
              <div className="text-2xl capitalize">{formatStat(teamStanding.pointPctg, 3)}</div>
              <div className="text-xs font-light">Points %</div>
            </div>
            <div className="flex flex-col p-2 bg-transparent text-center border rounded content-center" style={{minWidth: '7rem'}}>
              <div className="text-2xl capitalize">{teamStanding.regulationWins}</div>
              <div className="text-xs font-light">Regulation Wins</div>
            </div>
            <div className="flex flex-col p-2 bg-transparent text-center border rounded content-center" style={{minWidth: '7rem'}}>
              <div className="text-2xl capitalize">{teamStanding.regulationPlusOtWins}</div>
              <div className="text-xs font-light">R+OT Wins</div>
            </div>
            <div className="flex flex-col p-2 bg-transparent text-center border rounded content-center" style={{minWidth: '7rem'}}>
              <div className="text-2xl capitalize">{teamStanding.goalFor}</div>
              <div className="text-xs font-light">Goals For</div>
            </div>
            <div className="flex flex-col p-2 bg-transparent text-center border rounded content-center" style={{minWidth: '7rem'}}>
              <div className="text-2xl capitalize">{teamStanding.goalAgainst}</div>
              <div className="text-xs font-light">Goals Against</div>
            </div>
            <div className="flex flex-col p-2 bg-transparent text-center border rounded content-center" style={{minWidth: '7rem'}}>
              <div className="text-2xl capitalize">{teamStanding.goalDifferential}</div>
              <div className="text-xs font-light">Goal Differential</div>
            </div>
            <div className="flex flex-col p-2 bg-transparent text-center border rounded content-center" style={{minWidth: '7rem'}}>
              <div className="text-2xl capitalize">{teamStanding.homeWins}-{teamStanding.homeLosses}-{teamStanding.homeOtLosses}</div>
              <div className="text-xs font-light">Home Record</div>
            </div>
            <div className="flex flex-col p-2 bg-transparent text-center border rounded content-center" style={{minWidth: '7rem'}}>
              <div className="text-2xl capitalize">{teamStanding.roadWins}-{teamStanding.roadLosses}-{teamStanding.roadOtLosses}</div>
              <div className="text-xs font-light">Road Record</div>
            </div>
            <div className="flex flex-col p-2 bg-transparent text-center border rounded content-center" style={{minWidth: '7rem'}}>
              <div className="text-2xl capitalize">{teamStanding.shootoutWins}-{teamStanding.shootoutLosses}</div>
              <div className="text-xs font-light">Shootout Record</div>
            </div>
            <div className="flex flex-col p-2 bg-transparent text-center border rounded content-center" style={{minWidth: '7rem'}}>
              <div className="text-2xl capitalize">{teamStanding.l10Wins}-{teamStanding.l10Losses}-{teamStanding.l10OtLosses}</div>
              <div className="text-xs font-light">Last 10 Record</div>
            </div>
            <div className="flex flex-col p-2 bg-transparent text-center border rounded content-center" style={{minWidth: '7rem'}}>
              <div className="text-2xl capitalize">{teamStanding.streakCode}{teamStanding.streakCount}</div>
              <div className="text-xs font-light">Streak</div>
            </div>
          </div>
        </div>
      )}

      <div className="my-3 text-center text-xs">
        <Link href={`https://nhl.com/${team.slug}`} className="underline font-bold"><FontAwesomeIcon icon={faGlobe} fixedWidth className="mr-1" />Official Website</Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Recent &amp; Upcoming Games</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
        {schedule.gamesByDate?.map((date) => (
          date.games.map((game) => (
            <GameTile key={game.id} game={game} />
          ))
        ))}
        {schedule.gamesByDate?.length === 0 && <div className="text-2xl">No upcoming games</div>}
      </div>

      {news.items?.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold mb-4">Latest News</h1>
            <Link className="block text-sm" href={`/news/topic/teamid-${team.teamId}`}><FontAwesomeIcon icon={faNewspaper} fixedWidth /> <span className="font-bold underline">Team News</span></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
            {news.items.map((item) => (
              <StoryCard key={item._entityId} item={item} showDate />
            ))}
          </div>
        </>
      )}

      <h1 className="text-3xl font-bold mb-6">Team Stats</h1>
      <div className="mb-5">
        <div className="font-bold my-2">Forwards</div>
        <StatsTable stats={teamStats.skaters.filter((t) => t.positionCode !== 'D')} team={team.abbreviation} />
        <div className="font-bold my-2">Defensemen</div>
        <StatsTable stats={teamStats.skaters.filter((t) => t.positionCode === 'D')} team={team.abbreviation} />
        <div className="font-bold my-2">Goalies</div>
        <StatsTable stats={teamStats.goalies} team={team.abbreviation} />
      </div>

      <h1 className="text-3xl font-bold mb-6">Season Schedule</h1>

      <TeamSchedule team={team} fullSeasonSchedule={fullSeasonSchedule} headerStyle={headerStyle} />
    </div>
  );
}

SchedulePage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
