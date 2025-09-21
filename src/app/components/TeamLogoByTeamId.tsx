'use client';

import React from 'react';
import TeamLogo from './TeamLogo';

type BasicTeam = {
  id?: number | string;
  abbrev: string;
  logo?: string;
};

interface TeamLogoByTeamIdProps {
  teamId?: number | string;
  homeTeam: BasicTeam;
  awayTeam: BasicTeam;
  size?: number; // Tailwind size token like 10, 12, 16
  theme?: 'light' | 'dark' | 'auto' | undefined;
  className?: string;
}

const TeamLogoByTeamId: React.FC<TeamLogoByTeamIdProps> = ({
  teamId,
  homeTeam,
  awayTeam,
  size,
  theme,
  className,
}) => {
  let computedClassName = className || 'h-10 w-10';
  if (size) {
    computedClassName = `h-${size} w-${size}`;
  }

  if (teamId === awayTeam.id) {
    return (
      <TeamLogo
        src={awayTeam.logo}
        alt={awayTeam.abbrev}
        className={computedClassName}
        colorMode={theme as any}
      />
    );
  }
  if (teamId === homeTeam.id) {
    return (
      <TeamLogo
        src={homeTeam.logo}
        alt={homeTeam.abbrev}
        className={computedClassName}
        colorMode={theme as any}
      />
    );
  }

  return null;
};

export default TeamLogoByTeamId;
