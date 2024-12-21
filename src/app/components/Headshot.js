import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PropTypes } from 'prop-types';
import { getTeamDataByAbbreviation } from '../utils/teamData';

const Headshot = ({ src, alt, className, size, playerId, team }) => {
  let style = { maxHeight: `${size}rem`, maxWidth: `${size}rem` };
  if (team) {
    const { teamColor, secondaryTeamColor } = getTeamDataByAbbreviation(team);
    style.backgroundColor = teamColor;
    style.backgroundImage = `linear-gradient(to bottom, ${teamColor}, #FFFFFF)`;
    style.border = `2px solid ${secondaryTeamColor}`;
  }

  className += ' rounded-full bg-gradient-to-tr from-gray-500 via-gray-300 to-gray-100 shadow-md';

  if (!src) {
    return (
      <div className={className} />
    );
  }

  const image = (
    <Image
      src={src}
      alt={alt}
      className={className}
      width={256}
      height={256}
      style={style}
    />
  );

  // Wrap in player link
  if (playerId > 0) {
    return (
      <div className="flex justify-center">
        <Link href={`/player/${playerId}`}>
          {image}
        </Link>
      </div>
    );
  }

  return image;
};

Headshot.propTypes = {
  src: PropTypes.string.required,
  alt: PropTypes.string.required,
  className: PropTypes.string,
  size: PropTypes.string,
  playerId: PropTypes.number,
  team: PropTypes.string
};

Headshot.defaultProps = {
  className: '',
  size: '4',
  playerId: 0
};

export default Headshot;
