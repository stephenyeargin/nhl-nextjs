'use client';

import Link from "next/link"
import { usePathname } from "next/navigation";

export default function MainNav({}) {
  const pathname = usePathname();
  const isActive = (regex) => regex.test(pathname);

  return (
    <nav className="bg-white border-slate-200 bg-slate-200 dark:bg-slate-800 p-5">
    <ul className="flex">
      <li className={`mr-6 ${isActive(/^\/$/) ? 'border-solid border-b-2 border-black dark:border-white' : ''}`} >
        <Link href="/" className="text-black dark:text-white hover:text-blue-800">Standings</Link>
      </li>
    </ul>
  </nav>
  );
}