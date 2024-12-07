import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import GameTile from '@/app/components/GameTile';
import StatsTable from '@/app/components/StatsTable';
import TeamLogo from '@/app/components/TeamLogo';
import { PropTypes } from 'prop-types';
import { getTeamDataByAbbreviation } from '@/app/utils/teamData';
import { formatBroadcasts, formatGameDate, formatGameTime, formatOrdinalNumber, formatStat, formatTextColorByBackgroundColor } from '@/app/utils/formatters';
import Image from 'next/image';
import Link from 'next/link';

dayjs.extend(utc);
dayjs.extend(timezone);

export const metadata = {
  title: 'Team Schedule & Stats',
  description: 'View the schedule and stats for a team in the NHL.',
};

export default async function SchedulePage({ params }) {
  const { slug } = await params;
  const team = getTeamDataByAbbreviation(slug?.toUpperCase());

  if (!team) {
    return <div className="p-5 text-center text-2xl">
      Team not found!
    </div>;
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
  const newsResponse = await fetch(`https://forge-dapi.d3.nhle.com/v2/content/en-us/stories?tags.slug=teamid-${team.teamId}&context.team.abbreviation=nhl`, { cache: 'no-store' });

  const schedule = await scheduleResponse.json();
  const standings = await standingsResponse.json();
  const fullSeasonSchedule = await fullSeasonScheduleResponse.json();
  const teamStats = await teamStatsResponse.json();
  const news = await newsResponse.json();

  const teamStanding = standings.standings.find((standing) => standing.teamAbbrev.default === team.abbreviation.toUpperCase());

  return (
    <div className="container mx-auto px-4 py-8">
      <div style={{ backgroundColor: team.teamColor }} className="mb-5 flex items-center rounded-xl">
        <div className="p-5">
          <h1 className="text-3xl font-bold mb-3" style={{ color: formatTextColorByBackgroundColor(team.teamColor) }}>{team.name}</h1>
          <div className="flex gap-2">
            <div className="">{formatOrdinalNumber(teamStanding.conferenceSequence)} {teamStanding.conferenceName} Conference</div>
            <div className="hidden sm:block">•</div>
            <div className="">{formatOrdinalNumber(teamStanding.divisionSequence)} {teamStanding.divisionName} Division</div>
          </div>
        </div>
        <TeamLogo
          src={`https://assets.nhle.com/logos/nhl/svg/${team.abbreviation}_dark.svg`}
          className="w-64 h-64 mx-auto hidden md:block"
        />
        <h1 className="text-5xl font-bold opacity-25 p-5 italic hidden lg:block">#{team.hashtag}</h1>
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
            {/* Shootout Record */}
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
          <h1 className="text-3xl font-bold mb-6">News</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
            {news.items.slice(0, 8).map((item) => (
              <div key={item.id} className="mb-4">
                <Link href={`https://nhl.com/news/${item.slug}`} className="">
                  <Image src={item.thumbnail.thumbnailUrl} width="416" height="416" alt="Story Photo" className="mb-2" />
                </Link>
                <p className="text-sm opacity-50">{dayjs(item.contentDate).format('M/D/YYYY')}</p>
                <Link href={`https://nhl.com/news/${item.slug}`} className="">
                  <h2 className="text-xl font-bold">{item.headline}</h2>
                </Link>
                <p className="text-justify line-clamp-4">{item.summary}</p>
                <Link href={`https://nhl.com/news/${item.slug}`} className="block font-bold py-3 underline">Read Story</Link>
              </div>
            ))}
          </div>
        </>
      )}


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
      
      <div className="overflow-x-auto">
        <table className="statsTable">
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
                <td>{formatGameDate(game.startTimeUTC)} {formatGameTime(game.startTimeUTC)}</td>
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
                </td>
                <td>
                  {(game.gameState === 'OFF' || game.gameState === 'FINAL') && (
                    <Link href={`/game/${game.id}`} className="underline">
                      {game.awayTeam.abbrev} {game.awayTeam.score}-{game.homeTeam.score} {game.homeTeam.abbrev}
                    </Link>
                  )}
                  {game.gameScheduleState	 === 'CNCL' && (
                    <span className="p-1 text-xs border rounded">Canceled</span>
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
    </div>
  );
}

SchedulePage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
