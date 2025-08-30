import { faClose, faPlay, faRadio } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import ReactPlayer from 'react-player/lazy';

interface FloatingAudioPlayerProps {
  url: string;
  label: string;
  isVisible?: boolean;
  isPlaying?: boolean;
  onClose: () => void;
  onTogglePlay: (_play: boolean) => void;
}

const FloatingAudioPlayer: React.FC<FloatingAudioPlayerProps> = ({
  url,
  label,
  isVisible = false,
  isPlaying = true,
  onClose,
  onTogglePlay,
}) => {
  if (!isVisible) {
    return <></>;
  }

  return (
    <div
      className={`${isVisible ? 'block' : 'hidden'} text-xl text-white dark:text-black fixed bottom-4 right-4 z-50 w-60 bg-black dark:bg-slate-100 rounded-lg shadow-lg`}
    >
      <div className="p-2 flex justify-between items-center">
        {isPlaying ? (
          <FontAwesomeIcon
            icon={faRadio}
            fixedWidth
            onClick={() => onTogglePlay(false)}
            className="cursor-pointer hover:text-red-900"
          />
        ) : (
          <FontAwesomeIcon
            icon={faPlay}
            fixedWidth
            onClick={() => onTogglePlay(false)}
            className="cursor-pointer hover:text-blue-600"
          />
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
                preload: 'auto',
              },
            },
          }}
          controls={false}
        />
      </span>
    </div>
  );
};

export default FloatingAudioPlayer;
