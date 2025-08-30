import React from 'react';
import GameTile from '@/app/components/GameTile';
import StatsTable from '@/app/components/StatsTable';
import TeamLogo from '@/app/components/TeamLogo';
import { getTeamDataByAbbreviation, getTeamDataBySlug } from '@/app/utils/teamData';
import {
  formatOrdinalNumber,
  formatStat,
  formatTextColorByBackgroundColor,
} from '@/app/utils/formatters';
import type { TeamSlugParam } from '@/app/types/routeParams';
import StoryCard from '@/app/components/StoryCard';
import TeamSchedule from '@/app/components/TeamSchedule';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faNewspaper } from '@fortawesome/free-solid-svg-icons';

export const metadata = {
  title: 'Team Schedule & Stats',
  description: 'View the schedule and stats for a team in the NHL.',
};

// Deliberately avoid strict typing on route params due to Next.js build-time PageProps typing expectations
// (can be a plain object or promise-like depending on internal inference). We unwrap defensively below.

// Flexible interfaces (avoid over-fitting to upstream API)
interface TeamStanding {
  conferenceSequence?: number;
  conferenceName?: string;
  divisionSequence?: number;
  divisionName?: string;
  gamesPlayed?: number;
  wins?: number;
  losses?: number;
  otLosses?: number;
  points?: number;
  pointPctg?: number;
  regulationWins?: number;
  regulationPlusOtWins?: number;
  goalFor?: number;
  goalAgainst?: number;
  goalDifferential?: number;
  homeWins?: number;
  homeLosses?: number;
  homeOtLosses?: number;
  roadWins?: number;
  roadLosses?: number;
  roadOtLosses?: number;
  shootoutWins?: number;
  shootoutLosses?: number;
  l10Wins?: number;
  l10Losses?: number;
  l10OtLosses?: number;
  streakCode?: string;
  streakCount?: number;
  teamAbbrev?: { default: string } | string;
  [k: string]: any;
}

interface NewsItem {
  _entityId: string | number;
  slug: string;
  [k: string]: any;
}

