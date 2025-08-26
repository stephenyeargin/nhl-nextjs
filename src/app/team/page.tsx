import React from 'react';
import TeamsMenu from '@/app/components/TeamsMenu';

export const metadata = {
  title: 'Team Schedule & Stats',
  description: 'View the schedule and stats for a team in the NHL.',
};

export default async function TeamPage(): Promise<React.ReactElement> {
  metadata.title = 'Teams';

  return (
    <div className="container mx-auto px-2 py-8">
      <TeamsMenu
        size="full"
        onMouseLeave={() => {
          /* no-op for full page listing */
        }}
      />
    </div>
  );
}
