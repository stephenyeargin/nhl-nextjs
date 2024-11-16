import GameTile from "@/app/components/GameTile";
import Image from "next/image";
import Link from "next/link";

export default async function SchedulePage({ params }) {
  const scheduleResponse = await fetch(`https://api-web.nhle.com/v1/club-schedule-season/${params.slug}/now`, { cache: 'no-store' });
  const schedule = await scheduleResponse.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Season Schedule</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {schedule.games.map((game) => (
          <GameTile key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
