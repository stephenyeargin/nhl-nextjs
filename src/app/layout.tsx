import type { ReactNode } from 'react';
import React from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { env } from '@/config/env';
import localFont from 'next/font/local';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import MainNav from '@/app/components/MainNav';
import TopBarSchedule from '@/app/components/TopBarSchedule';
import DraftTicker from '@/app/components/DraftTicker';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Link from 'next/link';
import MatomoAnalytics from '@/app/components/MatomoAnalytics';
import { PlayerCardProvider } from '@/app/contexts/PlayerCardContext';
import PlayerCardPopover from '@/app/components/PlayerCardPopover';
import { getTopBarMode } from '@/lib/schedule/season';
import './globals.css';

config.autoAddCss = false;

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_SITE_NAME,
  description: env.NEXT_PUBLIC_SITE_NAME,
};

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const topBarMode = await getTopBarMode();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PlayerCardProvider>
          <MainNav />
          <section id="root">
            {topBarMode === 'draft' ? <DraftTicker /> : <TopBarSchedule />}
            {children}
          </section>
          <PlayerCardPopover />
        </PlayerCardProvider>
        <div className="bg-slate-200 dark:bg-slate-800 p-5">
          <div className="text-xs text-center">
            {env.NEXT_PUBLIC_SITE_NAME} — All trademarks are property of their respective owners. |{' '}
            <Link
              href="https://github.com/stephenyeargin/nhl-nextjs"
              className="font-bold underline"
            >
              Source Code
            </Link>
          </div>
        </div>
        {env.MATOMO_URL && env.MATOMO_SITE_ID && (
          <Suspense fallback={null}>
            <MatomoAnalytics url={env.MATOMO_URL} siteId={env.MATOMO_SITE_ID} />
          </Suspense>
        )}
        <SpeedInsights />
      </body>
    </html>
  );
}
