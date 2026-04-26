import React from 'react';
import type { DraftYearParam } from '@/app/types/routeParams';
import '@/app/assets/datatables.css';
import DraftHeader from '@/app/components/DraftHeader';
import type { DraftData, DraftRankingsData } from '@/app/types/draft';

const MIN_CATEGORY_ID = 1;
const MAX_CATEGORY_ID = 4;

function parseCategoryParam(value: unknown): number {
  if (typeof value !== 'string') {
    return MIN_CATEGORY_ID;
  }
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < MIN_CATEGORY_ID || parsed > MAX_CATEGORY_ID) {
    return MIN_CATEGORY_ID;
  }

  return parsed;
}

async function getDraftYearData(year: string | number): Promise<DraftData> {
  const res = await fetch(`https://api-web.nhle.com/v1/draft/picks/${year}/all`, {
    cache: 'no-store',
  });

  return res.json();
}

async function getDraftRankingsData(
  season: string | number,
  categoryId: number
): Promise<DraftRankingsData | null> {
  try {
    const res = await fetch(`https://api-web.nhle.com/v1/draft/rankings/${season}/${categoryId}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch {
    return null;
  }
}

export default async function DraftPage(props: any) {
  const resolved = (await props?.params) as DraftYearParam | Promise<DraftYearParam>;
  const { year } = await resolved;
  const searchParams = (await props?.searchParams) as
    | Record<string, string | string[] | undefined>
    | undefined;
  const categoryParam = Array.isArray(searchParams?.category)
    ? searchParams?.category[0]
    : searchParams?.category;
  const categoryId = parseCategoryParam(categoryParam);

  const draftData = await getDraftYearData(year);

  const rankingsData =
    !draftData.picks || draftData.picks.length === 0
      ? await getDraftRankingsData(year, categoryId)
      : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <DraftHeader draftData={draftData} rankingsData={rankingsData} />
    </div>
  );
}
