import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TeamLogo from '../components/TeamLogo';

async function getPlayoffData() {
  const year = new Date().getFullYear(); // or set a fixed year
  const res = await fetch(`https://api-web.nhle.com/v1/playoff-bracket/${year}`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch playoff data');
  }

  const playoffBracket = res.json();

  return playoffBracket;
}

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
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="p-5 bg-gray-900 rounded-xl">
        <Image
          src={bracket.bracketLogo}
          alt="NHL Playoffs"
          width={1024}
          height={1024}
          className="h-auto w-auto"
        />
      </div>

      {Object.entries(groupedSeries)
        .filter(([, seriesList]) => seriesList.some((s) => s.topSeedTeam && s.bottomSeedTeam))
        .sort(([a], [b]) => Number(b) - Number(a)) // Reverse order
        .map(([round, seriesList]) => (
          <div key={round} className="my-10">
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
                          <TeamLogo src={top.logo} alt={top.abbrev} className="hidden lg:block w-8 h-8 mr-3" noLink />
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
                          <TeamLogo src={bottom.logo} alt={bottom.abbrev} className="hidden lg:block w-8 h-8 mr-3" noLink />
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
