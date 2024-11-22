const teamData = [
  {
    'name': 'Anaheim Ducks',
    'hashtag': 'FlyTogether',
    'abbreviation': 'ANA',
    'teamColor': '#F47A38'
  },
  {
    'name': 'Boston Bruins',
    'hashtag': 'NHLBruins',
    'abbreviation': 'BOS',
    'teamColor': '#FFB81C'
  },
  {
    'name': 'Buffalo Sabres',
    'hashtag': 'SabreHood',
    'abbreviation': 'BUF',
    'teamColor': '#002654'
  },
  {
    'name': 'Calgary Flames',
    'hashtag': 'Flames',
    'abbreviation': 'CGY',
    'teamColor': '#C8102E'
  },
  {
    'name': 'Carolina Hurricanes',
    'hashtag': 'RaiseUp',
    'abbreviation': 'CAR',
    'teamColor': '#CC0000'
  },
  {
    'name': 'Chicago Blackhawks',
    'hashtag': 'Blackhawks',
    'abbreviation': 'CHI',
    'teamColor': '#CF0A2C'
  },
  {
    'name': 'Colorado Avalanche',
    'hashtag': 'GoAvsGo',
    'abbreviation': 'COL',
    'teamColor': '#6F263D'
  },
  {
    'name': 'Columbus Blue Jackets',
    'hashtag': 'CBJ',
    'abbreviation': 'CBJ',
    'teamColor': '#002654'
  },
  {
    'name': 'Dallas Stars',
    'hashtag': 'TexasHockey',
    'abbreviation': 'DAL',
    'teamColor': '#006847'
  },
  {
    'name': 'Detroit Red Wings',
    'hashtag': 'LGRW',
    'abbreviation': 'DET',
    'teamColor': '#CE1126'
  },
  {
    'name': 'Edmonton Oilers',
    'hashtag': 'LetsGoOilers',
    'abbreviation': 'EDM',
    'teamColor': '#041E42'
  },
  {
    'name': 'Florida Panthers',
    'hashtag': 'TimeToHunt',
    'abbreviation': 'FLA',
    'teamColor': '#041E42'
  },
  {
    'name': 'Los Angeles Kings',
    'hashtag': 'GoKingsGo',
    'abbreviation': 'LAK',
    'teamColor': '#111111'
  },
  {
    'name': 'Minnesota Wild',
    'hashtag': 'MNWild',
    'abbreviation': 'MIN',
    'teamColor': '#154734'
  },
  {
    'name': 'Montreal Canadiens',
    'hashtag': 'GoHabsGo',
    'abbreviation': 'MTL',
    'teamColor': '#AF1E2D'
  },
  {
    'name': 'Nashville Predators',
    'hashtag': 'Smashville',
    'abbreviation': 'NSH',
    'teamColor': '#FFB81C'
  },
  {
    'name': 'New Jersey Devils',
    'hashtag': 'NJDevils',
    'abbreviation': 'NJD',
    'teamColor': '#CE1126'
  },
  {
    'name': 'New York Islanders',
    'hashtag': 'Isles',
    'abbreviation': 'NYI',
    'teamColor': '#00539B'
  },
  {
    'name': 'New York Rangers',
    'hashtag': 'NYR',
    'abbreviation': 'NYR',
    'teamColor': '#0038A8'
  },
  {
    'name': 'Ottawa Senators',
    'hashtag': 'GoSensGo',
    'abbreviation': 'OTT',
    'teamColor': '#C52032'
  },
  {
    'name': 'Philadelphia Flyers',
    'hashtag': 'LetsGoFlyers',
    'abbreviation': 'PHI',
    'teamColor': '#F74902'
  },
  {
    'name': 'Pittsburgh Penguins',
    'hashtag': 'LetsGoPens',
    'abbreviation': 'PIT',
    'teamColor': '#000000'
  },
  {
    'name': 'St. Louis Blues',
    'hashtag': 'STLBlues',
    'abbreviation': 'STL',
    'teamColor': '#002F87'
  },
  {
    'name': 'San Jose Sharks',
    'hashtag': 'TheFutureIsTeal',
    'abbreviation': 'SJS',
    'teamColor': '#006D75'
  },
  {
    'name': 'Seattle Kraken',
    'hashtag': 'SeaKraken',
    'abbreviation': 'SEA',
    'teamColor': '#001628'
  },
  {
    'name': 'Tampa Bay Lightning',
    'hashtag': 'GoBolts',
    'abbreviation': 'TBL',
    'teamColor': '#002868'
  },
  {
    'name': 'Toronto Maple Leafs',
    'hashtag': 'LeafsForever',
    'abbreviation': 'TOR',
    'teamColor': '#00205B'
  },
  {
    'name': 'Utah Hockey Club',
    'hashtag': 'UtahHC',
    'abbreviation': 'UTA',
    'teamColor': '#6CACE4'
  },
  {
    'name': 'Vancouver Canucks',
    'hashtag': 'Canucks',
    'abbreviation': 'VAN',
    'teamColor': '#00205B'
  },
  {
    'name': 'Vegas Golden Knights',
    'hashtag': 'VegasBorn',
    'abbreviation': 'VGK',
    'teamColor': '#B4975A'
  },
  {
    'name': 'Washington Capitals',
    'hashtag': 'ALLCAPS',
    'abbreviation': 'WSH',
    'teamColor': '#041E42'
  },
  {
    'name': 'Winnipeg Jets',
    'hashtag': 'GoJetsGo',
    'abbreviation': 'WPG',
    'teamColor': '#C8102E'
  }
];

export const getTeamDataByAbbreviation = (abbreviation) => {
  const team = teamData.find((t) => t.abbreviation === abbreviation);

  return team ? team : false;
};
