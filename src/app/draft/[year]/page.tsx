import React from 'react';
import type { DraftYearParam } from '@/app/types/routeParams';
import '@/app/assets/datatables.css';
import DraftHeader from '@/app/components/DraftHeader';
import type { DraftData } from '@/app/types/draft';

async function getDraftYearData(year: string | number): Promise<DraftData> {
  const res = await fetch(`https://api-web.nhle.com/v1/draft/picks/${year}/all`, {
    cache: 'no-store',
  });

  return res.json();
}

export default async function DraftPage(props: any) {
  const resolved = (await props?.params) as DraftYearParam | Promise<DraftYearParam>;
  const { year } = await resolved;
  const draftData = await getDraftYearData(year);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <DraftHeader draftData={draftData} />
    </div>
  );
}
