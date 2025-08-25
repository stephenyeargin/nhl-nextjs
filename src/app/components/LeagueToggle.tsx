'use client';

import React from 'react';

import TeamLogo from './TeamLogo';
import { formatTextColorByBackgroundColor } from '../utils/formatters';

interface LeagueToggleProps {
  activeLeague?: 'nhl' | 'other';
  handleChangeLeagues: (_league: 'nhl' | 'other') => void;
  activeColor: string;
}

const LeagueToggle: React.FC<LeagueToggleProps> = ({ activeLeague = 'nhl', handleChangeLeagues, activeColor }) => {
  return (
    <div>
      <div className="flex space-x-0 text-sm">
        <button
          className="flex gap-1 items-center p-2 border border-e-0 rounded-l-md bg-inherit text-black dark:text-white"
          style={{ backgroundColor: activeLeague === 'nhl' ? activeColor : 'inherit', color: activeLeague === 'nhl' ? formatTextColorByBackgroundColor(activeColor) : 'inherit' }}
          onClick={() => handleChangeLeagues('nhl')}
        >
          <TeamLogo
            colorMode={activeLeague === 'nhl' ? 'dark' : 'light'}
            src={'https://assets.nhle.com/logos/nhl/svg/NHL_light.svg'}
            alt="NHL Logo"
            className="w-5 h-5"
          />
          <div>
            National Hockey League
          </div>
        </button>
        <button
          className="flex gap-1 items-center p-2 border rounded-r-md bg-inherit text-black dark:text-white"
          style={{ backgroundColor: activeLeague === 'other' ? activeColor : 'inherit', color: activeLeague === 'other' ? formatTextColorByBackgroundColor(activeColor) : 'inherit' }}
          onClick={() => handleChangeLeagues('other')}
        >
          <div>
            Other Leagues
          </div>
        </button>
      </div>
    </div>
  );
};

export default LeagueToggle;
