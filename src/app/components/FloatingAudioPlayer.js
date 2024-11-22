import { faClose, faRadio } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import ReactPlayer from 'react-player/lazy';
import { PropTypes } from 'prop-types';

const FloatingAudioPlayer = ({ url, label, onClose }) => {
  return (
    <div className="text-xl text-white dark:text-black fixed bottom-4 right-4 z-50 w-60 bg-black dark:bg-slate-100 rounded-lg shadow-lg">
      <div className="p-2 flex justify-between items-center">
        <FontAwesomeIcon icon={faRadio} />
        <span>{label} Radio</span>
        <button onClick={onClose} className="hover:text-slate-400">
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
      <span className="hidden">
        <ReactPlayer 
          url={url} 
          playing={true} 
          width="100%" 
          height="2rem"
          config={{
            file: {
              forceAudio: true,
              forceVideo: false,
              attributes: {
                preload: 'auto'
              }
            }
          }}
          controls={true}
        />
      </span>
    </div>
  );
};

FloatingAudioPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

export default FloatingAudioPlayer;
