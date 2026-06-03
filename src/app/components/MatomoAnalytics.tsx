'use client';

import { push, trackAppRouter } from '@socialgouv/matomo-next';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface MatomoAnalyticsProps {
  url: string;
  siteId: string;
}

const MatomoAnalytics = ({ url, siteId }: MatomoAnalyticsProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!url || !siteId || !pathname) {
      return;
    }

    trackAppRouter({
      url,
      siteId,
      pathname,
      searchParams: new URLSearchParams(searchParams.toString()),
    });

    return () => push(['HeatmapSessionRecording::disable']);
  }, [url, siteId, pathname, searchParams]);

  return null;
};

export default MatomoAnalytics;
