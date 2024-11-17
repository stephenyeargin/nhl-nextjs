import GameTile from "@/app/components/GameTile";
import StatsTable from "@/app/components/StatsTable";

export default async function SchedulePage({ params }) {
  const teamStatsResponse = await fetch(`https://api-web.nhle.com/v1/club-stats/${params.slug}/now`, { cache: 'no-store' });
  const scheduleResponse = await fetch(`https://api-web.nhle.com/v1/club-schedule-season/${params.slug}/now`, { cache: 'no-store' });

  const schedule = await scheduleResponse.json();
  const teamStats = await teamStatsResponse.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Team Stats</h1>
      <div className="mb-5">
        <div className="font-bold my-2">Forwards</div>
        <StatsTable stats={teamStats.skaters.filter((t) => t.positionCode !== 'D')} />
        <div className="font-bold my-2">Defensemen</div>
        <StatsTable stats={teamStats.skaters.filter((t) => t.positionCode === 'D')} />
        <div className="font-bold my-2">Goalies</div>
        <StatsTable stats={teamStats.goalies} goalieMode />
      </div>

      <h1 className="text-3xl font-bold mb-6">Season Schedule</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {schedule.games.map((game) => (
          <GameTile key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
