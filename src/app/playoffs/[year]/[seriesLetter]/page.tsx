import React from 'react';
import type { SeriesParam } from '@/app/types/routeParams';
import Image from 'next/image';
import GameTile from '@/app/components/GameTile';
import { notFound } from 'next/navigation';
import TeamLogo from '@/app/components/TeamLogo';
import Link from 'next/link';
import { getTeamDataByAbbreviation } from '@/app/utils/teamData';
import StoryCard from '@/app/components/StoryCard';

interface FetchResult<T> {
  data?: T;
  error?: number;
}

async function fetchData<T>(url: string, seriesString: string): Promise<FetchResult<T>> {
  const extractSeriesLetter = /(?:series-)?([a-z])(?:-coverage)?/i;
  const match = seriesString.match(extractSeriesLetter);
  if (!match || !match[1]) {
    return { error: 404 };
  }
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (res.status === 404) {
      return { error: 404 };
    }
    if (!res.ok) {
      return { error: 500 };
    }
    const data = await res.json();

    return { data };
  } catch {
    return { error: 500 };
  }
}

async function fetchSeriesData(seriesString: string, year: number) {
  const seriesLetter = seriesString.match(/(?:series-)?([a-z])(?:-coverage)?/i)?.[1]?.toLowerCase();
  const url = `https://api-web.nhle.com/v1/schedule/playoff-series/${year - 1}${year}/${seriesLetter}/`;

  return fetchData<any>(url, seriesString);
}

async function fetchRelatedStories(seriesString: string, year: number) {
  const seriesLetter = seriesString.match(/(?:series-)?([a-z])(?:-coverage)?/i)?.[1]?.toLowerCase();
  const url = `https://forge-dapi.d3.nhle.com/v2/content/en-us/stories?tags.slug=${year - 1}-${String(year).slice(-2)}&tags.slug=series-${seriesLetter}&context.slug=nhl`;

  return fetchData<any>(url, seriesString);
}

export default async function SeriesPage(props: any) {
  const resolved = (await props?.params) as SeriesParam | Promise<SeriesParam>;
  const { seriesLetter, year } = await resolved;
  const seriesResponse = await fetchSeriesData(seriesLetter, Number(year));
  const relatedStoriesResponse = await fetchRelatedStories(seriesLetter, Number(year));

  if (seriesResponse.error === 404) {
    return notFound();
  }
  if (seriesResponse.error === 500) {
    throw new Error('Failed to load series data');
  }

  const series = seriesResponse.data;
  const relatedStories = relatedStoriesResponse?.data || { items: [] };
  const { topSeedTeam, bottomSeedTeam, games, seriesLogo, roundLabel, roundAbbrev } = series;

  topSeedTeam.data = getTeamDataByAbbreviation(topSeedTeam.abbrev, false);
  bottomSeedTeam.data = getTeamDataByAbbreviation(bottomSeedTeam.abbrev, true);

  const logos: Record<string | number, string> = {
    [topSeedTeam.id]: topSeedTeam.logo,
    [bottomSeedTeam.id]: bottomSeedTeam.logo,
  };

  const seriesTitles: Record<string, string> = {
    'nhl-semifinal': 'NHL Semifinal',
  };

  const seriesHeaderStyle: React.CSSProperties = { background: 'var(--background)' };
  seriesHeaderStyle.borderLeft = `solid 10px ${topSeedTeam.data.teamColor}`;
  seriesHeaderStyle.borderRight = `solid 10px ${bottomSeedTeam.data.teamColor}`;

  return (
    <main className="max-w-4xl mx-auto px-2 pb-10">
      {seriesLogo && (
        <div className="p-5 rounded-xl" style={{ backgroundColor: '#121212' }}>
          <Link href={`/playoffs/${year}`}>
            <Image
              src={seriesLogo}
              alt="Series Logo"
              width={1024}
              height={1024}
              className="h-auto w-auto"
            />
          </Link>
        </div>
      )}

      <div
        className="grid grid-cols-12 my-5 border rounded-lg shadow-xs py-4 items-center"
        style={seriesHeaderStyle}
      >
        <div className="col-span-3 flex mx-auto gap-2 items-center justify-center">
          <div>
            <TeamLogo
              team={topSeedTeam.abbrev}
              src={topSeedTeam.logo}
              alt={topSeedTeam.name?.default}
              className="w-20 h-20 mx-auto"
            />
          </div>
          <div>
            <Link href={`/team/${topSeedTeam.abbrev}`}>
              <div className="text-xl font-black block md:hidden">{topSeedTeam.abbrev}</div>
              <div className="text-lg hidden md:block">
                <div className="text-sm">{topSeedTeam.placeName?.default}</div>
                <div className="text-lg font-black">
                  {topSeedTeam.name?.default.replace(topSeedTeam.placeName?.default, '')}
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div
          className={`col-span-2 flex flex-wrap justify-center items-center text-center text-5xl md:text-7xl font-black ${bottomSeedTeam.seriesWins === series.neededToWin && series.neededToWin ? 'opacity-50' : ''}`}
        >
          {topSeedTeam.seriesWins}
        </div>
        <div className="col-span-2 text-center content-middle">
          <span className="block md:hidden font-bold capitalize">{roundAbbrev}</span>
          <span className="hidden md:block font-bold capitalize">
            {seriesTitles[roundLabel] || roundLabel.replace(/-/g, ' ')}
          </span>
          <span className="block text-sm">
            Best of {series.length || series.neededToWin * 2 - 1}
          </span>
        </div>
        <div
          className={`col-span-2 flex flex-wrap justify-center items-center text-center text-5xl md:text-7xl font-black ${topSeedTeam.seriesWins === series.neededToWin && series.neededToWin ? 'opacity-50' : ''}`}
        >
          {bottomSeedTeam.seriesWins}
        </div>
        <div className="col-span-3 flex mx-auto gap-2 items-center justify-center">
          <div className="text-right order-2 sm:order-1">
            <Link href={`/team/${bottomSeedTeam.abbrev}`}>
              <div className="text-xl font-black block md:hidden">{bottomSeedTeam.abbrev}</div>
              <div className="text-lg hidden md:block">
                <div className="text-sm">{bottomSeedTeam.placeName?.default}</div>
                <div className="text-lg font-black">
                  {bottomSeedTeam.name?.default?.replace(bottomSeedTeam.placeName?.default, '')}
                </div>
              </div>
            </Link>
          </div>
          <div className="text-right order-1 sm:order-2">
            <TeamLogo
              team={bottomSeedTeam.abbrev}
              src={bottomSeedTeam.logo}
              alt={bottomSeedTeam.name?.default}
              className="w-20 h-20 mx-auto"
            />
          </div>
        </div>
      </div>

      <div className="text-center my-5">
        <Link href={`/playoffs/${year}`} className="font-bold underline">
          &laquo; Back to Playoffs
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {games.length > 0 ? (
          games.map((game: any, i: number) => <GameTile key={i} game={game} logos={logos} />)
        ) : (
          <div className="col-span-1 md:col-span-2">
            <div className="text-center font-bold py-20">
              There are no games scheduled for this series yet.
            </div>
          </div>
        )}
      </div>

      {relatedStories.items?.length > 0 && (
        <div className="my-5">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold mb-4">Series Coverage</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {relatedStories.items.map((item: any) => (
              <div key={item._entityId} className="col-span-4 md:col-span-1">
                <StoryCard item={item} showDate />
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
