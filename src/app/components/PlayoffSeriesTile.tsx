import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TeamLogo from './TeamLogo';

interface NamePart { default: string }

interface SeriesTeam {
  id: number;
  logo?: string;
  abbrev: string;
  commonName?: NamePart;
  placeNameWithPreposition?: NamePart;
}

interface SeriesInfo {
  seriesLetter?: string;
  seriesAbbrev?: string;
  seriesLogo?: string;
  topSeedTeam?: SeriesTeam;
  bottomSeedTeam?: SeriesTeam;
  losingTeamId?: number;
  topSeedRankAbbrev?: string;
  bottomSeedRankAbbrev?: string;
  topSeedWins?: number;
  bottomSeedWins?: number;
}

interface TBDLogoProps { className?: string }
const TBDLogo: React.FC<TBDLogoProps> = ({ className }) => (
  <Image src="https://assets.nhle.com/logos/nhl/svg/team-tbd-light.svg" width="1024" height="1024" alt="To Be Determined" className={className || 'w-8 h-8 mr-3'} />
);

interface PlayoffSeriesTileProps {
  series?: SeriesInfo;
  year: number;
}

const PlayoffSeriesTile: React.FC<PlayoffSeriesTileProps> = ({ series, year }) => {
  if (!series) {
    return null;
  }

  if (series.seriesLogo && !series.topSeedTeam) {
    return (
      <Link
        href={`/playoffs/${year}/series-${series.seriesLetter?.toLowerCase()}-coverage`}
        className="block"
      >
        <Image src={series.seriesLogo} alt="Series Logo" width="1024" height="1024" className="w-auto px-5" />
      </Link>
    );
  }

  const top = series.topSeedTeam;
  const bottom = series.bottomSeedTeam;

  // Stanley Cup Final
  if (series.seriesAbbrev === 'SCF') {
    return (
      <>
        <Link
          href={`/playoffs/${year}/${series.seriesLetter?.toLowerCase()}`}
          className="text-xs p-2 border rounded-lg shadow my-4 bg-white dark:bg-slate-800 text-black dark:text-white block"
        >
          <div className="flex flex-wrap gap-5 justify-center">
            <div className={`text-center ${(top && series.losingTeamId === top.id) ? 'opacity-50' : ''}`}>
              {top && top.id !== -1 ? (
                <>
                  <TeamLogo src={top.logo} alt={top.abbrev} className="w-20 h-20 mx-auto" noLink />
                  <div>
                    <span className="font-thin">({series.topSeedRankAbbrev})</span>
                    {' '}
                    <span className="font-bold">{top.commonName?.default && top.placeNameWithPreposition?.default ? top.commonName.default.replace(top.placeNameWithPreposition.default, 'TBD') : top.commonName?.default || 'TBD'}</span>
                  </div>
                  <div className="font-bold text-xl py-2">{series.topSeedWins}</div>
                </>
              ) : (
                <>
                  <TBDLogo className='w-20 h-20 mx-auto' />
                  <div className="font-bold">TBD</div>
                  <div className="font-bold text-xl py-2">0</div>
                </>
              )}
            </div>

            <div className={`text-center ${(bottom && series.losingTeamId === bottom.id) ? 'opacity-50' : ''}`}>
              {bottom && bottom.id !== -1 ? (
                <>
                  <TeamLogo src={bottom.logo} alt={bottom.abbrev} className="w-20 h-20 mx-auto" noLink />
                  <div>
                    <span className="font-thin">({series.bottomSeedRankAbbrev})</span>
                    {' '}
                    <span className="font-bold">{bottom.commonName?.default && bottom.placeNameWithPreposition?.default ? bottom.commonName.default.replace(bottom.placeNameWithPreposition.default, 'TBD') : bottom.commonName?.default || 'TBD'}</span>
                  </div>
                  <div className="font-bold text-xl py-2">{series.bottomSeedWins}</div>
                </>
              ) : (
                <>
                  <TBDLogo className='w-20 h-20 mx-auto' />
                  <div className="font-bold">TBD</div>
                  <div className="font-bold text-xl py-2">0</div>
                </>
              )}
            </div>
          </div>
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        href={`/playoffs/${year}/${series.seriesLetter?.toLowerCase()}`}
        className="text-xs tracking-tight p-2 border rounded-lg shadow my-4 flex items-center bg-white dark:bg-slate-800 text-black dark:text-white"
      >
        <div className="flex-1">
          <div className={`flex items-center justify-center xl:justify-start ${(top && series.losingTeamId === top?.id) ? 'opacity-50' : ''}`}>
            {top && top.id !== -1 ? (
              <>
                <TeamLogo src={top.logo} alt={top.abbrev} className="w-8 h-8 mr-3" noLink />
                <div className="hidden xl:block mx-1">({series.topSeedRankAbbrev})</div>
                <div className="hidden xl:block grow">{top.commonName?.default && top.placeNameWithPreposition?.default ? top.commonName.default.replace(top.placeNameWithPreposition.default, 'TBD') : top.commonName?.default || 'TBD'}</div>
                <div className="font-semibold">{series.topSeedWins}</div>
              </>
            ) : (
              <>
                <TBDLogo />
                <div className="hidden xl:block grow">TBD</div>
                <div className="font-semibold">0</div>
              </>
            )}
          </div>

          <div className={`flex items-center justify-center xl:justify-start ${bottom && series.losingTeamId === bottom?.id ? 'opacity-50' : ''}`}>
            {bottom && bottom.id !== -1 ? (
              <>
                <TeamLogo src={bottom.logo} alt={bottom.abbrev} className="w-8 h-8 mr-3" noLink />
                <div className="hidden xl:block mx-1">({series.bottomSeedRankAbbrev})</div>
                <div className="hidden xl:block grow">{bottom.commonName?.default && bottom.placeNameWithPreposition?.default ? bottom.commonName.default.replace(bottom.placeNameWithPreposition.default, 'TBD') : bottom.commonName?.default || 'TBD'}</div>
                <div className="font-semibold">{series.bottomSeedWins}</div>
              </>
            ) : (
              <>
                <TBDLogo />
                <div className="hidden xl:block grow">TBD</div>
                <div className="font-semibold">0</div>
              </>
            )}
          </div>
        </div>
      </Link>
    </>
  );
};

export default PlayoffSeriesTile;
