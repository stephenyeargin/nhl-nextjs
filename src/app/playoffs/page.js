import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TeamLogo from '../components/TeamLogo';
import PlayoffSeriesTile from '../components/PlayoffSeriesTile';

async function getPlayoffData() {
  const year = new Date().getFullYear(); // or set a fixed year
  const res = await fetch(`https://api-web.nhle.com/v1/playoff-bracket/${year}`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch playoff data');
  }

  const playoffBracket = res.json();

  return playoffBracket;
}

// Get series by letter
const getSeriesByLetter = (bracket, letter) => {
  const seriesList = bracket.series;

  return seriesList.find((series) => series.seriesLetter === letter);
};

const groupByRound = (seriesList) => {
  return seriesList.reduce((acc, series) => {
    const round = series.playoffRound;
    if (!acc[round]) {acc[round] = [];}
    acc[round].push(series);

    return acc;
  }, {});
};

export default async function PlayoffsPage() {
  const bracket = await getPlayoffData();
  const groupedSeries = groupByRound(bracket.series);

  return (
    <main className="px-4 py-10">
      <div className="max-w-4xl my-5 mx-auto p-5 bg-gray-900 rounded-xl">
        <Image
          src={bracket.bracketLogo}
          alt="NHL Playoffs"
          width={1024}
          height={1024}
          className="h-auto w-auto"
        />
      </div>

      <div className="hidden sm:grid grid-cols-7 align-center gap-2">
        {/* Western Quarterfinals */}
        <div className="col-span-1">
          <PlayoffSeriesTile series={getSeriesByLetter(bracket, 'E')} />
          <PlayoffSeriesTile series={getSeriesByLetter(bracket, 'F')} />
          <PlayoffSeriesTile series={getSeriesByLetter(bracket, 'G')} />
          <PlayoffSeriesTile series={getSeriesByLetter(bracket, 'H')} />
        </div>
        {/* Western Semifinals */}
        <div className="col-span-1 my-auto">
          <PlayoffSeriesTile series={getSeriesByLetter(bracket, 'K')} />
          <div className="h-20">&nbsp;</div>
          <PlayoffSeriesTile series={getSeriesByLetter(bracket, 'L')} />
        </div>
        {/* Western Finals */}
        <div className="col-span-1 my-auto">
          <PlayoffSeriesTile series={getSeriesByLetter(bracket, 'N')} />
        </div>
        {/* Stanley Cup Finals */}
        <div className="col-span-1 my-auto">
          <PlayoffSeriesTile series={getSeriesByLetter(bracket, 'O')} />
        </div>
        {/* Eastern Finals */}
        <div className="col-span-1 my-auto">
          <PlayoffSeriesTile series={getSeriesByLetter(bracket, 'M')} />
        </div>
        {/* Eastern Semifinals */}
        <div className="col-span-1 my-auto">
          <PlayoffSeriesTile series={getSeriesByLetter(bracket, 'I')} />
          <div className="h-20">&nbsp;</div>
          <PlayoffSeriesTile series={getSeriesByLetter(bracket, 'J')} />
        </div>
        {/* Eastern Quarterfinals */}
        <div className="col-span-1">
          <PlayoffSeriesTile series={getSeriesByLetter(bracket, 'A')} />
          <PlayoffSeriesTile series={getSeriesByLetter(bracket, 'B')} />
          <PlayoffSeriesTile series={getSeriesByLetter(bracket, 'C')} />
          <PlayoffSeriesTile series={getSeriesByLetter(bracket, 'D')} />
        </div>
      </div>

      {Object.entries(groupedSeries)
        .filter(([, seriesList]) => seriesList.some((s) => s.topSeedTeam && s.bottomSeedTeam))
        .sort(([a], [b]) => Number(b) - Number(a)) // Reverse order
        .map(([round, seriesList]) => (
          <div key={round} className="sm:hidden my-10">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {seriesList[0]?.seriesTitle || `Round ${round}`}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-lg">
              {seriesList.map((series, i) => {
                const top = series.topSeedTeam;
                const bottom = series.bottomSeedTeam;
                if (!top || !bottom) {return null;}

                return (
                  <Link
                    key={i}
                    href={`/playoffs/${series.seriesLetter}`}
                    className="p-4 border rounded-lg shadow flex items-center space-x-4 space-y-4"
                  >
                    <div className="flex-1">
                      <div className={`flex items-center justify-between ${series.bottomSeedWins === 4 ? 'opacity-50' : ''}`}>
                        <div className="flex items-center space-x-2 space-y-2">
                          <TeamLogo src={top.logo} alt={top.abbrev} className="w-8 h-8 mr-3" noLink />
                          <div>
                            <span className="font-bold">{top.commonName?.default.replace(top.placeNameWithPreposition?.default, 'TBD')}</span>
                          </div>
                        </div>
                        <span className="text-lg font-semibold">
                          {series.topSeedWins}
                        </span>
                      </div>

                      <div className={`flex items-center justify-between ${series.topSeedWins === 4 ? 'opacity-50' : ''}`}>
                        <div className="flex items-center space-x-2 space-y-2">
                          <TeamLogo src={bottom.logo} alt={bottom.abbrev} className="w-8 h-8 mr-3" noLink />
                          <div>
                            <span className="font-bold">{bottom.commonName?.default.replace(bottom.placeNameWithPreposition?.default, 'TBD')}</span>
                          </div>
                        </div>
                        <span className="text-lg font-semibold">
                          {series.bottomSeedWins}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
    </main>
  );
}
