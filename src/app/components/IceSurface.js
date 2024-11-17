import React from 'react';
import { Skater } from './Skater';

const IceSurface = ({ game }) => {

  const { homeTeam, awayTeam, summary, clock } = game;

  const logos = {};
  logos[homeTeam.abbrev] = homeTeam.logo;
  logos[awayTeam.abbrev] = awayTeam.logo;

  return (
    <>
      {summary.iceSurface && !clock.inIntermission && (
        <div>
          <div
            className="grid grid-cols-6 p-10 border rounded-3xl mt-5 gap-0 w-full relative"
            style={{minHeight: '30rem'}}
          >
            <style jsx>{`
              .grid::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image: url(${logos[homeTeam.abbrev]});
                background-size: 300px 300px;
                background-position: center;
                background-repeat: no-repeat;
                opacity: 0.2;
                z-index: -1;
              }
            `}</style>
            <div className="col-span-1 self-center">
              {summary.iceSurface?.awayTeam.goalies.map((p) => (
                <Skater key={p.playerId} player={p} isHomeTeam={false} />
              ))}
            </div>
            <div className="col-span-1 self-center">
              {summary.iceSurface?.awayTeam.defensemen.map((p) => (
                <Skater key={p.playerId} player={p} isHomeTeam={false} />
              ))}
            </div>
            <div className="col-span-1 self-center">
              {summary.iceSurface?.awayTeam.forwards.map((p) => (
                <Skater key={p.playerId} player={p} isHomeTeam={false} />
              ))}
            </div>
            <div className="col-span-1 self-center">
              {summary.iceSurface?.homeTeam.forwards.map((p) => (
                <Skater key={p.playerId} player={p} />
              ))}
            </div>
            <div className="col-span-1 self-center">
              {summary.iceSurface?.homeTeam.defensemen.map((p) => (
                <Skater key={p.playerId} player={p} />
              ))}
            </div>
            <div className="col-span-1 self-center">
              {summary.iceSurface?.homeTeam.goalies.map((p) => (
                <Skater key={p.playerId} player={p} />
              ))}
            </div>
          </div>
          {(summary.iceSurface?.awayTeam.penaltyBox.length > 0 || summary.iceSurface?.homeTeam.penaltyBox.length > 0) && (
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-1 flex justify-end">
                {summary.iceSurface?.awayTeam.penaltyBox.map((p) => (
                  <Skater key={p.playerId} player={p} game={game} isHomeTeam={false} />
                ))}
              </div>
              <div className="col-span-1 flex justify-start">
                {summary.iceSurface?.homeTeam.penaltyBox.map((p) => (
                  <Skater key={p.playerId} player={p} game={game} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default IceSurface;
