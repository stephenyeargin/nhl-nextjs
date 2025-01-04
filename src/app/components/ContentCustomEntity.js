import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import { formatMarkdownContent } from '../utils/formatters';

const ContentCustomEntity = ({ part }) => {
  const [blurDataURL, setBlurDataURL] = useState('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');

  useEffect(() => {
    const fetchBlurDataURL = async () => {
      if (part?.thumbnail?.templateUrl) {
        const data = await fetch(part.thumbnail?.templateUrl.replace('{formatInstructions}', 't_ratio16_9-size10/f_png'));
        const base64 = await data.blob().then((blob) => new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => resolve(reader.result);
        }));
        setBlurDataURL(base64);
      }
    };
    fetchBlurDataURL();
  }, [part?.thumbnail]);

  const { _entityId, fields, contextualFields, thumbnail, entityCode, title } = part;

  if (entityCode === 'video') {
    return (
      <div key={_entityId}>
        <figure>
          <iframe
            src={`https://players.brightcove.net/${fields.brightcoveAccountId}/default_default/index.html?videoId=${fields.brightcoveId}`}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            className="w-full aspect-video"
            loading="lazy"
            title={title}
          />
          <figcaption className="my-3 text-xs text-gray-500">{fields.description || fields.longDescription}</figcaption>
        </figure>
      </div>
    );
  }

  if (entityCode === 'promo') {
    return (
      <div key={_entityId} className="my-5">
        <div className="grid grid-cols-1 lg:grid-cols-4 items-center border">
          <div className={`col-span-4 lg:col-span-2 ${/image right/.test(contextualFields?.layout) ? 'order-1' : 'order-0'}`}>
            <Link href={fields.url?.url || fields.callToAction1Link?.url || '#'} target={fields.url?.openInNewTab ? '_blank' : '_self'}>
              <Image
                src={thumbnail.templateUrl.replace('{formatInstructions}', 't_ratio16_9-size40/f_png')}
                alt={thumbnail.title}
                className="w-full"
                width={832}
                height={468}
                placeholder="blur"
                blurDataURL={blurDataURL}
                loading="lazy"
              />
            </Link>
          </div>
          <div className="col-span-4 lg:col-span-2 p-10 text-center bg-slate-200 dark:bg-slate-800 flex h-full flex-col justify-center">
            <h3 className="text-2xl font-semibold">
              <Link href={fields.url?.url || fields.callToAction1Link?.url || '#'} target={fields.url?.openInNewTab ? '_blank' : '_self'}>{fields.headline || title}</Link>
            </h3>
            <div className="text-sm my-2" dangerouslySetInnerHTML={{__html: formatMarkdownContent(fields.description)}} />
            <div className="flex justify-center gap-4">
              {fields.callToAction1Link?.url && (
                <Link
                  href={fields.callToAction1Link.url}
                  className="inline-block mt-3 p-2 text-sm bg-blue-900 text-white rounded-lg hover:bg-blue-600"
                  target={fields.callToAction1Link.openInNewTab ? '_blank' : '_self'}
                >
                  {fields.callToAction1Link.displayText}
                </Link>
              )}
              {fields.callToAction2Link?.url && (
                <Link
                  href={fields.callToAction2Link.url}
                  className="inline-block mt-3 p-2 text-sm bg-blue-900 text-white rounded-lg hover:bg-blue-600"
                  target={fields.callToAction2Link.openInNewTab ? '_blank' : '_self'}
                >
                  {fields.callToAction2Link.displayText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (entityCode === 'player') {
    return (
      <div className="columns-1 md:columns-3 gap-8 text-justify">
        <div className="min-h-96" dangerouslySetInnerHTML={{ __html: formatMarkdownContent(fields.biography) }} />
      </div>
    );
  }

  // Show warning if unknown entity code
  console.warn(`Unknown custom entity code: ${entityCode}, rendering as empty`);

  return null;
};

ContentCustomEntity.propTypes = {
  part: PropTypes.shape({
    _entityId: PropTypes.string.isRequired,
    fields: PropTypes.object.isRequired,
    contextualFields: PropTypes.object,
    thumbnail: PropTypes.object.isRequired,
    entityCode: PropTypes.string.isRequired,
    title: PropTypes.string,
  }).isRequired,
};

export default ContentCustomEntity;
