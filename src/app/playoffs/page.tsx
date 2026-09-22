import React from 'react';
import PlayoffsYearPage from './[year]/page';

export default async function PlayoffsPage() {
  return <PlayoffsYearPage params={{ year: String(new Date().getFullYear()) }} />;
}
