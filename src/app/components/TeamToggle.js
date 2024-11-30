
import React from 'react';
import { formatTextColorByBackgroundColor } from '@/app/utils/formatters';
import TeamLogo from '@/app/components/TeamLogo';
import { PropTypes } from 'prop-types';

const TeamToggle = ({ homeTeam, awayTeam, activeStatTeam, handleStatTeamClick }) => {
  const logos = {
    [homeTeam.abbrev]: homeTeam.logo,
    [awayTeam.abbrev]: awayTeam.logo,
  };

  return (
    <div>
      <div className="flex space-x-0">
        <button
          className="flex gap-1 items-center text-sm p-2 border border-e-0 rounded-l-md bg-slate-200 dark:bg-slate-800 text-black dark:text-white"
          style={{ backgroundColor: activeStatTeam === 'awayTeam' ? awayTeam.data.teamColor : '', color: activeStatTeam === 'awayTeam' ? formatTextColorByBackgroundColor(awayTeam.data.teamColor) : '' }}
          onClick={() => handleStatTeamClick('awayTeam')}
        >
          <TeamLogo
            colorMode={activeStatTeam === 'awayTeam' ? 'dark' : 'light'}
            src={logos[awayTeam.abbrev]}
            alt={awayTeam.name.default}
            className="w-6 h-6"
          />
          <div>
            {awayTeam.placeName.default} <strong>{awayTeam.name.default.replace(awayTeam.placeName.default, '')}</strong>
          </div>
        </button>
        <button
          className="flex gap-1 items-center text-sm p-2 border border-s-0 rounded-r-md bg-slate-200 dark:bg-slate-800 text-black dark:text-white"
          style={{ backgroundColor: activeStatTeam === 'homeTeam' ? homeTeam.data.teamColor : '', color: activeStatTeam === 'homeTeam' ? formatTextColorByBackgroundColor(homeTeam.data.teamColor) : '' }}
          onClick={() => handleStatTeamClick('homeTeam')}
        >
          <TeamLogo
            colorMode={activeStatTeam === 'homeTeam' ? 'dark' : 'light'}
            src={logos[homeTeam.abbrev]}
            alt={homeTeam.name.default}
            className="w-6 h-6"
          />
          <div>
            {homeTeam.placeName.default} <strong>{homeTeam.name.default.replace(homeTeam.placeName.default, '')}</strong>
          </div>
        </button>
      </div>
    </div>
  );
};

TeamToggle.propTypes = {
  homeTeam: PropTypes.object.isRequired,
  awayTeam: PropTypes.object.isRequired,
  activeStatTeam: PropTypes.string.isRequired,
  handleStatTeamClick: PropTypes.func.isRequired,
};

export default TeamToggle;
