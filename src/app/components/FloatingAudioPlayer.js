import { faClose, faPlay, faRadio } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import ReactPlayer from 'react-player/lazy';
import { PropTypes } from 'prop-types';

const FloatingAudioPlayer = ({ url, label, isVisible, isPlaying, onClose, onTogglePlay }) => {
  if (!isVisible) {
    return <></>;
  }

  return (
    <div className={`${isVisible ? 'block' : 'hidden'} text-xl text-white dark:text-black fixed bottom-4 right-4 z-50 w-60 bg-black dark:bg-slate-100 rounded-lg shadow-lg`}>
      <div className="p-2 flex justify-between items-center">
        {isPlaying ? (
          <FontAwesomeIcon icon={faRadio} fixedWidth onClick={() => onTogglePlay(false)} className="cursor-pointer hover:text-red-900" />
        ) : (
          <FontAwesomeIcon icon={faPlay} fixedWidth onClick={() => onTogglePlay(false)} className="cursor-pointer hover:text-blue-900" />
        )}
        <span>{label} Radio</span>
        <button onClick={onClose} className="hover:text-slate-400">
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
      <span className="hidden">
        <ReactPlayer 
          url={url} 
          playing={isPlaying} 
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
          controls={false}
        />
      </span>
    </div>
  );
};

FloatingAudioPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onTogglePlay: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

FloatingAudioPlayer.defaultProps = {
  isVisible: false,
  isPlaying: true,
};

export default FloatingAudioPlayer;
