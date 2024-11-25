import React from 'react';

import { PERIOD_DESCRIPTORS } from '../utils/constants';
import { PropTypes } from 'prop-types';
import TeamLogo from './TeamLogo';

const Scoreboard = ({ game, linescore }) => {
  // Assuming game has a total period count, if not, adjust accordingly
  const totalPeriods = game.periodDescriptor?.number > 3 ? game.periodDescriptor.number : 3;

  return (
    <table className="w-full text-sm">
      <thead>
        <tr>
          <th className="w-3/12 border bg-slate-200 dark:bg-slate-800 p-2"></th>
          {Array.from({ length: totalPeriods }).map((_, index) => {
            const periodNumber = index + 1;
            const period = linescore.byPeriod.find(p => p.periodDescriptor.number === periodNumber);
            
            return (
              <th
                className="w-1/12 text-center border bg-slate-200 dark:bg-slate-800 p-2"
                key={periodNumber}
              >
                {period ? (
                  period.periodDescriptor.periodType === 'REG' ? (
                    <>{PERIOD_DESCRIPTORS[period.periodDescriptor.number]}</>
                  ) : (
                    <>{period.periodDescriptor.periodType}</>
                  )
                ) : (
                  <>{PERIOD_DESCRIPTORS[index + 1]}</>
                )}
              </th>
            );
          })}
          <th className="w-1/12 text-center border bg-slate-200 dark:bg-slate-800 p-2">T</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-2 text-center border p-2">
            <div className="flex items-center">
              <TeamLogo
                src={game.awayTeam.logo}
                className="w-10 mr-1"
                alt="Logo"
              />
              <span className="font-bold">{game.awayTeam.abbrev}</span>
            </div>
          </td>
          {Array.from({ length: totalPeriods }).map((_, index) => {
            const periodNumber = index + 1;
            const period = linescore.byPeriod.find(p => p.periodDescriptor.number === periodNumber);
            
            return (
              <td className="text-center border p-2" key={periodNumber}>
                {period ? period.away : '–'}
              </td>
            );
          })}
          <td className="text-center border p-2 font-bold">
            {linescore.totals.away}
          </td>
        </tr>
        <tr>
          <td className="p-2 text-center border p-2">
            <div className="flex items-center">
              <TeamLogo
                src={game.homeTeam.logo}
                className="w-10 mr-1"
                alt="Logo"
              />
              <span className="font-bold">{game.homeTeam.abbrev}</span>
            </div>
          </td>
          {Array.from({ length: totalPeriods }).map((_, index) => {
            const periodNumber = index + 1;
            const period = linescore.byPeriod.find(p => p.periodDescriptor.number === periodNumber);
            
            return (
              <td className="text-center border" key={periodNumber}>
                {period ? period.home : '–'}
              </td>
            );
          })}
          <td className="text-center border p-2 font-bold">
            {linescore.totals.home}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

Scoreboard.propTypes = {
  game: PropTypes.object.isRequired,
  linescore: PropTypes.object.isRequired,
};

export default Scoreboard;
