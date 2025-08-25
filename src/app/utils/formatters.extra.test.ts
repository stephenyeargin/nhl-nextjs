import {
  formatSeriesStatus,
  formatStat,
  formatSecondsToGameTime,
  formatPeriodLabel,
  formatMarkdownContent,
  formatStatValue
} from './formatters';

describe('formatters extra coverage', () => {
  test('formatSeriesStatus tie zero wins empty', () => {
    const result = formatSeriesStatus({ homeTeam: { placeName: { default: 'Home' } }, awayTeam: { placeName: { default: 'Away' } } }, { seasonSeriesWins: { homeTeamWins: 0, awayTeamWins: 0, neededToWin: 4 } });
    expect(result).toBe('');
  });
  test('formatSeriesStatus tie non-zero', () => {
    const result = formatSeriesStatus({ homeTeam: { placeName: { default: 'Home' } }, awayTeam: { placeName: { default: 'Away' } } }, { seasonSeriesWins: { homeTeamWins: 2, awayTeamWins: 2, neededToWin: 4 } });
    expect(result).toBe('Series tied.');
  });
  test('formatSeriesStatus leads vs wins', () => {
    const baseGame: any = { homeTeam: { placeName: { default: 'Home' } }, awayTeam: { placeName: { default: 'Away' } } };
    const leading = formatSeriesStatus(baseGame, { seasonSeriesWins: { homeTeamWins: 3, awayTeamWins: 1, neededToWin: 4 } });
    expect(leading).toBe('Home leads 3-1');
    const winning = formatSeriesStatus(baseGame, { seasonSeriesWins: { homeTeamWins: 4, awayTeamWins: 2, neededToWin: 4 } });
    expect(winning).toBe('Home wins 4-2');
  });

  test('formatStat precision edge cases', () => {
    expect(formatStat(1, 3)).toBe('1.000');
    expect(formatStat(0.5, 3)).toBe('.500');
    expect(formatStat('abc', 2)).toBe('--');
    expect(formatStat(undefined, 2)).toBe('--');
    expect(formatStat(true as any, undefined, 'start')).toBe('Yes');
    expect(formatStat(false as any, undefined, 'start')).toBe('No');
  });

  test('formatSecondsToGameTime variants', () => {
    expect(formatSecondsToGameTime(undefined)).toBe('--');
    expect(formatSecondsToGameTime('05:00')).toBe('05:00');
    expect(formatSecondsToGameTime('abc')).toBe('--');
    expect(formatSecondsToGameTime(125)).toBe('2:05');
  });

  test('formatPeriodLabel branches', () => {
    expect(formatPeriodLabel({ number: 1, periodType: 'REG', maxRegulationPeriods: 3 }, true)).toBe('1st Period');
    expect(formatPeriodLabel({ number: 2, periodType: 'REG', maxRegulationPeriods: 3 }, false)).toBe('2nd');
    expect(formatPeriodLabel({ number: 3, periodType: 'REG', maxRegulationPeriods: 3 }, true)).toBe('3rd Period');
    expect(formatPeriodLabel({ number: 4, periodType: 'REG', maxRegulationPeriods: 3 }, false)).toBe('OT');
  // Provide otPeriods so earlier 'number === 4 && !otPeriods' branch is skipped to reach shootout branch
  expect(formatPeriodLabel({ number: 4, periodType: 'SO', maxRegulationPeriods: 3, otPeriods: true }, true)).toBe('Shootout');
    expect(formatPeriodLabel({ number: 5, periodType: 'OT', maxRegulationPeriods: 3 }, false)).toBe('2OT');
  });

  test('formatMarkdownContent replacements', () => {
    const md = '<forge-entity title="Player" slug="john-doe" code="player">John Doe</forge-entity>\n\n# Heading\n\n## Subhead\n\n<p>Paragraph</p> <a href="https://www.nhl.com/team">Link</a>';
    const html = formatMarkdownContent(md);
  // Anchor will have class added by formatter
  expect(html).toContain('href="/player/john-doe"');
    expect(html).toContain('/team');
    expect(html).toContain('class="text-xl font-bold mb-4"'); // h2
  });

  test('formatStatValue percentage stats', () => {
    expect(formatStatValue('powerPlayPctg', 0.123)).toBe('12.3%');
    expect(formatStatValue('faceoffWinningPctg', 0.555)).toBe('55.5%');
    expect(formatStatValue('other', 5)).toBe(5);
  });
});
