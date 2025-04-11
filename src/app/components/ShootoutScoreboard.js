import { faCheckCircle, faTrophy, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import PropTypes from 'prop-types';
import TeamLogo from './TeamLogo';

const ShootoutScoreboard = ({ shootout, awayTeam, homeTeam }) => { 
  const maxRounds = Math.max(Math.floor(shootout.length / 2), 3);

  let shootingFirst = awayTeam;
  if (shootout.length > 0 && shootout.find((s) => s.sequence === 1)?.teamAbbrev.default === homeTeam.abbrev) {
    shootingFirst = homeTeam;
  }

  const getRoundData = (roundIndex) => {
    const shot = shootout.find((i) => i.sequence === roundIndex);
    
    return shot || { result: null };
  };

  const renderShot = (shot) => {
    if (!shot.result) {
      return <div className="text-center">-</div>;
    }

    return shot.result === 'goal' ? (
      <>
        {shot.gameWinner ? (
          <FontAwesomeIcon icon={faTrophy} className="text-3xl text-green-500" title={`Shot #${shot.sequence} by ${shot.firstName?.default} ${shot.lastName?.default}: Game Winner!`} />
        ) : (
          <FontAwesomeIcon icon={faCheckCircle} className="text-3xl text-green-500" title={`Shot #${shot.sequence} by ${shot.firstName?.default} ${shot.lastName?.default}: ${shot.result.toUpperCase()}`} />
        )}
      </>
    ) : (
      <FontAwesomeIcon icon={faXmarkCircle} className="text-3xl text-slate-500" title={`Shot #${shot.sequence} by ${shot.firstName?.default} ${shot.lastName?.default}: ${shot.result.toUpperCase()}`} />
    );
  };

  return (
    <div className="overflow-x-auto scrollbar-hidden">
      <table className="my-5 border text-sm">
        <thead>
          <tr>
            <th className="bg-slate-200 dark:bg-slate-800 p-2" style={{ minWidth: '100px' }}>Round</th>
            {Array.from({ length: maxRounds }).map((_, roundIndex) => (
              <th key={roundIndex} className="bg-slate-200 dark:bg-slate-800 p-2">{roundIndex + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border">
              {shootingFirst === awayTeam ? (
                <div className="flex gap-1 items-center">
                  <TeamLogo
                    team={awayTeam.abbrev}
                    src={awayTeam.logo}
                    alt={awayTeam.commonName.default}
                    className="w-10 h-10 mx-auto"
                  />
                  <span className="font-bold">
                    {awayTeam.abbrev}
                  </span>
                </div>
              ) : (
                <div className="flex gap-1 items-center">
                  <TeamLogo
                    team={homeTeam.abbrev}
                    src={homeTeam.logo}
                    alt={homeTeam.commonName.default}
                    className="w-10 h-10 mx-auto"
                  />
                  <span className="font-bold">
                    {homeTeam.abbrev}
                  </span>
                </div>
              )}
            </td>
            {Array.from({ length: maxRounds }).map((_, roundIndex) => {
              const shot = getRoundData(roundIndex * 2 + 1);
              
              return (
                <td key={roundIndex} className="p-2 border">
                  {renderShot(shot)}
                </td>
              );
            })}
          </tr>
          <tr>
            <td className="p-2 border">
              {shootingFirst === homeTeam ? (
                <div className="flex gap-1 items-center">
                  <TeamLogo
                    team={awayTeam.abbrev}
                    src={awayTeam.logo}
                    alt={awayTeam.commonName.default}
                    className="w-10 h-10 mx-auto"
                  />
                  <span className="font-bold">
                    {awayTeam.abbrev}
                  </span>
                </div>
              ) : (
                <div className="flex gap-1 items-center">
                  <TeamLogo
                    team={homeTeam.abbrev}
                    src={homeTeam.logo}
                    alt={homeTeam.commonName.default}
                    className="w-10 h-10 mx-auto"
                  />
                  <span className="font-bold">
                    {homeTeam.abbrev}
                  </span>
                </div>
              )}
            </td>
            {Array.from({ length: maxRounds }).map((_, roundIndex) => {
              const shot = getRoundData(roundIndex * 2 + 2);
              
              return (
                <td key={roundIndex} className="p-2 border">
                  {renderShot(shot)}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

ShootoutScoreboard.propTypes = {
  shootout: PropTypes.array.isRequired,
  awayTeam: PropTypes.object.isRequired,
  homeTeam: PropTypes.object.isRequired,
};

export default ShootoutScoreboard;
