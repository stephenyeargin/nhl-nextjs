import React from 'react';

export const formatSeriesStatus = (game, rightRail) => {
  if (rightRail.seasonSeriesWins.homeTeamWins === rightRail.seasonSeriesWins.awayTeamWins) {
    if (rightRail.seasonSeriesWins.homeTeamWins === 0) {
      return (
        <></>
      );
    }
    
    return (
      <>Series tied.</>
    );
  }
  if (rightRail.seasonSeriesWins.homeTeamWins > rightRail.seasonSeriesWins.awayTeamWins) {
    return (
      <>{game.homeTeam.placeName.default} leads {rightRail.seasonSeriesWins.homeTeamWins}-{rightRail.seasonSeriesWins.awayTeamWins}</>
    );
  }
  
  return (
    <>{game.awayTeam.placeName.default} leads {rightRail.seasonSeriesWins.awayTeamWins}-{rightRail.seasonSeriesWins.homeTeamWins}</>
  );
};

export const formatBroadcasts = (broadcasts) => {
  if (!broadcasts || broadcasts.length === 0) {
    return '';
  }
  
  return broadcasts.map((b) => `${b.network} (${b.market})`).join(', ');
};

export const formatGameDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US');
};

export const formatGameTime = (timeString) => {
  return new Date(timeString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};

export const formatStat = (value, precision) => {
  if (precision) {
    if (!value || value === 0) {
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
    return `${(value * 100).toFixed(1)}%`;
  default:
    return value;
  }
};

export const formatSecondsToGameTime = (stat) => {
  if (stat === undefined) {
    return '--';
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
  const hexColor = backgroundColor.replace('#', '');
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 125 ? '#000' : '#FFF';
};