import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TeamLogo from './TeamLogo';
import { PropTypes } from 'prop-types';

const TBDLogo = () => (<Image src="https://assets.nhle.com/logos/nhl/svg/team-tbd-light.svg" width="1024" height="1024" alt="To Be Determined" className="w-8 h-8 mr-3" />);

const PlayoffSeriesTile = ({ series }) => {
  if (!series.topSeedTeam) {
    return (
      <>
        {series.seriesLogo && (
          <Image src={series.seriesLogo} alt="Series Logo" width="1024" height="1024" className="hidden lg:block px-10 p-5 w-auto h-auto bg-black rounded-lg" />
        )}

        <Link
          href={`/playoffs/${series.seriesLetter}`}
          className="text-xs md:text-sm p-2 border rounded-lg shadow my-4 flex items-center"
        >
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start">
              <TBDLogo />
              <div className="hidden md:block grow font-bold">TBD</div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start">
              <TBDLogo />
              <div className="hidden md:block grow font-bold">TBD</div>
            </div>
          </div>
        </Link>
      </>
    );
  }

  const top = series.topSeedTeam;
  const bottom = series.bottomSeedTeam;

  return (
    <>
      {series.seriesLogo && (
        <Image src={series.seriesLogo} alt="Series Logo" width="1024" height="1024" className="hidden lg:block px-10 p-5 w-auto h-auto bg-black rounded-lg" />
      )}
      <Link
        href={`/playoffs/${series.seriesLetter}`}
        className="text-xs md:text-sm p-2 border rounded-lg shadow my-4 flex items-center"
      >
        <div className="flex-1">
          <div className={`flex flex-wrap items-center justify-center md:justify-start ${series.bottomSeedWins === 4 ? 'opacity-50' : ''}`}>
            <TeamLogo src={top.logo} alt={top.abbrev} className="w-8 h-8 mr-3" noLink />
            <div className="hidden lg:block grow font-bold">{top.commonName?.default.replace(top.placeNameWithPreposition?.default, 'TBD')}</div>
            <span className="font-semibold">{series.topSeedWins}</span>
          </div>

          <div className={`flex flex-wrap items-center justify-center md:justify-start ${series.topSeedWins === 4 ? 'opacity-50' : ''}`}>
            <TeamLogo src={bottom.logo} alt={bottom.abbrev} className="w-8 h-8 mr-3" noLink />
            <div className="hidden lg:block grow font-bold">{bottom.commonName?.default.replace(bottom.placeNameWithPreposition?.default, 'TBD')}</div>
            <div className="font-semibold">{series.bottomSeedWins}</div>
          </div>
        </div>
      </Link>
    </>
  );
};

PlayoffSeriesTile.propTypes = {
  series: PropTypes.object.isRequired,
};

export default PlayoffSeriesTile;
