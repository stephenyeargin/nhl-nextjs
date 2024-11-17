export const formatSeriesStatus = (game, rightRail) => {
  if (rightRail.seasonSeriesWins.homeTeamWins === rightRail.seasonSeriesWins.awayTeamWins) {
    if (rightRail.seasonSeriesWins.homeTeamWins === 0) {
      return (
        <></>
      )
    }
    return (
      <>Series tied.</>
    )
  }
  if (rightRail.seasonSeriesWins.homeTeamWins > rightRail.seasonSeriesWins.awayTeamWins) {
    return (
      <>{game.homeTeam.placeName.default} leads {rightRail.seasonSeriesWins.homeTeamWins}-{rightRail.seasonSeriesWins.awayTeamWins}</>
    )
  }
  return (
    <>{game.awayTeam.placeName.default} leads {rightRail.seasonSeriesWins.awayTeamWins}-{rightRail.seasonSeriesWins.homeTeamWins}</>
  )
}

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