export default async function SchedulePage(props: any) {
  const rawParams = (await props?.params) as TeamSlugParam | Promise<TeamSlugParam>;
  const { slug } = await rawParams;
  let team = getTeamDataByAbbreviation(slug?.toUpperCase(), true);
  if (!team.teamId || team.abbreviation === 'NHL') {
    team = getTeamDataBySlug(slug, true);
  }

  if (!team.teamId || team.abbreviation === 'NHL') {
    return (
      <div className="py-10 text-center text-2xl" style={{ minHeight: '60vh' }}>
        Team not found matching {slug}.
      </div>
    );
  }

  let headerStyle: React.CSSProperties = {};
  if (team.teamColor) {
    headerStyle = {
      backgroundColor: team.teamColor,
      color: formatTextColorByBackgroundColor(team.teamColor),
    };
  }

  metadata.title = `${team.name} - Stats & Schedule`;

  const [
    teamStatsResponse,
    standingsResponse,
    scheduleResponse,
    fullSeasonScheduleResponse,
    newsResponse,
  ] = await Promise.all([
    fetch(`https://api-web.nhle.com/v1/club-stats/${team.abbreviation}/now`, { cache: 'no-store' }),
    fetch('https://api-web.nhle.com/v1/standings/now', { cache: 'no-store' }),
    fetch(`https://api-web.nhle.com/v1/scoreboard/${team.abbreviation}/now`, { cache: 'no-store' }),
    fetch(`https://api-web.nhle.com/v1/club-schedule-season/${team.abbreviation}/now`, {
      cache: 'no-store',
    }),
    fetch(
      `https://forge-dapi.d3.nhle.com/v2/content/en-us/stories?tags.slug=teamid-${team.teamId}&context.slug=teamid-${team.teamId}&$limit=8`,
      { cache: 'no-store' }
    ),
  ]);

  const schedule = await scheduleResponse.json();
  const standings = await standingsResponse.json();
  const fullSeasonSchedule = await fullSeasonScheduleResponse.json();
  const teamStats = await teamStatsResponse.json();
  const news = await newsResponse.json();

  const teamStanding: TeamStanding | undefined = standings.standings.find(
    (standing: TeamStanding) => {
      const abbrev =
        typeof standing.teamAbbrev === 'string'
          ? standing.teamAbbrev
          : standing.teamAbbrev?.default;

      return abbrev === team.abbreviation.toUpperCase();
    }
  );

  return (
    <div className="container mx-auto px-2 py-8">
      <div
        style={{
          backgroundColor: team.teamColor,
          borderWidth: 4,
          borderColor: team.secondaryTeamColor,
        }}
        className="mb-5 flex items-center rounded-xl"
      >
        <div className="p-5">
          <h1
            className="text-3xl font-bold mb-3"
            style={{ color: formatTextColorByBackgroundColor(team.teamColor) }}
          >
            {team.name}
          </h1>
          {teamStanding && (
            <div
              className="flex gap-2"
              style={{ color: formatTextColorByBackgroundColor(team.teamColor) }}
            >
              <div className="">
                {formatOrdinalNumber(teamStanding.conferenceSequence)} {teamStanding.conferenceName}{' '}
                Conference
              </div>
              <div className="hidden sm:block">•</div>
              <div className="">
                {formatOrdinalNumber(teamStanding.divisionSequence)} {teamStanding.divisionName}{' '}
                Division
              </div>
            </div>
          )}
        </div>
        <TeamLogo
          src={`https://assets.nhle.com/logos/nhl/svg/${team.abbreviation}_dark.svg`}
          className="w-64 h-64 mx-auto hidden md:block"
          colorMode="dark"
        />
        <h1
          className="text-5xl font-bold opacity-25 p-5 italic hidden lg:block"
          style={{ color: formatTextColorByBackgroundColor(team.teamColor) }}
        >
          #{team.hashtag}
        </h1>
      </div>

      {teamStanding && (
        <div className="mb-5 overflow-x-scroll scrollbar-hidden">
          <div className="flex flex-row mb-5 gap-2">
            {(
              [
                { label: 'Games Played', value: teamStanding.gamesPlayed },
                {
                  label: 'Overall Record',
                  value: `${teamStanding.wins}-${teamStanding.losses}-${teamStanding.otLosses}`,
                },
                { label: 'Points', value: teamStanding.points },
                { label: 'Points %', value: formatStat(teamStanding.pointPctg, 3) },
                { label: 'Regulation Wins', value: teamStanding.regulationWins },
                { label: 'R+OT Wins', value: teamStanding.regulationPlusOtWins },
                { label: 'Goals For', value: teamStanding.goalFor },
                { label: 'Goals Against', value: teamStanding.goalAgainst },
                { label: 'Goal Differential', value: teamStanding.goalDifferential },
                {
                  label: 'Home Record',
                  value: `${teamStanding.homeWins}-${teamStanding.homeLosses}-${teamStanding.homeOtLosses}`,
                },
                {
                  label: 'Road Record',
                  value: `${teamStanding.roadWins}-${teamStanding.roadLosses}-${teamStanding.roadOtLosses}`,
                },
                {
                  label: 'Shootout Record',
                  value: `${teamStanding.shootoutWins}-${teamStanding.shootoutLosses}`,
                },
                {
                  label: 'Last 10 Record',
                  value: `${teamStanding.l10Wins}-${teamStanding.l10Losses}-${teamStanding.l10OtLosses}`,
                },
                { label: 'Streak', value: `${teamStanding.streakCode}${teamStanding.streakCount}` },
              ] as const
            ).map((stat, i) => (
              <div
                key={i}
                className="flex flex-col p-2 bg-transparent text-center border rounded content-center"
                style={{ minWidth: '7rem' }}
              >
                <div className="text-2xl capitalize">{stat.value}</div>
                <div className="text-xs font-light">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="my-3 text-center text-xs">
        <Link href={`https://nhl.com/${team.slug}`} className="underline font-bold">
          <FontAwesomeIcon icon={faGlobe} fixedWidth className="mr-1" />
          Official Website
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Recent &amp; Upcoming Games</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
        {schedule.gamesByDate?.map((date: any) =>
          date.games.map((game: any) => <GameTile key={game.id} game={game} />)
        )}
        {schedule.gamesByDate?.length === 0 && <div className="text-2xl">No upcoming games</div>}
      </div>

      {news.items?.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold mb-4">Latest News</h1>
            <Link className="block text-sm" href={`/news/topic/teamid-${team.teamId}`}>
              <FontAwesomeIcon icon={faNewspaper} fixedWidth />{' '}
              <span className="font-bold underline">Team News</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
            {news.items.map((item: any) => {
              const enriched: NewsItem = { slug: item.slug || String(item._entityId), ...item };

              return <StoryCard key={enriched._entityId} item={enriched} showDate />;
            })}
          </div>
        </>
      )}

      <h1 className="text-3xl font-bold mb-6">Team Stats</h1>
      <div className="mb-5">
        <div className="font-bold my-2">Forwards</div>
        <StatsTable
          stats={teamStats.skaters.filter((t: any) => t.positionCode !== 'D')}
          team={team.abbreviation}
        />
        <div className="font-bold my-2">Defensemen</div>
        <StatsTable
          stats={teamStats.skaters.filter((t: any) => t.positionCode === 'D')}
          team={team.abbreviation}
        />
        <div className="font-bold my-2">Goalies</div>
        <StatsTable stats={teamStats.goalies} team={team.abbreviation} />
      </div>

      <h1 className="text-3xl font-bold mb-6">Season Schedule</h1>

      <TeamSchedule team={team} fullSeasonSchedule={fullSeasonSchedule} headerStyle={headerStyle} />
    </div>
  );
}
