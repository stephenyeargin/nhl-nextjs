'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getTeamDataByAbbreviation, getTeamDataByCommonName } from '../utils/teamData';

interface TeamLogoProps {
  src?: string;
  alt?: string;
  className?: string;
  team?: string;
  colorMode?: 'light' | 'dark' | 'auto';
  noLink?: boolean;
  style?: React.CSSProperties;
}

const TeamLogo: React.FC<TeamLogoProps> = ({
  src,
  alt,
  className,
  team,
  colorMode = 'auto',
  noLink = false,
  style = {},
}) => {
  const [theme, setTheme] = useState(colorMode);

  // Detecting the theme on initial load and whenever it changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = () => setTheme(mediaQuery.matches ? 'dark' : 'light');

    // Add event listener for theme changes
    mediaQuery.addEventListener('change', handleThemeChange);

    // Set the initial theme based on user preference
    handleThemeChange();

    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, [colorMode]);

  // If src is empty, extract from team name
  let updatedSrc = src ? src : 'https://assets.nhle.com/logos/nhl/svg/NHL_light.svg';
  let teamData: any = {};
  if (!src && team) {
    teamData = getTeamDataByAbbreviation(team, true);
    if (teamData.teamId) {
      updatedSrc = `https://assets.nhle.com/logos/nhl/svg/${team}_light.svg`;
    } else {
      teamData = getTeamDataByCommonName(team, true);
      if (teamData.teamId) {
        updatedSrc = `https://assets.nhle.com/logos/nhl/svg/${teamData.abbreviation}_light.svg`;
      }
    }
  }

  // Determine final logo variant: explicit light/dark override; 'auto' follows detected theme
  if (updatedSrc) {
    if (colorMode === 'dark') {
      updatedSrc = updatedSrc.replace('_light', '_dark');
    } else if (colorMode === 'light') {
      updatedSrc = updatedSrc.replace('_dark', '_light');
    } else {
      // auto mode: rely on detected theme state (dark or light)
      updatedSrc =
        theme === 'dark'
          ? updatedSrc.replace('_light', '_dark')
          : updatedSrc.replace('_dark', '_light');
    }
  }

  const image = (
    <Image
      src={updatedSrc}
      alt={alt || 'Team Logo'}
      className={className}
      width={256}
      height={256}
      style={style}
    />
  );

  if (team && team.length < 5 && !noLink) {
    return <Link href={`/team/${team}`}>{image}</Link>;
  }

  return image;
};

export default TeamLogo;
