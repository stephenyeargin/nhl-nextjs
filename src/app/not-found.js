import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHockeyPuck } from '@fortawesome/free-solid-svg-icons';
 
export default function NotFound() {
  return (
    <div className="text-center m-auto flex items-center justify-center" style={{ minHeight: '60vh'}}>
      <div>
        <h2 className="text-2xl font-bold mb-10"><FontAwesomeIcon icon={faHockeyPuck} fixedWidth /> 404 Not Found</h2>
        <Link href="/" className="font-bold underline">Return Home</Link>
      </div>
    </div>
  );
}
