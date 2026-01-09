import { faCheckCircle, faTrophy, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import TeamLogo from './TeamLogo';
import type { TeamAbbrevLogo } from '@/app/types/team';

interface ShootoutPlayerNamePart {
  default: string;
}

interface ShootoutShot {
  sequence: number;
  playerId: number;
  teamAbbrev: ShootoutPlayerNamePart;
  firstName: ShootoutPlayerNamePart;
  lastName: ShootoutPlayerNamePart;
  shotType: string;
  result: 'save' | 'goal';
  headshot: string;
  gameWinner: boolean;
  homeScore: number;
  awayScore: number;
}

interface TeamBasicInfo extends TeamAbbrevLogo {
  commonName: ShootoutPlayerNamePart;
}

interface ShootoutScoreboardProps {
  shootout: ShootoutShot[];
  awayTeam: TeamBasicInfo;
  homeTeam: TeamBasicInfo;
}

const ShootoutScoreboard = ({ shootout, awayTeam, homeTeam }: ShootoutScoreboardProps) => {
  // Normalize sequences to numbers and sort in order taken to handle string ids
  const normalizedShots = Array.isArray(shootout)
    ? shootout
        .map((s, idx) => ({ ...s, sequence: Number((s as any).sequence ?? idx + 1) }))
        .sort((a, b) => a.sequence - b.sequence)
    : [];

  const maxRounds = Math.max(Math.ceil(normalizedShots.length / 2), 3);

  const firstShot = normalizedShots.find((s) => s.sequence === 1);
  const shootingFirst = firstShot?.teamAbbrev?.default === homeTeam.abbrev ? homeTeam : awayTeam;

  const getRoundData = (roundIndex: number, isHome: boolean): ShootoutShot | { result: null } => {
    const sequence =
      shootingFirst === awayTeam
        ? roundIndex * 2 + (isHome ? 2 : 1)
        : roundIndex * 2 + (isHome ? 1 : 2);

    const shot = normalizedShots.find((i) => i.sequence === sequence);

    return shot || { result: null };
  };

  const renderShot = (shot?: ShootoutShot) => {
    if (!shot?.result) {
      return <div className="text-center">-</div>;
    }

    return shot.result === 'goal' ? (
      <>
        {shot.gameWinner ? (
          <FontAwesomeIcon
            icon={faTrophy}
            className="text-3xl text-green-500"
            title={`Shot #${shot.sequence} by ${shot.firstName.default} ${shot.lastName.default}: Game Winner!`}
          />
        ) : (
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="text-3xl text-green-500"
            title={`Shot #${shot.sequence} by ${shot.firstName.default} ${shot.lastName.default}: ${shot.result.toUpperCase()}`}
          />
        )}
      </>
    ) : (
      <FontAwesomeIcon
        icon={faXmarkCircle}
        className="text-3xl text-slate-500"
        title={`Shot #${shot.sequence} by ${shot.firstName.default} ${shot.lastName.default}: ${shot.result.toUpperCase()}`}
      />
    );
  };

  return (
    <div className="overflow-x-auto scrollbar-hidden">
      <table className="my-5 border text-sm">
        <thead>
          <tr>
            <th className="bg-slate-200 dark:bg-slate-800 p-2" style={{ minWidth: '100px' }}>
              Round
            </th>
            {Array.from({ length: maxRounds }).map((_, roundIndex) => (
              <th key={roundIndex} className="bg-slate-200 dark:bg-slate-800 p-2">
                {roundIndex + 1}
              </th>
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
                  <span className="font-bold">{awayTeam.abbrev}</span>
                </div>
              ) : (
                <div className="flex gap-1 items-center">
                  <TeamLogo
                    team={homeTeam.abbrev}
                    src={homeTeam.logo}
                    alt={homeTeam.commonName.default}
                    className="w-10 h-10 mx-auto"
                  />
                  <span className="font-bold">{homeTeam.abbrev}</span>
                </div>
              )}
            </td>
            {Array.from({ length: maxRounds }).map((_, roundIndex) => {
              const shot = getRoundData(roundIndex, shootingFirst === homeTeam);

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
                  <span className="font-bold">{awayTeam.abbrev}</span>
                </div>
              ) : (
                <div className="flex gap-1 items-center">
                  <TeamLogo
                    team={homeTeam.abbrev}
                    src={homeTeam.logo}
                    alt={homeTeam.commonName.default}
                    className="w-10 h-10 mx-auto"
                  />
                  <span className="font-bold">{homeTeam.abbrev}</span>
                </div>
              )}
            </td>
            {Array.from({ length: maxRounds }).map((_, roundIndex) => {
              const shot = getRoundData(roundIndex, shootingFirst === awayTeam);

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

export default ShootoutScoreboard;
