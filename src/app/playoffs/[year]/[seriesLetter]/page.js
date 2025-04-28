import React from 'react';
import Image from 'next/image';
import GameTile from '@/app/components/GameTile';
import { notFound } from 'next/navigation';
import PropTypes from 'prop-types';
import TeamLogo from '@/app/components/TeamLogo';
import Link from 'next/link';
import { getTeamDataByAbbreviation } from '@/app/utils/teamData';
import StoryCard from '@/app/components/StoryCard';

const fetchData = async (url, seriesString) => {
  const extractSeriesLetter = /(?:series-)?([a-z])(?:-coverage)?/i;

  const match = seriesString.match(extractSeriesLetter);
  if (!match || !match[1]) {
    return false;
  }

  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    return false;
  }

  return res.json();
};

const fetchSeriesData = async (seriesString, year) => {
  const seriesLetter = seriesString.match(/(?:series-)?([a-z])(?:-coverage)?/i)?.[1]?.toLowerCase();
  const url = `https://api-web.nhle.com/v1/schedule/playoff-series/${year - 1}${year}/${seriesLetter}/`;

  return fetchData(url, seriesString);
};

const fetchRelatedStories = async (seriesString, year) => {
  const seriesLetter = seriesString.match(/(?:series-)?([a-z])(?:-coverage)?/i)?.[1]?.toLowerCase();
  const url = `https://forge-dapi.d3.nhle.com/v2/content/en-us/stories?tags.slug=${year - 1}-${String(year).slice(-2)}&tags.slug=series-${seriesLetter}&context.slug=nhl`;

  return fetchData(url, seriesString);
};

export default async function SeriesPage({ params }) {
  const { seriesLetter, year } = await params;

  const series = await fetchSeriesData(seriesLetter, year);
  const relatedStories = await fetchRelatedStories(seriesLetter, year);

  if (!series) {
    return notFound();
  }

  const { topSeedTeam, bottomSeedTeam, games, seriesLogo, roundLabel, roundAbbrev } = series;

  topSeedTeam.data = getTeamDataByAbbreviation(topSeedTeam.abbrev, false);
  bottomSeedTeam.data = getTeamDataByAbbreviation(bottomSeedTeam.abbrev, true);

  const logos = {
    [topSeedTeam.id]: topSeedTeam.logo,
    [bottomSeedTeam.id]: bottomSeedTeam.logo,
  };

  const seriesTitles = {
    'nhl-semifinal': 'NHL Semifinal',

  };


  const seriesHeaderStyle = { background: 'var(--background)' };
  seriesHeaderStyle.borderLeft = `solid 10px ${topSeedTeam.data.teamColor}`;
  seriesHeaderStyle.borderRight = `solid 10px ${bottomSeedTeam.data.teamColor}`;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {seriesLogo && (
        <div className="p-5 bg-gray-900 rounded-xl">
          <Link href={`/playoffs/${year}`}>
            <Image src={seriesLogo} alt="Series Logo" width={1024} height={1024} className="h-auto w-auto" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-12 my-5 border rounded-lg shadow-sm py-4 items-center" style={seriesHeaderStyle}>
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
                <div className="text-lg font-black">{topSeedTeam.name?.default.replace(topSeedTeam.placeName?.default, '')}</div>
              </div>
            </Link>
          </div>
        </div>

        <div className={`col-span-2 flex flex-wrap justify-center items-center text-center text-5xl md:text-7xl font-black ${bottomSeedTeam.seriesWins === series.neededToWin && series.neededToWin ? 'opacity-50' : ''}`}>
          {/* Series Status Top Seed */}
          {topSeedTeam.seriesWins}
        </div>
        <div className="col-span-2 text-center content-middle">
          <span className="block md:hidden font-bold capitalize">{roundAbbrev}</span>
          <span className="hidden md:block font-bold capitalize">{seriesTitles[roundLabel] || roundLabel.replace(/-/g, ' ')}</span>
          <span className="block text-sm">Best of {series.length || (series.neededToWin * 2) - 1}</span>
        </div>
        <div className={`col-span-2 flex flex-wrap justify-center items-center text-center text-5xl md:text-7xl font-black ${topSeedTeam.seriesWins === series.neededToWin && series.neededToWin ? 'opacity-50' : ''}`}>
          {/* Series Status Bottom Seed */}
          {bottomSeedTeam.seriesWins}
        </div>
        <div className="col-span-3 flex mx-auto gap-2 items-center justify-center">
          <div className="text-right order-2 md:order-1">
            <Link href={`/team/${bottomSeedTeam.abbrev}`}>
              <div className="text-xl font-black block md:hidden">{bottomSeedTeam.abbrev}</div>
              <div className="text-lg hidden md:block">
                <div className="text-sm">{bottomSeedTeam.placeName?.default}</div>
                <div className="text-lg font-black">{bottomSeedTeam.name?.default?.replace(bottomSeedTeam.placeName?.default, '')}</div>
              </div>
            </Link>
          </div>
          <div className="text-right order-1 md:order-2">
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
        {games.map((game, i) => {
          return (
            <GameTile key={i} game={game} logos={logos} className="col-span-1" />
          );
        })}
      </div>

      {relatedStories.items?.length > 0 && (
        <div className="my-5">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold mb-4">Series Coverage</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {relatedStories.items.map((item) => (
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

SeriesPage.propTypes = {
  params: {
    seriesLetter: PropTypes.string.isRequired,
  },
};

