import React from 'react';
import Image from 'next/image';
import GameTile from '@/app/components/GameTile';
import { notFound } from 'next/navigation';
import PropTypes from 'prop-types';
import TeamLogo from '@/app/components/TeamLogo';
import Link from 'next/link';
import { getTeamDataByAbbreviation } from '@/app/utils/teamData';

const fetchSeriesData = async (seriesLetter) => {
  const year = new Date().getFullYear();
  const res = await fetch(
    `https://api-web.nhle.com/v1/schedule/playoff-series/${year-1}${year}/${seriesLetter.toLowerCase()}/`,
    { cache: 'no-store' }
  );
  if (!res.ok) {
    return false;
  }

  return res.json();
};

export default async function SeriesPage({ params }) {
  const { seriesLetter } = await params;
  const series = await fetchSeriesData(seriesLetter);

  if (!series) {
    return notFound();
  }

  const { topSeedTeam, bottomSeedTeam, games, seriesLogo, roundLabel, roundAbbrev } = series;

  topSeedTeam.data = getTeamDataByAbbreviation(topSeedTeam.abbrev, false);
  bottomSeedTeam.data = getTeamDataByAbbreviation(bottomSeedTeam.abbrev, true);

  const seriesHeaderStyle = { background: 'var(--background)' };
  seriesHeaderStyle.borderLeft = `solid 10px ${topSeedTeam.data.teamColor}`;
  seriesHeaderStyle.borderRight = `solid 10px ${bottomSeedTeam.data.teamColor}`;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {seriesLogo && (
        <div className="p-5 bg-gray-900 rounded-xl">
          <Link href="/playoffs">
            <Image src={seriesLogo} alt="Series Logo" width={1024} height={1024} className="h-auto w-auto" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-12 my-5 border rounded-lg shadow-sm py-4 items-center" style={seriesHeaderStyle}>
        <div className="col-span-3 flex flex-wrap mx-auto gap-2 items-center justify-center">
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
                <div className="text-xl font-black">{topSeedTeam.name?.default.replace(topSeedTeam.placeName?.default, '')}</div>
              </div>
            </Link>
          </div>
        </div>
        <div className={`col-span-2 flex flex-wrap justify-center items-center text-center text-5xl md:text-7xl font-black ${bottomSeedTeam.seriesWins === 4 ? 'opacity-50' : ''}`}>
          {/* Series Status Top Seed */}
          {topSeedTeam.seriesWins}
        </div>
        <div className="col-span-2 text-center content-middle">
          <span className="block md:hidden font-bold capitalize">{roundAbbrev}</span>
          <span className="hidden md:block font-bold capitalize">{roundLabel.replace(/-/g, ' ')}</span>
        </div>
        <div className={`col-span-2 flex flex-wrap justify-center items-center text-center text-5xl md:text-7xl font-black ${topSeedTeam.seriesWins === 4 ? 'opacity-50' : ''}`}>
          {/* Series Status Bottom Seed */}
          {bottomSeedTeam.seriesWins}
        </div>
        <div className="col-span-3 flex flex-wrap mx-auto gap-2 items-center justify-center">
          <div className="text-right order-2 md:order-1">
            <Link href={`/team/${bottomSeedTeam.abbrev}`}>
              <div className="text-xl font-black block md:hidden">{bottomSeedTeam.abbrev}</div>
              <div className="text-lg hidden md:block">
                <div className="text-sm">{bottomSeedTeam.placeName?.default}</div>
                <div className="text-xl font-black">{bottomSeedTeam.name?.default?.replace(bottomSeedTeam.placeName?.default, '')}</div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {games.map((game, i) => {
          return (
            <GameTile key={i} game={game} className="col-span-1" />
          );
        })}
      </div>
    </main>
  );
}

SeriesPage.propTypes = {
  params: {
    seriesLetter: PropTypes.string.isRequired,
  },
};

