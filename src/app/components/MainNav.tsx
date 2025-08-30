'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import TeamsMenu from './TeamsMenu';

const MainNav: React.FC = () => {
  const pathname = usePathname();
  const isActive = (regex: RegExp) => regex.test(pathname || '');

  const [showTeamMenu, setShowTeamMenu] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setShowTeamMenu(true);
  }, [timeoutId]);

  const handleMouseLeave = useCallback(() => {
    const id = setTimeout(() => {
      setShowTeamMenu(false);
    }, 200); // 200ms delay before hiding
    setTimeoutId(id);
  }, []);

  return (
    <nav className="text-xs md:text-base bg-slate-200 dark:bg-slate-800 p-3 md:p-5 relative">
      <ul className="flex gap-4 md:gap-6">
        <li
          className={`${isActive(/^\/$/) || isActive(/^\/news/) ? 'border-solid border-b-2 border-black dark:border-white' : ''}`}
        >
          <Link href="/" className="text-black dark:text-white">
            News
          </Link>
        </li>
        <li
          className={`${isActive(/^\/video/) ? 'border-solid border-b-2 border-black dark:border-white' : ''}`}
        >
          <Link href="/video" className="text-black dark:text-white">
            Video
          </Link>
        </li>
        <li
          className={`${isActive(/^\/scores$/) ? 'border-solid border-b-2 border-black dark:border-white' : ''}`}
        >
          <Link href="/scores" className="text-black dark:text-white">
            Scores
          </Link>
        </li>
        <li
          className={`${isActive(/^\/standings$/) ? 'border-solid border-b-2 border-black dark:border-white' : ''}`}
        >
          <Link href="/standings" className="text-black dark:text-white">
            Standings
          </Link>
        </li>
        <li
          className={`${isActive(/^\/team$/) ? 'border-solid border-b-2 border-black dark:border-white' : ''}`}
        >
          <Link href="/team" className="text-black dark:text-white" onMouseEnter={handleMouseEnter}>
            Teams
          </Link>
        </li>
        <li
          className={`${isActive(/^\/playoffs/) ? 'border-solid border-b-2 border-black dark:border-white' : ''}`}
        >
          <Link href="/playoffs" className="text-black dark:text-white">
            Playoffs
          </Link>
        </li>
        <li
          className={`mr-6 ${isActive(/^\/draft/) ? 'border-solid border-b-2 border-black dark:border-white' : ''}`}
        >
          <Link href="/draft" className="text-black dark:text-white">
            Draft
          </Link>
        </li>
      </ul>
      <div
        className={`${showTeamMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                    transition-opacity duration-200 ease-in-out`}
      >
        <TeamsMenu onMouseLeave={handleMouseLeave} size="menu" />
      </div>
    </nav>
  );
};

export default MainNav;
