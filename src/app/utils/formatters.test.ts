import {
  formatSeriesStatus,
  formatBroadcasts,
  formatLocalizedDate,
  formatLocalizedTime,
  formatStat,
  formatStatValue,
  formatSecondsToGameTime,
  formatSeason,
  formatOrdinalNumber,
  formatTextColorByBackgroundColor,
  formatPeriodLabel,
  formatMarkdownContent,
} from './formatters';

describe('formatters', () => {
  test('formatSeriesStatus basic paths', () => {
    const game: any = { homeTeam: { placeName: { default: 'Home' } }, awayTeam: { placeName: { default: 'Away' } } };
    const rightRail: any = { seasonSeriesWins: { homeTeamWins: 0, awayTeamWins: 0, neededToWin: 4 } };
    expect(formatSeriesStatus(game, rightRail)).toBe('');
    rightRail.seasonSeriesWins.homeTeamWins = 1; rightRail.seasonSeriesWins.awayTeamWins = 1;
    expect(formatSeriesStatus(game, rightRail)).toBe('Series tied.');
    rightRail.seasonSeriesWins.homeTeamWins = 2; rightRail.seasonSeriesWins.awayTeamWins = 1;
    expect(formatSeriesStatus(game, rightRail)).toMatch(/Home leads 2-1/);
  });

  test('formatBroadcasts', () => {
    expect(formatBroadcasts(undefined)).toBe('No Broadcasts');
    expect(formatBroadcasts([])).toBe('No Broadcasts');
    expect(formatBroadcasts([{ network: 'NHLN', market: 'Home' }])).toBe('NHLN (Home)');
  });

  test('formatLocalizedDate and Time', () => {
    const d = '2024-10-01T00:00:00Z';
    expect(formatLocalizedDate(d)).toBeTruthy();
    expect(formatLocalizedTime(d)).toContain(':');
  });

  test('formatStat precision and edge cases', () => {
    expect(formatStat(undefined, 3)).toBe('--');
    expect(formatStat('abc', 2)).toBe('--');
    expect(formatStat(0.1234, 3)).toBe('.123');
    expect(formatStat(1, 3)).toBe('1.000');
    expect(formatStat(1, undefined)).toBe(1);
    expect(formatStat(0, undefined, 'start')).toBe('No');
    expect(formatStat(12, undefined, 'start')).toBe('Yes');
    expect(formatStat(125, undefined, 'time')).toBe('2:05');
  });

  test('formatStatValue percentages', () => {
    expect(formatStatValue('powerPlayPctg', 0.123)).toBe('12.3%');
    expect(formatStatValue('goals', 5)).toBe(5);
  });

  test('formatSecondsToGameTime', () => {
    expect(formatSecondsToGameTime(undefined)).toBe('--');
    expect(formatSecondsToGameTime('1:23')).toBe('1:23');
    expect(formatSecondsToGameTime(125)).toBe('2:05');
    expect(formatSecondsToGameTime('abc')).toBe('--');
  });

  test('formatSeason', () => {
    expect(formatSeason(undefined)).toBe('');
    expect(formatSeason('20242025')).toBe('2024-25');
  });

  test('formatOrdinalNumber', () => {
    expect(formatOrdinalNumber(undefined)).toBe('');
    expect(formatOrdinalNumber(1)).toBe('1st');
    expect(formatOrdinalNumber(2)).toBe('2nd');
    expect(formatOrdinalNumber(3)).toBe('3rd');
    expect(formatOrdinalNumber(4)).toBe('4th');
  });

  test('formatTextColorByBackgroundColor', () => {
    expect(formatTextColorByBackgroundColor(undefined)).toBe('#fff');
    expect(formatTextColorByBackgroundColor('#ffffff')).toBe('#000');
    expect(formatTextColorByBackgroundColor('#000000')).toBe('#FFF');
  });

  test('formatPeriodLabel', () => {
    const base: any = { maxRegulationPeriods: 3, periodType: 'REG', otPeriods: 0 };
    expect(formatPeriodLabel({ ...base, number: 1 })).toBe('1st');
    expect(formatPeriodLabel({ ...base, number: 4 }, true)).toBe('Overtime');
    expect(formatPeriodLabel({ ...base, number: 5, periodType: 'SO' })).toBe('SO');
    expect(formatPeriodLabel({ ...base, number: 5, periodType: 'OT' })).toBe('2OT');
  });

  test('formatMarkdownContent', () => {
    const md = '# Title\n\n[Link](https://www.nhl.com/somewhere)';
    const html = formatMarkdownContent(md);
    expect(html).toContain('underline');
    expect(html).not.toContain('https://www.nhl.com');
  });
});
