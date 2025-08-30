import React from 'react';
import { formatTextColorByBackgroundColor } from '@/app/utils/formatters';
import TeamLogo from '@/app/components/TeamLogo';

interface LocalizedName {
  default: string;
}
interface TeamToggleTeam {
  abbrev: string;
  logo?: string;
  commonName: LocalizedName;
  placeName: LocalizedName;
  data: { teamColor?: string };
}

interface TeamToggleProps {
  homeTeam: TeamToggleTeam;
  awayTeam: TeamToggleTeam;
  activeStatTeam: 'homeTeam' | 'awayTeam';
  handleStatTeamClick: (_team: 'homeTeam' | 'awayTeam') => void;
}

const TeamToggle: React.FC<TeamToggleProps> = ({
  homeTeam,
  awayTeam,
  activeStatTeam,
  handleStatTeamClick,
}) => {
  const logos = {
    [homeTeam.abbrev]: homeTeam.logo,
    [awayTeam.abbrev]: awayTeam.logo,
  };

  return (
    <div>
      <div className="flex space-x-0">
        <button
          className="flex gap-1 items-center text-sm p-2 border border-e-0 rounded-l-md bg-inherit text-black dark:text-white"
          style={{
            backgroundColor: activeStatTeam === 'awayTeam' ? awayTeam.data.teamColor : '',
            color:
              activeStatTeam === 'awayTeam'
                ? formatTextColorByBackgroundColor(awayTeam.data.teamColor)
                : 'inherit',
          }}
          onClick={() => handleStatTeamClick('awayTeam')}
        >
          <TeamLogo
            colorMode={activeStatTeam === 'awayTeam' ? 'dark' : 'light'}
            src={logos[awayTeam.abbrev]}
            alt={awayTeam.commonName.default}
            className="w-6 h-6"
          />
          <div>
            {awayTeam.placeName.default}{' '}
            <strong>{awayTeam.commonName.default.replace(awayTeam.placeName.default, '')}</strong>
          </div>
        </button>
        <button
          className="flex gap-1 items-center text-sm p-2 border border-s-0 rounded-r-md bg-inherit text-black dark:text-white"
          style={{
            backgroundColor: activeStatTeam === 'homeTeam' ? homeTeam.data.teamColor : '',
            color:
              activeStatTeam === 'homeTeam'
                ? formatTextColorByBackgroundColor(homeTeam.data.teamColor)
                : 'inherit',
          }}
          onClick={() => handleStatTeamClick('homeTeam')}
        >
          <TeamLogo
            colorMode={activeStatTeam === 'homeTeam' ? 'dark' : 'light'}
            src={logos[homeTeam.abbrev]}
            alt={homeTeam.commonName.default}
            className="w-6 h-6"
          />
          <div>
            {homeTeam.placeName.default}{' '}
            <strong>{homeTeam.commonName.default.replace(homeTeam.placeName.default, '')}</strong>
          </div>
        </button>
      </div>
    </div>
  );
};

export default TeamToggle;
