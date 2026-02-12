import React from 'react';
import { render, screen } from '@testing-library/react';
import StatComparisonRow from './StatComparisonRow';

jest.mock('../utils/formatters', () => ({
  // Keep real util for ordinal to test conversion of numeric rank
  ...jest.requireActual('../utils/formatters'),
  formatStatValue: (_stat: string, value: number) => value.toString(),
}));

// Provide TEAM_STATS mapping
jest.mock('../utils/constants', () => ({
  TEAM_STATS: { faceoffWinningPctg: 'Face Off Win %' },
}));

describe('StatComparisonRow', () => {
  const baseTeam = (color: string, secondary: string) => ({
    data: { teamColor: color, secondaryTeamColor: secondary },
  });

  it('renders stats, bar widths and ordinal ranks', () => {
    render(
      <StatComparisonRow
        stat="faceoffWinningPctg"
        awayStat={55}
        homeStat={45}
        awayStatRank={1}
        homeStatRank={2}
        awayTeam={baseTeam('#000000', '#111111')}
        homeTeam={baseTeam('#ffffff', '#eeeeee')}
      />
    );

    // Stat numbers
    expect(screen.getByText('55')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    // Stat label center (mocked TEAM_STATS value)
    expect(screen.getByText('Face Off Win %')).toBeInTheDocument();

    // Ordinal formatting (1 -> 1st, 2 -> 2nd)
    expect(screen.getByText('1st')).toBeInTheDocument();
    expect(screen.getByText('2nd')).toBeInTheDocument();

    // Bars: first inner div should have width style roughly 54% (55/(55+45)=55%) minus 1 per component logic
    const bars = document.querySelectorAll('.relative.my-1 div[style]');
    expect(bars.length).toBe(2);
    const firstWidth = (bars[0] as HTMLElement).style.width;
    const secondWidth = (bars[1] as HTMLElement).style.width;
    expect(firstWidth).toMatch(/54/); // 55 - 1
    expect(parseFloat(secondWidth)).toBeGreaterThan(43.5);
    expect(parseFloat(secondWidth)).toBeLessThan(44.5);
  });
});
