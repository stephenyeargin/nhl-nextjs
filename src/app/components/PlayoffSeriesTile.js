import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TeamLogo from './TeamLogo';
import { PropTypes } from 'prop-types';

const TBDLogo = () => (<Image src="https://assets.nhle.com/logos/nhl/svg/team-tbd-light.svg" width="1024" height="1024" alt="To Be Determined" className="w-8 h-8 mr-3" />);

const PlayoffSeriesTile = ({ series, year }) => {
  if (!series) {
    return null;
  }

  if (series.seriesLogo && !series.topSeedTeam) {
    return (
      <Link
        href={`/playoffs/${year}/${series.seriesLetter?.toLowerCase()}`}
        className="block"
      >
        <Image src={series.seriesLogo} alt="Series Logo" width="1024" height="1024" className="w-auto px-5" />
      </Link>
    );
  }

  if (!series.topSeedTeam) {
    return (
      <Link
        href={`/playoffs/${year}/${series.seriesLetter?.toLowerCase()}`}
        className="text-xs p-2 border rounded-lg shadow my-4 flex items-center bg-white dark:bg-gray-900 text-black dark:text-white"
      >
        <div className="flex-1">
          <div className="flex items-center justify-center md:justify-start">
            <TBDLogo />
            <div className="hidden md:block grow font-bold">TBD</div>
          </div>

          <div className="flex items-center justify-center md:justify-start">
            <TBDLogo />
            <div className="hidden md:block grow font-bold">TBD</div>
          </div>
        </div>
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
          className="text-xs p-2 border rounded-lg shadow my-4 bg-white dark:bg-gray-900 text-black dark:text-white block"
        >
          <div className="flex flex-wrap gap-5 justify-center">
            <div className={`text-center ${(series.losingTeamId === top.id) ? 'opacity-50' : ''}`}>
              <TeamLogo src={top.logo} alt={top.abbrev} className="w-20 h-20 mx-auto" noLink />
              <div>
                <span className="font-thin">({series.topSeedRankAbbrev})</span>
                {' '}
                <span className="font-bold">{top.commonName?.default.replace(top.placeNameWithPreposition?.default, 'TBD')}</span>
              </div>
              <div className="font-bold text-xl py-2">{series.topSeedWins}</div>
            </div>

            <div className={`text-center ${series.losingTeamId === bottom.id ? 'opacity-50' : ''}`}>
              <TeamLogo src={bottom.logo} alt={bottom.abbrev} className="w-20 h-20 mx-auto" noLink />
              <div>
                <span className="font-thin">({series.bottomSeedRankAbbrev})</span>
                {' '}
                <span className="font-bold">{bottom.commonName?.default.replace(bottom.placeNameWithPreposition?.default, 'TBD')}</span>
              </div>
              <div className="font-bold text-xl py-2">{series.bottomSeedWins}</div>
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
        className="text-xs p-2 border rounded-lg shadow my-4 flex items-center bg-white dark:bg-gray-900 text-black dark:text-white"
      >
        <div className="flex-1">
          <div className={`flex items-center justify-center xl:justify-start ${(series.losingTeamId === top.id) ? 'opacity-50' : ''}`}>
            <TeamLogo src={top.logo} alt={top.abbrev} className="w-8 h-8 mr-3" noLink />
            <div className="hidden xl:block mx-1 font-thin">({series.topSeedRankAbbrev})</div>
            <div className="hidden xl:block grow font-bold">{top.commonName?.default.replace(top.placeNameWithPreposition?.default, 'TBD')}</div>
            <span className="font-semibold">{series.topSeedWins}</span>
          </div>

          <div className={`flex items-center justify-center xl:justify-start ${series.losingTeamId === bottom.id ? 'opacity-50' : ''}`}>
            <TeamLogo src={bottom.logo} alt={bottom.abbrev} className="w-8 h-8 mr-3" noLink />
            <div className="hidden xl:block mx-1 font-thin">({series.bottomSeedRankAbbrev})</div>
            <div className="hidden xl:block grow font-bold">{bottom.commonName?.default.replace(bottom.placeNameWithPreposition?.default, 'TBD')}</div>
            <div className="font-semibold">{series.bottomSeedWins}</div>
          </div>
        </div>
      </Link>
    </>
  );
};

PlayoffSeriesTile.propTypes = {
  series: PropTypes.object.isRequired,
  year: PropTypes.number.isRequired,
};

export default PlayoffSeriesTile;
