'use client';

import React from 'react';

import TeamLogo from './TeamLogo';
import { PropTypes } from 'prop-types';

const LeagueToggle = ({ activeLeague, handleChangeLeagues }) => {
  return (
    <div>
      <div className="flex space-x-0">
        <button
          className="flex gap-1 items-center text-sm p-2 border border-e-0 rounded-l-md bg-slate-200 dark:bg-slate-800 text-black dark:text-white"
          style={{ backgroundColor: activeLeague === 'nhl' ? '#111' : '', color: activeLeague === 'nhl' ? '#eee' : '' }}
          onClick={() => handleChangeLeagues('nhl')}
        >
          <TeamLogo
            colorMode={activeLeague === 'nhl' ? 'dark' : 'light'}
            src={'https://assets.nhle.com/logos/nhl/svg/NHL_light.svg'}
            alt="NHL Logo"
            className="w-6 h-6"
          />
          <div>
            National Hockey League
          </div>
        </button>
        <button
          className="flex gap-1 items-center text-sm p-2 border rounded-r-md bg-slate-200 dark:bg-slate-800 text-black dark:text-white"
          style={{ backgroundColor: activeLeague === 'other' ? '#111' : '', color: activeLeague === 'other' ? '#eee' : '' }}
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

LeagueToggle.propTypes = {
  activeLeague: PropTypes.string.isRequired,
  handleChangeLeagues: PropTypes.func.isRequired,
};

LeagueToggle.defaultProps = {
  activeLeague: 'nhl',
};

export default LeagueToggle;