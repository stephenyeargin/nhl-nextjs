import React, { useState } from 'react';
import Link from 'next/link';
import { FloatingAudioPlayer } from './FloatingAudioPlayer';

export const RadioLink = ({ m3u8Url, label }) => {
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
