import React from 'react';
import { getAllTeamsByDivision } from '../utils/teamData';
import Link from 'next/link';
import TeamLogo from './TeamLogo';
import { PropTypes } from 'prop-types';

const TeamCell = ({ team }) => {
  return (
    <div className="text-xs md:text-base">
      <Link href={`/team/${team.abbreviation}`} className="flex gap-2 items-center p-1">
        <TeamLogo team={team.abbreviation} className="h-8 w-8" noLink />
        <div className="underline">
          <div className="hidden md:block">{team.name}</div>
          <div className="md:hidden">{team.abbreviation}</div>
        </div>
      </Link>
    </div>
  );
};

TeamCell.propTypes = {
  team: PropTypes.shape({
    abbreviation: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default function TeamsMenu({ onMouseLeave, size }) {
  const teamsByDivision = getAllTeamsByDivision();

  if (size === 'full') {
    return (
      <div>
        <div className="h1 my-2 text-2xl">Western Conference</div>
        <div className="grid grid-cols-2">
          <div className="col-span-1 py-2">
            <div className="font-bold text-gray-500">Pacific Division</div>
            {teamsByDivision['Pacific'].map((t, i) => (
              <TeamCell key={i} team={t} />
            ))}
          </div>
          <div className="col-span-1 py-2">
            <div className="font-bold text-gray-500">Centrial Division</div>
            {teamsByDivision['Central'].map((t, i) => (
              <TeamCell key={i} team={t} />
            ))}
          </div>
        </div>
        <div className="h1 my-2 text-2xl">Eastern Conference</div>
        <div className="grid grid-cols-2">
          <div className="col-span-1 py-2">
            <div className="font-bold text-gray-500">Metropolitan Division</div>
            {teamsByDivision['Metropolitan'].map((t, i) => (
              <TeamCell key={i} team={t} />
            ))}
          </div>
          <div className="col-span-1 py-2">
            <div className="font-bold text-gray-500">Atlantic Division</div>
            {teamsByDivision['Atlantic'].map((t, i) => (
              <TeamCell key={i} team={t} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute bg-slate-200 dark:bg-slate-800 p-5 shadow-lg w-full left-0
                 transition-opacity duration-200 ease-in-out z-50"
      onMouseLeave={onMouseLeave}
    >
      <div className="grid grid-cols-4">
        <div className="col-span-1 p-2">
          {teamsByDivision['Pacific'].map((t, i) => (
            <TeamCell key={i} team={t} />
          ))}
        </div>
        <div className="col-span-1 p-2">
          {teamsByDivision['Central'].map((t, i) => (
            <TeamCell key={i} team={t} />
          ))}
        </div>
        <div className="col-span-1 p-2">
          {teamsByDivision['Metropolitan'].map((t, i) => (
            <TeamCell key={i} team={t} />
          ))}
        </div>
        <div className="col-span-1 p-2">
          {teamsByDivision['Atlantic'].map((t, i) => (
            <TeamCell key={i} team={t} />
          ))}
        </div>
      </div>
    </div>
  );
}

TeamsMenu.propTypes = {
  onMouseLeave: PropTypes.func.isRequired,
  size: PropTypes.string.isRequired,
};
