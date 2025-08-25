'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';

interface PhotoFields { altText?: string; credit?: string }
interface PhotoImage { templateUrl: string }
interface PhotoPart { _entityId: string; image: PhotoImage; fields: PhotoFields; contentDate?: string }
interface ContentPhotoProps { part: PhotoPart }

const ContentPhoto: React.FC<ContentPhotoProps> = ({ part }) => {
  const [blurDataURL, setBlurDataURL] = useState('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
  const [isPhotoViewerVisible, setPhotoViewerVisible] = useState(false);

  useEffect(() => {
    const fetchBlurDataURL = async () => {
      const data = await fetch(part.image?.templateUrl.replace('{formatInstructions}', 't_ratio16_9-size10/f_png'));
      const base64 = await data.blob().then((blob) => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result as string);
      }));
      setBlurDataURL(base64);
    };
    fetchBlurDataURL();
  }, [part.image]);

  // Hide the photo viewer if escape key pressed
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPhotoViewerVisible(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    
  return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // blurDataURL always initialized, so no early return needed

  const { _entityId, image, fields, contentDate } = part;

  return (
    <>
      <div key={_entityId} className="my-5">
        <figure>
          <div className="relative group cursor-pointer" onClick={() => setPhotoViewerVisible(true)}>
            <Image
              src={image.templateUrl.replace('{formatInstructions}', 't_ratio16_9-size40/f_png/')}
              alt={fields.altText || 'Photo'}
              title={fields.altText || 'Photo'}
              className="w-full"
              width={832}
              height={468}
              placeholder="blur"
              blurDataURL={blurDataURL}
            />
            {fields.altText && (
              <figcaption className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {fields.altText}
              </figcaption>
            )}
          </div>
          {fields.credit && (
            <figcaption className="text-xs text-gray-500 py-2 mt-2">
              &copy; {fields.credit}
            </figcaption>
          )}
        </figure>
      </div>

      {/* Floating Photo Viewer */}
      {isPhotoViewerVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white rounded-lg w-full max-w-6xl p-4">
            <div className="flex justify-between bg-black text-white p-3 font-bold">
              <span>{fields.altText || 'Photo'}</span>
              <button onClick={() => setPhotoViewerVisible(false)}>
                <FontAwesomeIcon icon={faClose} fixedWidth className="text-xl" />
              </button>
            </div>
            <div className="relative">
              <Image
                src={image.templateUrl.replace('{formatInstructions}', 't_ratio16_9-size40/f_png/')}
                alt={fields.altText || 'Photo'}
                className="w-full"
                width={1664}
                height={936}
                placeholder="blur"
                blurDataURL={blurDataURL}
              />
              {fields.credit && (
                <div className="flex justify-between">
                  <div className="text-xs text-gray-500 py-2 mt-2">
                    &copy; {fields.credit}
                  </div>
                  <div className="text-xs text-gray-500 py-2 mt-2 text-right">
                    {dayjs(contentDate).format('lll')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContentPhoto;
