'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PropTypes } from 'prop-types';
import { getTeamDataByAbbreviation, getTeamDataByCommonName } from '../utils/teamData';

const TeamLogo = ({ src, alt, className, team, colorMode, style }) => {
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
  }, [ colorMode ]);

  // If src is empty, extract from team name
  let updatedSrc = src ? src : 'https://assets.nhle.com/logos/nhl/svg/NHL_light.svg';
  let teamData = {};
  if (!src && team) {
    teamData = getTeamDataByAbbreviation(team);
    if (teamData) {
      updatedSrc = `https://assets.nhle.com/logos/nhl/svg/${team}_light.svg`;
    } else {
      teamData = getTeamDataByCommonName(team);
      if (teamData) {
        updatedSrc = `https://assets.nhle.com/logos/nhl/svg/${teamData.abbreviation}_light.svg`;
      }
    }
  }

  // colorMode setting overrides theme
  if (colorMode) {
    updatedSrc = (colorMode === 'dark') ? updatedSrc.replace('_light', '_dark') : updatedSrc.replace('_dark', '_light');
  } else {
    updatedSrc = (theme === 'dark') ? updatedSrc.replace('_light', '_dark') : updatedSrc.replace('_dark', '_light');
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

  if (team && team.length < 5) {
    return (
      <Link href={`/team/${team}`}>
        {image}
      </Link>
    );
  }

  return image;
};

TeamLogo.propTypes = {
  src: PropTypes.string.required,
  alt: PropTypes.string.required,
  className: PropTypes.string,
  team: PropTypes.string,
  colorMode: PropTypes.string,
  style: PropTypes.object,
};

TeamLogo.defaultProps = {
  colorMode: 'auto',
  style: {},
};

export default TeamLogo;
