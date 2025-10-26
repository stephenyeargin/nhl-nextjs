import React from 'react';
import type { YearParam } from '@/app/types/routeParams';
import Image from 'next/image';
import PlayoffSeriesTile from '../../components/PlayoffSeriesTile';
import { notFound } from 'next/navigation';
import PlayoffYearSelector from '@/app/components/PlayoffYearSelector';

interface PlayoffSeries {
  seriesLetter: string;
  playoffRound: number;
  seriesAbbrev?: string;
  seriesTitle?: string;
  topSeedTeam?: any;
  bottomSeedTeam?: any;
}
interface PlayoffBracket {
  series: PlayoffSeries[];
  bracketLogo?: string;
}

async function getPlayoffData(year: string | number): Promise<PlayoffBracket> {
  const res = await fetch(`https://api-web.nhle.com/v1/playoff-bracket/${year}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch playoff data');
  }

  return res.json();
}

async function getSeasonData(): Promise<any> {
  const res = await fetch('https://api-web.nhle.com/v1/season', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch season data');
  }

  return res.json();
}

const getSeriesByLetter = (bracket: PlayoffBracket, letter: string) =>
  bracket.series.find((s) => s.seriesLetter === letter);

const groupByRound = (seriesList: PlayoffSeries[]) =>
  seriesList.reduce<Record<number, PlayoffSeries[]>>((acc, series) => {
    const round = series.playoffRound;
    if (!acc[round]) {
      acc[round] = [];
    }
    acc[round].push(series);

    return acc;
  }, {});

export default async function PlayoffsPage(props: any) {
  const resolved = (await props?.params) as YearParam | Promise<YearParam>;
  const { year } = await resolved;
  const bracket = await getPlayoffData(year);
  const seasons = await getSeasonData();

  if (!bracket.series) {
    return notFound();
  }

  const groupedSeries = groupByRound(bracket.series);
  let columnCount = 7;
  if (bracket.series.find((s) => s.seriesAbbrev === 'SCQ')) {
    columnCount = 9;
  }
  if (bracket.series.length < 11) {
    columnCount = 1;
  }

  const shownSeriesTitles = new Set<string>();

  return (
    <main className="px-2 py-10 text-white" style={{ backgroundColor: '#121212' }}>
      <div className="max-w-4xl my-5 mx-auto p-5 rounded-xl">
        {Array.isArray(bracket.series) && bracket.series.length > 0 && bracket.bracketLogo ? (
          <Image
            src={bracket.bracketLogo}
            alt="NHL Playoffs"
            width={1024}
            height={1024}
            className="h-auto w-auto"
          />
        ) : (
          <div className="flex justify-center align-middle">
            <Image
              src={'https://assets.nhle.com/logos/nhl/svg/NHL_light.svg'}
              alt="NHL Playoffs"
              width={1024}
              height={1024}
              className="h-10 w-10 pe-2"
            />
            <div className="text-2xl font-bold leading-10">{year} Stanley Cup Playoffs</div>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <label className="block p-2 text-xl font-bold">Season:</label>
        <PlayoffYearSelector seasons={seasons} year={Number(year)} />
      </div>

      {Array.isArray(bracket.series) && bracket.series.length > 0 ? (
        <div className={`hidden sm:grid grid-cols-${columnCount} align-center gap-5`}>
          {bracket.series.find((s) => s.seriesAbbrev === 'SCQ') && (
            <div>
              <PlayoffSeriesTile year={Number(year)} series={getSeriesByLetter(bracket, 'W')} />
              <PlayoffSeriesTile year={Number(year)} series={getSeriesByLetter(bracket, 'X')} />
              <PlayoffSeriesTile year={Number(year)} series={getSeriesByLetter(bracket, 'Y')} />
              <PlayoffSeriesTile year={Number(year)} series={getSeriesByLetter(bracket, 'Z')} />
            </div>
          )}
          <div className="col-span-1 my-auto">
            <PlayoffSeriesTile year={Number(year)} series={getSeriesByLetter(bracket, 'E')} />
            <PlayoffSeriesTile year={Number(year)} series={getSeriesByLetter(bracket, 'F')} />
            <PlayoffSeriesTile year={Number(year)} series={getSeriesByLetter(bracket, 'G')} />
            <PlayoffSeriesTile year={Number(year)} series={getSeriesByLetter(bracket, 'H')} />
          </div>
          <div className="col-span-1 my-auto">
            <PlayoffSeriesTile year={Number(year)} series={getSeriesByLetter(bracket, 'K')} />
            <PlayoffSeriesTile year={Number(year)} series={getSeriesByLetter(bracket, 'L')} />
          </div>
          <div className="col-span-1 my-auto">
            <PlayoffSeriesTile year={Number(year)} series={getSeriesByLetter(bracket, 'N')} />
          </div>
          <div className="col-span-1 my-auto">
            <PlayoffSeriesTile year={Number(year)} series={getSeriesByLetter(bracket, 'O')} />
          </div>
          <div className="col-span-1 my-auto">
            <PlayoffSeriesTile year={Number(year)} series={getSeriesByLetter(bracket, 'M')} />
          </div>
          <div className="col-span-1 my-auto">
            <PlayoffSeriesTile year={Number(year)} series={getSeriesByLetter(bracket, 'I')} />
            <PlayoffSeriesTile year={Number(year)} series={getSeriesByLetter(bracket, 'J')} />
          </div>
          <div className="col-span-1 my-auto">
            <PlayoffSeriesTile year={Number(year)} series={getSeriesByLetter(bracket, 'A')} />
            <PlayoffSeriesTile year={Number(year)} series={getSeriesByLetter(bracket, 'B')} />
            <PlayoffSeriesTile year={Number(year)} series={getSeriesByLetter(bracket, 'C')} />
            <PlayoffSeriesTile year={Number(year)} series={getSeriesByLetter(bracket, 'D')} />
          </div>
          {bracket.series.find((s) => s.seriesAbbrev === 'SCQ') && (
            <div>
              <PlayoffSeriesTile year={Number(year)} series={getSeriesByLetter(bracket, 'S')} />
              <PlayoffSeriesTile year={Number(year)} series={getSeriesByLetter(bracket, 'T')} />
              <PlayoffSeriesTile year={Number(year)} series={getSeriesByLetter(bracket, 'U')} />
              <PlayoffSeriesTile year={Number(year)} series={getSeriesByLetter(bracket, 'V')} />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center my-40">No scheduled games.</div>
      )}

      {Object.entries(groupedSeries)
        .filter(([, seriesList]) => seriesList.some((s) => s.topSeedTeam && s.bottomSeedTeam))
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([round, seriesList]) => (
          <div key={round} className="sm:hidden my-10">
            <div className="text-lg">
              {seriesList.map((series, i) => {
                const top = series.topSeedTeam;
                const bottom = series.bottomSeedTeam;
                if (!top || !bottom) {
                  return null;
                }
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
                    <PlayoffSeriesTile year={Number(year)} series={series} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
    </main>
  );
}
