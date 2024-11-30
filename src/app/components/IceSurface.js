import React from 'react';
import { Skater } from './Skater';
import { PropTypes } from 'prop-types';
import TeamLogo from './TeamLogo';
import { getTeamDataByAbbreviation } from '../utils/teamData';

const IceSurface = ({ game }) => {
  const { homeTeam, awayTeam, summary, clock } = game;

  const logos = {};
  logos[homeTeam.abbrev] = homeTeam.logo;
  logos[awayTeam.abbrev] = awayTeam.logo;

  homeTeam.data = getTeamDataByAbbreviation(homeTeam.abbrev);
  awayTeam.data = getTeamDataByAbbreviation(awayTeam.abbrev);

  return (
    <>
      {summary.iceSurface && !clock.inIntermission && (
        <div className="relative">
          <TeamLogo
            src={logos[homeTeam.abbrev]}
            alt="Center Ice"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-100 h-100 opacity-10"
          />
          <div
            className="grid grid-cols-6 border rounded-3xl gap-0 h-full relative bg-sky-500/[.06]"
            style={{ height: '32rem' }}
          >
            <div className="col-span-1 self-center">
              {summary.iceSurface?.awayTeam.goalies.map((p) => (
                <Skater key={p.playerId} player={p} isHomeTeam={false} teamColor={awayTeam.data.teamColor} />
              ))}
            </div>
            <div className="col-span-1 self-center">
              {summary.iceSurface?.awayTeam.defensemen.map((p) => (
                <Skater key={p.playerId} player={p} isHomeTeam={false} teamColor={awayTeam.data.teamColor} />
              ))}
            </div>
            <div className="col-span-1 self-center">
              {summary.iceSurface?.awayTeam.forwards.map((p) => (
                <Skater key={p.playerId} player={p} isHomeTeam={false} teamColor={awayTeam.data.teamColor} />
              ))}
            </div>
            <div className="col-span-1 self-center">
              {summary.iceSurface?.homeTeam.forwards.map((p) => (
                <Skater key={p.playerId} player={p} isHomeTeam={true} teamColor={homeTeam.data.teamColor} />
              ))}
            </div>
            <div className="col-span-1 self-center">
              {summary.iceSurface?.homeTeam.defensemen.map((p) => (
                <Skater key={p.playerId} player={p} isHomeTeam={true} teamColor={homeTeam.data.teamColor} />
              ))}
            </div>
            <div className="col-span-1 self-center">
              {summary.iceSurface?.homeTeam.goalies.map((p) => (
                <Skater key={p.playerId} player={p} isHomeTeam={true} teamColor={homeTeam.data.teamColor} />
              ))}
            </div>
          </div>
          {(summary.iceSurface?.awayTeam.penaltyBox.length > 0 || summary.iceSurface?.homeTeam.penaltyBox.length > 0) && (
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-1 flex justify-end">
                {summary.iceSurface?.awayTeam.penaltyBox.map((p, i) => (
                  <Skater key={`${p.playerId}-${i}`} player={p} game={game} isHomeTeam={false} teamColor={homeTeam.data.teamColor} />
                ))}
              </div>
              <div className="col-span-1 flex justify-start">
                {summary.iceSurface?.homeTeam.penaltyBox.map((p, i) => (
                  <Skater key={`${p.playerId}-${i}`} player={p} game={game} isHomeTeam={true} teamColor={homeTeam.data.teamColor} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

IceSurface.propTypes = {
  game: PropTypes.object.isRequired,
};

export default IceSurface;
