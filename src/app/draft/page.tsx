import React from 'react';
import DraftYearPage from './[year]/page';

export default async function DraftPage(props: {
  searchParams?:
    | Record<string, string | string[] | undefined>
    | Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <DraftYearPage
      params={{ year: String(new Date().getFullYear()) }}
      searchParams={props?.searchParams}
    />
  );
}
