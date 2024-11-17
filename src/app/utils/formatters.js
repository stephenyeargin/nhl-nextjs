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

export const formatGameTime = (timeString) => {
  return new Date(timeString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};
