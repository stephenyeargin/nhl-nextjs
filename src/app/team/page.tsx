import React from 'react';
import TeamsMenu from '@/app/components/TeamsMenu';

export const metadata = {
  title: 'Teams',
  description: 'View the schedule and stats for a team in the NHL.',
};

// ISR: Revalidate team list every 24 hours
export const revalidate = 86400;

export default async function TeamPage(): Promise<React.ReactElement> {
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
