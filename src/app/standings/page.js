import React from 'react';

import StandingsTable from '@/app/components/StandingsTable';

export default async function Home() {
  let westernConference, easternConference;

  try {
    const apiStandings = await fetch('https://api-web.nhle.com/v1/standings/now', { cache: 'no-store' });
    if (!apiStandings.ok) {
      throw new Error('Failed to fetch data');
    }
    const jsonStandings = await apiStandings.json();
    westernConference = jsonStandings.standings.filter((c) => c.conferenceAbbrev === 'W');
    easternConference = jsonStandings.standings.filter((c) => c.conferenceAbbrev === 'E');

  } catch (error) {
    return (
      <div className="container mx-auto">
        <div className="text-3xl font-bold">Standings</div>
        <div className="text-lg py-2">{error.message}</div>
      </div>
    );
  }

  return (
    <div className="container px-2 mx-auto">
      <div className="text-3xl font-bold">Standings</div>
      <h2 className="text-xl py-4">Western Conference</h2>
      <StandingsTable standings={westernConference} />
      <h2 className="text-xl py-4">Eastern Conference</h2>
      <StandingsTable standings={easternConference} />

      <hr className="my-5" />
      <div className="flex gap-1">
        <div className="font-bold">Legend:</div>
        <dl className="flex gap-1 align-middle text-xs">
          <dt className="p-1 font-bold">(x)</dt>
          <dd className="p-1">Clinched Playoff spot</dd>
          <dt className="p-1 font-bold">(y)</dt>
          <dd className="p-1">Clinched Division</dd>
          <dt className="p-1 font-bold">(p)</dt>
          <dd className="p-1">Presidents&apos; Trophy</dd>
          <dt className="p-1 font-bold">(z)</dt>
          <dd className="p-1">Clinched Conference</dd>
          <dt className="p-1 font-bold">(e)</dt>
          <dd className="p-1">Eliminated</dd>
        </dl>
      </div>

    </div>
  );
}
