import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { marked } from 'marked';

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

export const formatSeriesStatus = (game, rightRail) => {
  const { homeTeamWins, awayTeamWins, neededToWin } = rightRail.seasonSeriesWins;
  const isTied = homeTeamWins === awayTeamWins;

  if (isTied) {
    if (homeTeamWins === 0) {return <></>;}
    
    return <>Series tied.</>;
  }

  const leadingTeam = homeTeamWins > awayTeamWins ? game.homeTeam : game.awayTeam;
  const leadingWins = homeTeamWins > awayTeamWins ? homeTeamWins : awayTeamWins;
  const trailingWins = homeTeamWins > awayTeamWins ? awayTeamWins : homeTeamWins;
  
  const status = neededToWin === leadingWins ? 'wins' : 'leads';
  
  return (
    <>{leadingTeam.placeName.default} {status} {leadingWins}-{trailingWins}</>
  );
};

export const formatBroadcasts = (broadcasts) => {
  if (!broadcasts || broadcasts.length === 0) {
    return 'No Broadcasts';
  }
  
  return broadcasts.map((b) => `${b.network} (${b.market})`).join(', ');
};

export const formatLocalizedDate = (dateString, format='l') => {
  return dayjs(dateString).utc(true).format(format);
};

export const formatLocalizedTime = (timeString) => {
  return dayjs(timeString).utc(true).format('LT z');
};

export const formatStat = (value, precision, unit) => {
  if (unit === 'time') {
    return formatSecondsToGameTime(value);
  }

  if (precision) {
    if (value === undefined) {
      return '--';
    }
    if (value === 1) {
      return '1.000';
    }
    
    return value.toFixed(precision).replace(/^0\./, '.');
  }

  if (value === undefined) {
    return '--';
  }
  
  return value;
};

export const formatStatValue = (stat, value) => {
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

export const formatSecondsToGameTime = (stat) => {
  if (stat === undefined) {
    return '--';
  }

  if (typeof stat === 'string' && stat.includes(':')) {
    return stat;
  }
  
  const minutes = Math.floor(stat / 60);
  const seconds = Math.round(stat % 60);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const formatSeason = (season) => {
  if (!season) {
    return '';
  }
  
  const seasonString = season.toString();

  const startYear = seasonString.slice(0, 4);
  const endYear = seasonString.slice(6, 8);
  
  return `${startYear}-${endYear}`;
};

export const formatOrdinalNumber = (number) => {
  if (number === undefined) {
    return '';
  }

  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = number % 100;
  
  return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
};

export const formatTextColorByBackgroundColor = (backgroundColor) => {
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

export const formatPeriodLabel = (periodData, long=false) => {
  const { number, periodType, otPeriods } = periodData;

  const ordinalSuffix = (n) => {
    if (n === 1) {return 'st';}
    if (n === 2) {return 'nd';}
    if (n === 3) {return 'rd';}
    
    return 'th';
  };

  switch (true) {
  case number === 1:
    return long ? `1${ordinalSuffix(number)} Period` : `1${ordinalSuffix(number)}`;
  case number === 2:
    return long ? `2${ordinalSuffix(number)} Period` : `2${ordinalSuffix(number)}`;
  case number === 3:
    return long ? `3${ordinalSuffix(number)} Period` : `3${ordinalSuffix(number)}`;
  case number === 4 && !otPeriods:
    return long ? 'Overtime' : 'OT';
  case number === 5 && periodType === 'SO':
    return long ? 'Shootout' : 'SO';
  case number > 3 && periodType === 'OT':
    return long ? `${number - 3}${ordinalSuffix(number - 3)} Overtime` : `${number - 3}OT`;
  default:
    return '';
  }
};

export const formatMarkdownContent = (content) => {
  return marked.parse(content)
    .replace(/<forge-entity\s+title="([^"]+)"\s+slug="([^"]+)"\s+code="([^"]+)">([^<]+)<\/forge-entity>/g, '<a href="/$3/$2">$4</a>')
    .replace(/<p>/g, '<p class="mb-4">')
    .replace(/<a\s/g, '<a class="underline" ')
    .replace(/<h2>/g, '<h2 class="text-xl font-bold mb-4">')
    .replace(/<h3>/g, '<h3 class="text-lg font-bold mb-4">');
};

export const formatHeadTitle = (value) => {
  window.document.title = value || undefined;
};
