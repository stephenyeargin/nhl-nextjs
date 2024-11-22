'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PropTypes } from 'prop-types';

const TeamLogo = ({ src, alt, className, team }) => {
  const [theme, setTheme] = useState('light');

  // Detecting the theme on initial load and whenever it changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = () => setTheme(mediaQuery.matches ? 'dark' : 'light');

    // Add event listener for theme changes
    mediaQuery.addEventListener('change', handleThemeChange);

    // Set the initial theme based on user preference
    handleThemeChange();

    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

  const updatedSrc = theme === 'dark' ? src.replace('_light', '_dark') : src;
  
  const image = (
    <Image
      src={updatedSrc}
      alt={alt || 'Team Logo'}
      className={className}
      width={256}
      height={256}
    />
  );

  if (team) {
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
  team: PropTypes.string
};

export default TeamLogo;
