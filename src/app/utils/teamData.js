const teamData = [
  {
    'name': 'Anaheim Ducks',
    'hashtag': 'FlyTogether',
    'abbreviation': 'ANA',
    'teamColor': '#F47A38',
    'teamId': 24,
  },
  {
    'name': 'Boston Bruins',
    'hashtag': 'NHLBruins',
    'abbreviation': 'BOS',
    'teamColor': '#FFB81C',
    'teamId': 6,
  },
  {
    'name': 'Buffalo Sabres',
    'hashtag': 'SabreHood',
    'abbreviation': 'BUF',
    'teamColor': '#002654',
    'teamId': 7,
  },
  {
    'name': 'Calgary Flames',
    'hashtag': 'Flames',
    'abbreviation': 'CGY',
    'teamColor': '#C8102E',
    'teamId': 20,
  },
  {
    'name': 'Carolina Hurricanes',
    'hashtag': 'RaiseUp',
    'abbreviation': 'CAR',
    'teamColor': '#CC0000',
    'teamId': 12,
  },
  {
    'name': 'Chicago Blackhawks',
    'hashtag': 'Blackhawks',
    'abbreviation': 'CHI',
    'teamColor': '#CF0A2C',
    'teamId': 16,
  },
  {
    'name': 'Colorado Avalanche',
    'hashtag': 'GoAvsGo',
    'abbreviation': 'COL',
    'teamColor': '#6F263D',
    'teamId': 21,
  },
  {
    'name': 'Columbus Blue Jackets',
    'hashtag': 'CBJ',
    'abbreviation': 'CBJ',
    'teamColor': '#002654',
    'teamId': 29,
  },
  {
    'name': 'Dallas Stars',
    'hashtag': 'TexasHockey',
    'abbreviation': 'DAL',
    'teamColor': '#006847',
    'teamId': 25,
  },
  {
    'name': 'Detroit Red Wings',
    'hashtag': 'LGRW',
    'abbreviation': 'DET',
    'teamColor': '#CE1126',
    'teamId': 17,
  },
  {
    'name': 'Edmonton Oilers',
    'hashtag': 'LetsGoOilers',
    'abbreviation': 'EDM',
    'teamColor': '#041E42',
    'teamId': 22,
  },
  {
    'name': 'Florida Panthers',
    'hashtag': 'TimeToHunt',
    'abbreviation': 'FLA',
    'teamColor': '#041E42',
    'teamId': 13,
  },
  {
    'name': 'Los Angeles Kings',
    'hashtag': 'GoKingsGo',
    'abbreviation': 'LAK',
    'teamColor': '#111111',
    'teamId': 26,
  },
  {
    'name': 'Minnesota Wild',
    'hashtag': 'MNWild',
    'abbreviation': 'MIN',
    'teamColor': '#154734',
    'teamId': 30,
  },
  {
    'name': 'Montréal Canadiens',
    'hashtag': 'GoHabsGo',
    'abbreviation': 'MTL',
    'teamColor': '#AF1E2D',
    'teamId': 8,
  },
  {
    'name': 'Nashville Predators',
    'hashtag': 'Smashville',
    'abbreviation': 'NSH',
    'teamColor': '#FFB81C',
    'teamId': 18,
  },
  {
    'name': 'New Jersey Devils',
    'hashtag': 'NJDevils',
    'abbreviation': 'NJD',
    'teamColor': '#CE1126',
    'teamId': 1,
  },
  {
    'name': 'New York Islanders',
    'hashtag': 'Isles',
    'abbreviation': 'NYI',
    'teamColor': '#00539B',
    'teamId': 2,
  },
  {
    'name': 'New York Rangers',
    'hashtag': 'NYR',
    'abbreviation': 'NYR',
    'teamColor': '#0038A8',
    'teamId': 3,
  },
  {
    'name': 'Ottawa Senators',
    'hashtag': 'GoSensGo',
    'abbreviation': 'OTT',
    'teamColor': '#C52032',
    'teamId': 9,
  },
  {
    'name': 'Philadelphia Flyers',
    'hashtag': 'LetsGoFlyers',
    'abbreviation': 'PHI',
    'teamColor': '#F74902',
    'teamId': 4,
  },
  {
    'name': 'Pittsburgh Penguins',
    'hashtag': 'LetsGoPens',
    'abbreviation': 'PIT',
    'teamColor': '#000000',
    'teamId': 5,
  },
  {
    'name': 'St. Louis Blues',
    'hashtag': 'STLBlues',
    'abbreviation': 'STL',
    'teamColor': '#002F87',
    'teamId': 19,
  },
  {
    'name': 'San Jose Sharks',
    'hashtag': 'TheFutureIsTeal',
    'abbreviation': 'SJS',
    'teamColor': '#006D75',
    'teamId': 28,
  },
  {
    'name': 'Seattle Kraken',
    'hashtag': 'SeaKraken',
    'abbreviation': 'SEA',
    'teamColor': '#001628',
    'teamId': 55,
  },
  {
    'name': 'Tampa Bay Lightning',
    'hashtag': 'GoBolts',
    'abbreviation': 'TBL',
    'teamColor': '#002868',
    'teamId': 14,
  },
  {
    'name': 'Toronto Maple Leafs',
    'hashtag': 'LeafsForever',
    'abbreviation': 'TOR',
    'teamColor': '#00205B',
    'teamId': 10,
  },
  {
    'name': 'Utah Hockey Club',
    'hashtag': 'UtahHC',
    'abbreviation': 'UTA',
    'teamColor': '#6CACE4',
    'teamId': 59,
  },
  {
    'name': 'Vancouver Canucks',
    'hashtag': 'Canucks',
    'abbreviation': 'VAN',
    'teamColor': '#00205B',
    'teamId': 23,
  },
  {
    'name': 'Vegas Golden Knights',
    'hashtag': 'VegasBorn',
    'abbreviation': 'VGK',
    'teamColor': '#B4975A',
    'teamId': 54,
  },
  {
    'name': 'Washington Capitals',
    'hashtag': 'ALLCAPS',
    'abbreviation': 'WSH',
    'teamColor': '#041E42',
    'teamId': 15,
  },
  {
    'name': 'Winnipeg Jets',
    'hashtag': 'GoJetsGo',
    'abbreviation': 'WPG',
    'teamColor': '#041E42',
    'teamId': 52,
  }
];

export const getTeamDataByAbbreviation = (abbreviation) => {
  const team = teamData.find((t) => t.abbreviation === abbreviation);

  return team ? team : false;
};

export const getTeamDataByCommonName = (name) => {
  const team = teamData.find((t) => t.name === name);

  return team ? team : false;
};