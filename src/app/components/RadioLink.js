import React, { useState } from 'react';
import Link from 'next/link';
import FloatingAudioPlayer from './FloatingAudioPlayer';
import { PropTypes } from 'prop-types';

const RadioLink = ({ m3u8Url, label }) => {
  const [isPlayerVisible, setPlayerVisible] = useState(false);

  const handleClick = (event) => {
    event.preventDefault();
    setPlayerVisible(true);
  };

  const closePlayer = () => {
    setPlayerVisible(false);
  };

  return (
    <span>
      <Link 
        href="#"
        onClick={handleClick}
        className="underline"
      >
        {label}
      </Link>

      {isPlayerVisible && (
        <FloatingAudioPlayer
          label={label}
          url={m3u8Url} 
          onClose={closePlayer} 
        />
      )}
    </span>
  );
};

RadioLink.propTypes = {
  m3u8Url: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export default RadioLink;
