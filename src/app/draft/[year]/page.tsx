import React from 'react';
import '@/app/assets/datatables.css';
import standingsStyles from '@/app/components/StandingsTable.module.scss';
import TeamLogo from '@/app/components/TeamLogo';
import DraftYearSelect from '@/app/components/DraftYearSelect';

interface DraftPick {
  overallPick: number;
  teamLogoLight?: string; teamAbbrev: string; teamName?: { default?: string };
  teamPickHistory?: string;
  firstName?: { default?: string }; lastName?: { default?: string };
  positionCode?: string; countryCode?: string;
  height?: number; weight?: number;
  amateurClubName?: string; amateurLeague?: string;
  round: number;
  [k:string]: any;
}
interface DraftData {
  draftYear: number;
  draftYears: number[];
  selectableRounds: number[];
  picks: DraftPick[];
}

async function getDraftYearData(year: string | number): Promise<DraftData> {
  const res = await fetch(`https://api-web.nhle.com/v1/draft/picks/${year}/all`, { cache: 'no-store' });
  
  return res.json();
}

const roundNames = ['', 'Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5', 'Round 6', 'Round 7'];

export default async function DraftPage(props: any) {
  const resolved = await props?.params;
  const { year } = resolved || {};
  const draftData = await getDraftYearData(year);

  const picksByRound: Record<number, DraftPick[]> = draftData.selectableRounds.reduce((acc: Record<number, DraftPick[]>, round: number) => {
    acc[round] = draftData.picks.filter((pick) => pick.round === round);
    
    return acc;
  }, {} as Record<number, DraftPick[]>);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">{draftData.draftYear} NHL Entry Draft</h1>
      <div className="flex justify-center mb-8">
        <DraftYearSelect draftYears={draftData.draftYears} draftYear={draftData.draftYear} />
      </div>
      {draftData.selectableRounds.map((round) => (
        <div key={round} className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">{roundNames[round] || `Round ${round}`}</h2>
          <div className="overflow-x-auto">
            <table className={`${standingsStyles.standingsTable} border-collapse`}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Team</th>
                  <th>Player</th>
                  <th>Pos</th>
                  <th>Country</th>
                  <th>Ht/Wt</th>
                  <th>Amateur Club</th>
                </tr>
              </thead>
              <tbody>
                {picksByRound[round].map((pick) => (
                  <tr key={pick.overallPick}>
                    <td>{pick.overallPick}</td>
                    <td>
                      <div className="flex gap-2 items-center">
                        <TeamLogo
                          src={pick.teamLogoLight}
                          alt={pick.teamAbbrev}
                          className="h-8 w-8 hidden md:block"
                          team={pick.teamAbbrev}
                        />
                        <a className="font-semibold" href={`/team/${pick.teamAbbrev}`}>{pick.teamName?.default}</a>
                      </div>
                      {pick.teamAbbrev !== pick.teamPickHistory && pick.teamPickHistory && (
                        <div className="text-slate-500 ps-4 text-xs">↳ {pick.teamPickHistory.replace(/-/g, ' » ')}</div>
                      )}
                    </td>
                    <td>
                      {pick.firstName?.default || ''} {pick.lastName?.default || ''}
                    </td>
                    <td>{pick.positionCode || ''}</td>
                    <td>{pick.countryCode || ''}</td>
                    <td>{pick.height && pick.weight ? `${Math.floor(pick.height / 12)}'${pick.height % 12}" / ${pick.weight}` : ''}</td>
                    <td>{pick.amateurClubName || ''}{pick.amateurLeague ? ` (${pick.amateurLeague})` : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
