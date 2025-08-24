import React, { ReactNode } from 'react';
import localFont from 'next/font/local';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import MainNav from '@/app/components/MainNav';
import TopBarSchedule from '@/app/components/TopBarSchedule';
import DraftTicker from './components/DraftTicker';
import Link from 'next/link';
import './globals.css';
import MatomoAnalytics from './components/MatomoAnalytics';

config.autoAddCss = false;

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
});

export const metadata = {
  title: 'NHL Next.js',
  description: 'NHL Next.js'
};

function isDraftSeason(): boolean {
  const now = new Date();
  const year = now.getFullYear();
  const june15 = new Date(year, 5, 15);
  const july15 = new Date(year, 6, 15);
  
  return now >= june15 && now < july15;
}

interface RootLayoutProps { children: ReactNode }

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MainNav />
        <section id="root">
          {isDraftSeason() ? <DraftTicker /> : <TopBarSchedule />}
          {children}
        </section>
        <div className="bg-slate-200 dark:bg-slate-800 p-5">
          <div className="text-xs text-center">All trademarks are property of their respective owners. | <Link href="https://github.com/stephenyeargin/nhl-nextjs" className="font-bold underline">Source Code</Link></div>
        </div>
        {process.env.MATOMO_URL && process.env.MATOMO_SITE_ID && (
          <MatomoAnalytics url={process.env.MATOMO_URL} siteId={process.env.MATOMO_SITE_ID} />
        )}
      </body>
    </html>
  );
}
