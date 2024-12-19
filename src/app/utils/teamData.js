const teamData = [
  {
    'name': 'Anaheim Ducks',
    'hashtag': 'FlyTogether',
    'abbreviation': 'ANA',
    'teamColor': '#cf4520',
    'teamId': 24,
  },
  {
    'name': 'Boston Bruins',
    'hashtag': 'NHLBruins',
    'abbreviation': 'BOS',
    'teamColor': '#000000',
    'teamId': 6,
  },
  {
    'name': 'Buffalo Sabres',
    'hashtag': 'SabreHood',
    'abbreviation': 'BUF',
    'teamColor': '#003087',
    'teamId': 7,
  },
  {
    'name': 'Calgary Flames',
    'hashtag': 'Flames',
    'abbreviation': 'CGY',
    'teamColor': '#c8102e',
    'teamId': 20,
  },
  {
    'name': 'Carolina Hurricanes',
    'hashtag': 'RaiseUp',
    'abbreviation': 'CAR',
    'teamColor': '#c8102e',
    'teamId': 12,
  },
  {
    'name': 'Chicago Blackhawks',
    'hashtag': 'Blackhawks',
    'abbreviation': 'CHI',
    'teamColor': '#ce1126',
    'teamId': 16,
  },
  {
    'name': 'Colorado Avalanche',
    'hashtag': 'GoAvsGo',
    'abbreviation': 'COL',
    'teamColor': '#8a2432',
    'teamId': 21,
  },
  {
    'name': 'Columbus Blue Jackets',
    'hashtag': 'CBJ',
    'abbreviation': 'CBJ',
    'teamColor': '#041e42',
    'teamId': 29,
  },
  {
    'name': 'Dallas Stars',
    'hashtag': 'TexasHockey',
    'abbreviation': 'DAL',
    'teamColor': '#00823e',
    'teamId': 25,
  },
  {
    'name': 'Detroit Red Wings',
    'hashtag': 'LGRW',
    'abbreviation': 'DET',
    'teamColor': '#c8102e',
    'teamId': 17,
  },
  {
    'name': 'Edmonton Oilers',
    'hashtag': 'LetsGoOilers',
    'abbreviation': 'EDM',
    'teamColor': '#00205b',
    'teamId': 22,
  },
  {
    'name': 'Florida Panthers',
    'hashtag': 'TimeToHunt',
    'abbreviation': 'FLA',
    'teamColor': '#c8102e',
    'teamId': 13,
  },
  {
    'name': 'Los Angeles Kings',
    'hashtag': 'GoKingsGo',
    'abbreviation': 'LAK',
    'teamColor': '#8a9599',
    'teamId': 26,
  },
  {
    'name': 'Minnesota Wild',
    'hashtag': 'MNWild',
    'abbreviation': 'MIN',
    'teamColor': '#0e4431',
    'teamId': 30,
  },
  {
    'name': 'Montréal Canadiens',
    'hashtag': 'GoHabsGo',
    'abbreviation': 'MTL',
    'teamColor': '#a6192e',
    'teamId': 8,
  },
  {
    'name': 'Nashville Predators',
    'hashtag': 'Smashville',
    'abbreviation': 'NSH',
    'teamColor': '#ffb81c',
    'teamId': 18,
  },
  {
    'name': 'New Jersey Devils',
    'hashtag': 'NJDevils',
    'abbreviation': 'NJD',
    'teamColor': '#cc0000',
    'teamId': 1,
  },
  {
    'name': 'New York Islanders',
    'hashtag': 'Isles',
    'abbreviation': 'NYI',
    'teamColor': '#00468b',
    'teamId': 2,
  },
  {
    'name': 'New York Rangers',
    'hashtag': 'NYR',
    'abbreviation': 'NYR',
    'teamColor': '#0033a0',
    'teamId': 3,
  },
  {
    'name': 'Ottawa Senators',
    'hashtag': 'GoSensGo',
    'abbreviation': 'OTT',
    'teamColor': '#c8102e',
    'teamId': 9,
  },
  {
    'name': 'Philadelphia Flyers',
    'hashtag': 'LetsGoFlyers',
    'abbreviation': 'PHI',
    'teamColor': '#d24303',
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
    'teamColor': '#004986',
    'teamId': 19,
  },
  {
    'name': 'San Jose Sharks',
    'hashtag': 'TheFutureIsTeal',
    'abbreviation': 'SJS',
    'teamColor': '#00778b',
    'teamId': 28,
  },
  {
    'name': 'Seattle Kraken',
    'hashtag': 'SeaKraken',
    'abbreviation': 'SEA',
    'teamColor': '#001425',
    'teamId': 55,
  },
  {
    'name': 'Tampa Bay Lightning',
    'hashtag': 'GoBolts',
    'abbreviation': 'TBL',
    'teamColor': '#00205b',
    'teamId': 14,
  },
  {
    'name': 'Toronto Maple Leafs',
    'hashtag': 'LeafsForever',
    'abbreviation': 'TOR',
    'teamColor': '#00205b',
    'teamId': 10,
  },
  {
    'name': 'Utah Hockey Club',
    'hashtag': 'UtahHC',
    'abbreviation': 'UTA',
    'teamColor': '#5392c9',
    'teamId': 59,
  },
  {
    'name': 'Vancouver Canucks',
    'hashtag': 'Canucks',
    'abbreviation': 'VAN',
    'teamColor': '#00205b',
    'teamId': 23,
  },
  {
    'name': 'Vegas Golden Knights',
    'hashtag': 'VegasBorn',
    'abbreviation': 'VGK',
    'teamColor': '#333f48',
    'teamId': 54,
  },
  {
    'name': 'Washington Capitals',
    'hashtag': 'ALLCAPS',
    'abbreviation': 'WSH',
    'teamColor': '#c8102e',
    'teamId': 15,
  },
  {
    'name': 'Winnipeg Jets',
    'hashtag': 'GoJetsGo',
    'abbreviation': 'WPG',
    'teamColor': '#041e42',
    'teamId': 52,
  }
];

const defaultTeam = {
  'name': 'NHL',
  'hashtag': 'NHL',
  'abbreviation': 'NHL',
  'teamColor': '#010101',
  'teamId': 0,
};

export const getTeamDataByAbbreviation = (abbreviation) => {
  const team = teamData.find((t) => t.abbreviation === abbreviation);

  return team ? team : defaultTeam;
};

export const getTeamDataByCommonName = (name) => {
  const team = teamData.find((t) => t.name === name);

  return team ? team : defaultTeam;
};