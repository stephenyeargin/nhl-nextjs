'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MainNav = () => {
  const pathname = usePathname();
  const isActive = (regex) => regex.test(pathname);

  return (
    <nav className="bg-slate-200 dark:bg-slate-800 p-5">
      <ul className="flex">
        <li className={`mr-6 ${isActive(/^\/$/) || isActive(/^\/news/) ? 'border-solid border-b-2 border-black dark:border-white' : ''}`} >
          <Link href="/" className="text-black dark:text-white">News</Link>
        </li>
        <li className={`mr-6 ${isActive(/^\/video/) ? 'border-solid border-b-2 border-black dark:border-white' : ''}`} >
          <Link href="/video" className="text-black dark:text-white">Video</Link>
        </li>
        <li className={`mr-6 ${isActive(/^\/scores$/) ? 'border-solid border-b-2 border-black dark:border-white' : ''}`} >
          <Link href="/scores" className="text-black dark:text-white">Scores</Link>
        </li>
        <li className={`mr-6 ${isActive(/^\/standings$/) ? 'border-solid border-b-2 border-black dark:border-white' : ''}`} >
          <Link href="/standings" className="text-black dark:text-white">Standings</Link>
        </li>
      </ul>
    </nav>
  );
};

export default MainNav;
