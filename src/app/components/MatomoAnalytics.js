'use client';

import { init, push } from '@socialgouv/matomo-next';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { PropTypes } from 'prop-types';

// @url https://github.com/SocialGouv/matomo-next/issues/99#issuecomment-2146302761
const MatomoAnalytics = ({ url, siteId }) => {
  const pathname = usePathname();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (!url || !siteId) {
      return;
    }

    init({ url, siteId });
    
    return () => push(['HeatmapSessionRecording::disable']);
  }, [ url, siteId ]);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;

    } else {
      if (pathname) {
        push(['setCustomUrl', pathname]);
        push(['trackPageView']);
      }
    }
  }, [pathname]);

  return null;
};

MatomoAnalytics.propTypes = {
  url: PropTypes.string.isRequired,
  siteId: PropTypes.string.isRequired
};

export default MatomoAnalytics;
