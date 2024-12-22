import React from 'react';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PropTypes } from 'prop-types';
import Link from 'next/link';

const FloatingVideoPlayer = ({ url, label, isVisible, onClose }) => {
  if (!isVisible) {
    return <></>;
  }

  // center on page with tailwind, video aspect ratio
  return (
    <div className={`${isVisible ? 'block' : 'hidden'} fixed inset-0 bg-black bg-opacity-50 justify-center items-center z-50`}>
      <div className="relative bg-white rounded-lg w-full max-w-3xl p-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex justify-between bg-black text-white p-3 font-bold">
          <Link href={url} target="_blank">{label}</Link>
          <button onClick={onClose}><FontAwesomeIcon icon={faClose} fixedWidth className="text-xl" /></button>
        </div>
        <div className="relative pt-[56.25%]">
          <iframe
            src={url}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            className="absolute inset-0 w-full h-full"
            loading="lazy"
            title={label}
          ></iframe>
        </div>
      </div>
    </div>
  );
};

FloatingVideoPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

FloatingVideoPlayer.defaultProps = {
  isVisible: false,
  isPlaying: true,
};

export default FloatingVideoPlayer;
