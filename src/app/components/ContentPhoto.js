'use react';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';

const ContentPhoto = ({ part }) => {
  const [blurDataURL, setBlurDataURL] = useState('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');

  useEffect(() => {
    const fetchBlurDataURL = async () => {
      const data = await fetch(part.image?.templateUrl.replace('{formatInstructions}', 't_ratio16_9-size10/f_png'));
      const base64 = await data.blob().then((blob) => new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result);
      }));
      setBlurDataURL(base64);
    };
    fetchBlurDataURL();
  }, [part.image]);

  if (blurDataURL === null) {
    return <></>;
  }

  const { _entityId, image, fields } = part;

  return (
    <div key={_entityId} className="my-5">
      <figure>
        <Image
          src={image.templateUrl.replace('{formatInstructions}', 't_ratio16_9-size40/f_png/')}
          alt={fields.altText || 'Photo'}
          className="w-full"
          width={832}
          height={468}
          placeholder="blur"
          blurDataURL={blurDataURL}
        />
        {fields.credit && (
          <figcaption className="text-xs text-gray-500 py-2">&copy; {fields.credit}</figcaption>
        )}
      </figure>
    </div>
  );
};

ContentPhoto.propTypes = {
  part: PropTypes.shape({
    _entityId: PropTypes.string,
    image: PropTypes.shape({
      templateUrl: PropTypes.string,
    }),
    fields: PropTypes.shape({
      altText: PropTypes.string,
      credit: PropTypes.string,
    }),
  }),
};

export default ContentPhoto;