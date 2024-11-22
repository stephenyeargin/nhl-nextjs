import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PropTypes } from 'prop-types';

const Headshot = ({ src, alt, className, size, playerId }) => {

  className += ' rounded-full bg-gradient-to-tr from-gray-500 via-gray-300 to-gray-100';

  const image = (
    <Image
      src={src}
      alt={alt}
      className={className}
      width={256}
      height={256}
      style={{ maxHeight: `${size}rem`, maxWidth: `${size}rem` }}
    />
  );

  // Wrap in player link
  if (playerId > 0) {
    return (
      <Link href={`/player/${playerId}`}>
        {image}
      </Link>
    );
  }

  return image;
};

Headshot.propTypes = {
  src: PropTypes.string.required,
  alt: PropTypes.string.required,
  className: PropTypes.string,
  size: PropTypes.string,
  playerId: PropTypes.number
};

Headshot.defaultProps = {
  className: '',
  size: '4',
  playerId: 0
};

export default Headshot;
