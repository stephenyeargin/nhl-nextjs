'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import TeamsMenu from './TeamsMenu';

const links = [
  { href: '/', label: 'News', match: /^\/($|news)/ },
  { href: '/video', label: 'Video', match: /^\/video/ },
  { href: '/scores', label: 'Scores', match: /^\/scores$/ },
  { href: '/standings', label: 'Standings', match: /^\/standings$/ },
  { href: '/stats', label: 'Stats', match: /^\/stats$/ },
  { href: '/team', label: 'Teams', match: /^\/team$/ },
  { href: '/playoffs', label: 'Playoffs', match: /^\/playoffs/ },
  { href: '/draft', label: 'Draft', match: /^\/draft/ },
];

const MainNav: React.FC = () => {
  const pathname = usePathname() || '';

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [showTeamMenu, setShowTeamMenu] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== 'mouse') {
        return;
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setShowTeamMenu(true);
    },
    [timeoutId]
  );

  const handleMouseLeave = useCallback(() => {
    const id = setTimeout(() => {
      setShowTeamMenu(false);
    }, 200); // 200ms delay before hiding
    setTimeoutId(id);
  }, []);

  return (
    <nav className="bg-slate-200 dark:bg-slate-800 relative">
      <div className="md:hidden flex justify-end p-3">
        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="main-nav-links"
          className="w-8 h-8 text-lg text-black dark:text-white"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} fixedWidth />
        </button>
      </div>
      <ul
        id="main-nav-links"
        className={`${menuOpen ? 'block' : 'hidden'} md:flex md:gap-6 md:p-5 border-t border-slate-300 dark:border-slate-700 md:border-0`}
      >
        {links.map(({ href, label, match }) => {
          const active = match.test(pathname);

          return (
            <li key={href}>
              <Link
                href={href}
                className={`block px-3 py-3 md:p-0 text-black dark:text-white ${active ? 'font-semibold md:font-normal md:border-solid md:border-b-2 md:border-black md:dark:border-white' : ''}`}
                aria-current={active ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
                onPointerEnter={href === '/team' ? handlePointerEnter : undefined}
              >
                {label}
              </Link>
            </li>
          );
        })}
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
