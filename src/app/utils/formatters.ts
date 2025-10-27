import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { marked } from 'marked';
import type { PlayerName } from '../types';

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

// TODO: Replace 'any' types below with richer domain models once shared types are introduced.
export const formatSeriesStatus = (game: any, rightRail: any): string => {
  const { homeTeamWins, awayTeamWins, neededToWin } = rightRail.seasonSeriesWins;
  const isTied = homeTeamWins === awayTeamWins;

  if (isTied) {
    if (homeTeamWins === 0) {
      return '';
    }

    return 'Series tied.';
  }

  const leadingTeam = homeTeamWins > awayTeamWins ? game.homeTeam : game.awayTeam;
  const leadingWins = homeTeamWins > awayTeamWins ? homeTeamWins : awayTeamWins;
  const trailingWins = homeTeamWins > awayTeamWins ? awayTeamWins : homeTeamWins;

  const status = neededToWin === leadingWins ? 'wins' : 'leads';

  return `${leadingTeam.placeName.default} ${status} ${leadingWins}-${trailingWins}`;
};

export const formatBroadcasts = (
  broadcasts: Array<{ network: string; market: string }> | undefined | null
): string => {
  if (!broadcasts || broadcasts.length === 0) {
    return 'No Broadcasts';
  }

  return broadcasts.map((b) => `${b.network} (${b.market})`).join(', ');
};

export const formatLocalizedDate = (
  dateString: string | number | Date | undefined,
  format: string = 'l'
): string => {
  return dayjs(dateString).utc(true).format(format);
};

export const formatLocalizedTime = (timeString: string | number | Date | undefined): string => {
  return dayjs(timeString).utc(true).format('LT z');
};

export const formatStat = (
  value: number | string | undefined,
  precision?: number,
  unit?: 'start' | 'time' | 'plusMinus' | string
): string | number => {
  if (unit === 'start') {
    return value ? 'Yes' : 'No';
  }

  if (unit === 'time') {
    return formatSecondsToGameTime(value);
  }

  const numeric = typeof value === 'number' ? value : Number(value);

  if (precision) {
    if (value === undefined || value === null || value === '') {
      return '--';
    }

    if (Number.isNaN(numeric)) {
      return '--';
    }
    if (numeric === 1) {
      return '1.000';
    }

    return numeric.toFixed(precision).replace(/^0\./, '.');
  }

  if (value === undefined) {
    return '--';
  }

  if (numeric && unit === 'plusMinus') {
    return Number(value) > 0 ? `+${value}` : value;
  }

  return value;
};

export const formatStatValue = (stat: string, value: number): string | number => {
  switch (stat) {
    case 'powerPlayPctg':
    case 'faceoffWinningPctg':
    case 'ppPctg':
    case 'pkPctg':
      return `${(value * 100).toFixed(1)}%`;
    default:
      return value;
  }
};

export const formatSecondsToGameTime = (stat: number | string | undefined): string => {
  if (stat === undefined) {
    return '--';
  }

  if (typeof stat === 'string' && stat.includes(':')) {
    return stat;
  }

  const numeric = typeof stat === 'number' ? stat : Number(stat);
  if (Number.isNaN(numeric)) {
    return '--';
  }
  const minutes = Math.floor(numeric / 60);
  const seconds = Math.round(numeric % 60);

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const formatSeason = (season: string | number | undefined): string => {
  if (!season) {
    return '';
  }

  const seasonString = season.toString();

  const startYear = seasonString.slice(0, 4);
  const endYear = seasonString.slice(6, 8);

  return `${startYear}-${endYear}`;
};

export const formatOrdinalNumber = (number: number | undefined): string => {
  if (number === undefined) {
    return '';
  }

  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = number % 100;

  return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
};

export const formatTextColorByBackgroundColor = (backgroundColor: string | undefined): string => {
  if (!backgroundColor) {
    return '#fff';
  }

  const hexColor = backgroundColor.replace('#', '');
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 125 ? '#000' : '#FFF';
};

export const formatPeriodLabel = (periodData: any, long: boolean = false): string => {
  const { number, periodType, otPeriods } = periodData;

  const ordinalSuffix = (n: number): string => {
    if (n === 1) {
      return 'st';
    }
    if (n === 2) {
      return 'nd';
    }
    if (n === 3) {
      return 'rd';
    }

    return 'th';
  };

  switch (true) {
    case number === 1:
      return long ? `1${ordinalSuffix(number)} Period` : `1${ordinalSuffix(number)}`;
    case number === 2:
      return long ? `2${ordinalSuffix(number)} Period` : `2${ordinalSuffix(number)}`;
    case number === 3 && number <= periodData.maxRegulationPeriods:
      return long ? `3${ordinalSuffix(number)} Period` : `3${ordinalSuffix(number)}`;
    case number === 4 && !otPeriods:
      return long ? 'Overtime' : 'OT';
    case number > periodData.maxRegulationPeriods && periodType === 'SO':
      return long ? 'Shootout' : 'SO';
    case number > periodData.maxRegulationPeriods && periodType === 'OT':
      return long ? `${number - 3}${ordinalSuffix(number - 3)} Overtime` : `${number - 3}OT`;
    default:
      return '';
  }
};

export const formatMarkdownContent = (content: string | undefined | null): string => {
  if (!content) {
    return '';
  }

  const parsed = marked.parse(content);
  const html = typeof parsed === 'string' ? parsed : String(parsed);

  return html
    .replace(
      /<forge-entity\s+title="([^"]+)"\s+slug="([^"]+)"\s+code="([^"]+)">([^<]+)<\/forge-entity>/g,
      '<a href="/$3/$2">$4</a>'
    )
    .replace(/https:\/\/www\.nhl\.com\//g, '/')
    .replace(/<p>/g, '<p class="mb-4">')
    .replace(/<a\s/g, '<a class="underline" ')
    .replace(/<h2>/g, '<h2 class="text-xl font-bold mb-4">')
    .replace(/<h3>/g, '<h3 class="text-lg font-bold mb-4">');
};

export const formatHeadTitle = (value: string | undefined): void => {
  if (value) {
    window.document.title = value;
  }
};

export const formatPlayerName = (name?: PlayerName): string => {
  if (!name) {
    return '(Unnamed)';
  }

  if (name.default) {
    return name.default;
  }

  if (name.firstName?.default && name.lastName?.default) {
    return `${name.firstName.default} ${name.lastName.default}`;
  }

  return '';
};
