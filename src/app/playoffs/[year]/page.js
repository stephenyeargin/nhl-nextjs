import React from 'react';
import Image from 'next/image';
import PlayoffSeriesTile from '../../components/PlayoffSeriesTile';
import { PropTypes } from 'prop-types';
import { notFound } from 'next/navigation';
import PlayoffYearSelector from '@/app/components/PlayoffYearSelector';

async function getPlayoffData({ year }) {
  // const year = new Date().getFullYear(); // or set a fixed year
  const res = await fetch(`https://api-web.nhle.com/v1/playoff-bracket/${year}`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch playoff data');
  }

  const playoffBracket = res.json();

  return playoffBracket;
}

async function getSeasonData() {
  const res = await fetch('https://api-web.nhle.com/v1/season', { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch season data');
  }

  const seasonData = res.json();

  return seasonData;
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

export default async function PlayoffsPage({ params }) {
  const { year } = await params;
  const bracket = await getPlayoffData({ year });
  const seasons = await getSeasonData();

  if (!bracket.series) {
    return notFound();
  }

  const groupedSeries = groupByRound(bracket.series);
  let columnCount = 7;
  if (bracket.series.find((s) => s.seriesAbbrev === 'SCQ')) {
    columnCount = 9;
  }
  if (bracket.series.length < 15) {
    columnCount = 1;
  }

  const shownSeriesTitles = new Set();

  return (
    <main className="px-4 py-10 bg-gray-900 text-white">
      <div className="max-w-4xl my-5 mx-auto p-5 rounded-xl">
        <Image
          src={bracket.bracketLogo}
          alt="NHL Playoffs"
          width={1024}
          height={1024}
          className="h-auto w-auto"
        />
      </div>

      <div className="flex justify-center">
        <label className="block p-2 text-xl font-bold">
          Season:
        </label>
        <PlayoffYearSelector seasons={seasons} year={year} />
      </div>

      <div className={`hidden sm:grid grid-cols-${columnCount} align-center gap-5`}>
        {/* Stanley Cup Qualifiers (2020) */}
        {bracket.series.find((s) => s.seriesAbbrev === 'SCQ') && (
          <div>
            <PlayoffSeriesTile year={year} series={getSeriesByLetter(bracket, 'W')} />
            <PlayoffSeriesTile year={year} series={getSeriesByLetter(bracket, 'X')} />
            <PlayoffSeriesTile year={year} series={getSeriesByLetter(bracket, 'Y')} />
            <PlayoffSeriesTile year={year} series={getSeriesByLetter(bracket, 'Z')} />
          </div>
        )}

        {/* Western Quarterfinals */}
        <div className="col-span-1 my-auto">
          <PlayoffSeriesTile year={year} series={getSeriesByLetter(bracket, 'E')} />
          <PlayoffSeriesTile year={year} series={getSeriesByLetter(bracket, 'F')} />
          <PlayoffSeriesTile year={year} series={getSeriesByLetter(bracket, 'G')} />
          <PlayoffSeriesTile year={year} series={getSeriesByLetter(bracket, 'H')} />
          {/* Covid Year */}

        </div>
        {/* Western Semifinals */}
        <div className="col-span-1 my-auto">
          <PlayoffSeriesTile year={year} series={getSeriesByLetter(bracket, 'K')} />
          <PlayoffSeriesTile year={year} series={getSeriesByLetter(bracket, 'L')} />
        </div>
        {/* Western Finals */}
        <div className="col-span-1 my-auto">
          <PlayoffSeriesTile year={year} series={getSeriesByLetter(bracket, 'N')} />
        </div>
        {/* Stanley Cup Finals */}
        <div className="col-span-1 my-auto">
          <PlayoffSeriesTile year={year} series={getSeriesByLetter(bracket, 'O')} />
        </div>
        {/* Eastern Finals */}
        <div className="col-span-1 my-auto">
          <PlayoffSeriesTile year={year} series={getSeriesByLetter(bracket, 'M')} />
        </div>
        {/* Eastern Semifinals */}
        <div className="col-span-1 my-auto">
          <PlayoffSeriesTile year={year} series={getSeriesByLetter(bracket, 'I')} />
          <PlayoffSeriesTile year={year} series={getSeriesByLetter(bracket, 'J')} />
        </div>
        {/* Eastern Quarterfinals */}
        <div className="col-span-1 my-auto">
          <PlayoffSeriesTile year={year} series={getSeriesByLetter(bracket, 'A')} />
          <PlayoffSeriesTile year={year} series={getSeriesByLetter(bracket, 'B')} />
          <PlayoffSeriesTile year={year} series={getSeriesByLetter(bracket, 'C')} />
          <PlayoffSeriesTile year={year} series={getSeriesByLetter(bracket, 'D')} />
        </div>
        {/* Stanley Cup Qualifiers (2020) */}
        {bracket.series.find((s) => s.seriesAbbrev === 'SCQ') && (
          <div>
            <PlayoffSeriesTile year={year} series={getSeriesByLetter(bracket, 'S')} />
            <PlayoffSeriesTile year={year} series={getSeriesByLetter(bracket, 'T')} />
            <PlayoffSeriesTile year={year} series={getSeriesByLetter(bracket, 'U')} />
            <PlayoffSeriesTile year={year} series={getSeriesByLetter(bracket, 'V')} />
          </div>
        )}
      </div>

      {Object.entries(groupedSeries)
        .filter(([, seriesList]) => seriesList.some((s) => s.topSeedTeam && s.bottomSeedTeam))
        .sort(([a], [b]) => Number(b) - Number(a)) // Reverse order
        .map(([round, seriesList]) => (
          <div key={round} className="sm:hidden my-10">
            <div className="text-lg">
              {seriesList.map((series, i) => {
                const top = series.topSeedTeam;
                const bottom = series.bottomSeedTeam;
                if (!top || !bottom) {return null;}

                const thisSeriesHeading = series.seriesTitle || `Round ${round}`;
                const shouldShowHeading = !shownSeriesTitles.has(thisSeriesHeading);
                if (shouldShowHeading) {
                  shownSeriesTitles.add(thisSeriesHeading);
                }


                return (
                  <div key={i}>
                    {shouldShowHeading && (
                      <h2 className="text-2xl font-bold mb-6 text-center text-white">
                        {thisSeriesHeading}
                      </h2>
                    )}
                    <PlayoffSeriesTile year={year} series={series} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
    </main>
  );
}

PlayoffsPage.propTypes = {
  params: {
    year: PropTypes.number.isRequired,
  },
};
