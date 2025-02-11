const teamData = [
  {
    name: 'Anaheim Ducks',
    slug: 'ducks',
    hashtag: 'FlyTogether',
    abbreviation: 'ANA',
    teamColor: '#cf4520',
    secondaryTeamColor: '#89734c',
    teamId: 24,
  },
  {
    name: 'Boston Bruins',
    slug: 'bruins',
    hashtag: 'NHLBruins',
    abbreviation: 'BOS',
    teamColor: '#FFB81C',
    secondaryTeamColor: '#000000',
    teamId: 6,
  },
  {
    name: 'Buffalo Sabres',
    slug: 'sabres',
    hashtag: 'SabreHood',
    abbreviation: 'BUF',
    teamColor: '#003087',
    secondaryTeamColor: '#FFB81C',
    teamId: 7,
  },
  {
    name: 'Calgary Flames',
    slug: 'flames',
    hashtag: 'Flames',
    abbreviation: 'CGY',
    teamColor: '#c8102e',
    secondaryTeamColor: '#FAAF19',
    teamId: 20,
  },
  {
    name: 'Carolina Hurricanes',
    slug: 'hurricanes',
    hashtag: 'RaiseUp',
    abbreviation: 'CAR',
    teamColor: '#c8102e',
    secondaryTeamColor: '#FFFFFF',
    teamId: 12,
  },
  {
    name: 'Chicago Blackhawks',
    slug: 'blackhawks',
    hashtag: 'Blackhawks',
    abbreviation: 'CHI',
    teamColor: '#ce1126',
    secondaryTeamColor: '#FF671B',
    teamId: 16,
  },
  {
    name: 'Colorado Avalanche',
    slug: 'avalanche',
    hashtag: 'GoAvsGo',
    abbreviation: 'COL',
    teamColor: '#8a2432',
    secondaryTeamColor: '#236192',
    teamId: 21,
  },
  {
    name: 'Columbus Blue Jackets',
    slug: 'bluejackets',
    hashtag: 'CBJ',
    abbreviation: 'CBJ',
    teamColor: '#041e42',
    secondaryTeamColor: '#ce1126',
    teamId: 29,
  },
  {
    name: 'Dallas Stars',
    slug: 'stars',
    hashtag: 'TexasHockey',
    abbreviation: 'DAL',
    teamColor: '#00823e',
    secondaryTeamColor: '#8F8F8C',
    teamId: 25,
  },
  {
    name: 'Detroit Red Wings',
    slug: 'redwings',
    hashtag: 'LGRW',
    abbreviation: 'DET',
    teamColor: '#c8102e',
    secondaryTeamColor: '#FFFFFF',
    teamId: 17,
  },
  {
    name: 'Edmonton Oilers',
    slug: 'oilers',
    hashtag: 'LetsGoOilers',
    abbreviation: 'EDM',
    teamColor: '#00205b',
    secondaryTeamColor: '#FF4C00',
    teamId: 22,
  },
  {
    name: 'Florida Panthers',
    slug: 'panthers',
    hashtag: 'TimeToHunt',
    abbreviation: 'FLA',
    teamColor: '#041E42',
    secondaryTeamColor: '#c8102E',
    teamId: 13,
  },
  {
    name: 'Los Angeles Kings',
    slug: 'kings',
    hashtag: 'GoKingsGo',
    abbreviation: 'LAK',
    teamColor: '#8a9599',
    secondaryTeamColor: '#111111',
    teamId: 26,
  },
  {
    name: 'Minnesota Wild',
    slug: 'wild',
    hashtag: 'MNWild',
    abbreviation: 'MIN',
    teamColor: '#0e4431',
    secondaryTeamColor: '#ddc9a3',
    teamId: 30,
  },
  {
    name: 'Montréal Canadiens',
    slug: 'canadiens',
    hashtag: 'GoHabsGo',
    abbreviation: 'MTL',
    teamColor: '#a6192e',
    secondaryTeamColor: '#192168',
    teamId: 8,
  },
  {
    name: 'Nashville Predators',
    slug: 'predators',
    hashtag: 'Smashville',
    abbreviation: 'NSH',
    teamColor: '#ffb81c',
    secondaryTeamColor: '#041E42',
    teamId: 18,
  },
  {
    name: 'New Jersey Devils',
    slug: 'devils',
    hashtag: 'NJDevils',
    abbreviation: 'NJD',
    teamColor: '#cc0000',
    secondaryTeamColor: '#000000',
    teamId: 1,
  },
  {
    name: 'New York Islanders',
    slug: 'islanders',
    hashtag: 'Isles',
    abbreviation: 'NYI',
    teamColor: '#00468b',
    secondaryTeamColor: '#f47d30',
    teamId: 2,
  },
  {
    name: 'New York Rangers',
    slug: 'rangers',
    hashtag: 'NYR',
    abbreviation: 'NYR',
    teamColor: '#0033a0',
    secondaryTeamColor: '#CE1126',
    teamId: 3,
  },
  {
    name: 'Ottawa Senators',
    hashtag: 'GoSensGo',
    abbreviation: 'OTT',
    teamColor: '#c8102e',
    secondaryTeamColor: '#000000',
    teamId: 9,
  },
  {
    name: 'Philadelphia Flyers',
    slug: 'flyers',
    hashtag: 'LetsGoFlyers',
    abbreviation: 'PHI',
    teamColor: '#d24303',
    secondaryTeamColor: '#000000',
    teamId: 4,
  },
  {
    name: 'Pittsburgh Penguins',
    slug: 'penguins',
    hashtag: 'LetsGoPens',
    abbreviation: 'PIT',
    teamColor: '#000000',
    secondaryTeamColor: '#CFC493',
    teamId: 5,
  },
  {
    name: 'St. Louis Blues',
    slug: 'blues',
    hashtag: 'STLBlues',
    abbreviation: 'STL',
    teamColor: '#004986',
    secondaryTeamColor: '#FCB514',
    teamId: 19,
  },
  {
    name: 'San Jose Sharks',
    slug: 'sharks',
    hashtag: 'TheFutureIsTeal',
    abbreviation: 'SJS',
    teamColor: '#00778b',
    secondaryTeamColor: '#e57200',
    teamId: 28,
  },
  {
    name: 'Seattle Kraken',
    slug: 'kraken',
    hashtag: 'SeaKraken',
    abbreviation: 'SEA',
    teamColor: '#001425',
    secondaryTeamColor: '#99d9d9',
    teamId: 55,
  },
  {
    name: 'Tampa Bay Lightning',
    slug: 'lightning',
    hashtag: 'GoBolts',
    abbreviation: 'TBL',
    teamColor: '#00205b',
    secondaryTeamColor: '#000',
    teamId: 14,
  },
  {
    name: 'Toronto Maple Leafs',
    slug: 'mapleleafs',
    hashtag: 'LeafsForever',
    abbreviation: 'TOR',
    teamColor: '#00205b',
    secondaryTeamColor: '#FFFFFF',
    teamId: 10,
  },
  {
    name: 'Utah Hockey Club',
    slug: 'utah',
    hashtag: 'UtahHC',
    abbreviation: 'UTA',
    teamColor: '#6cace4',
    secondaryTeamColor: '#010101',
    teamId: 59,
  },
  {
    name: 'Vancouver Canucks',
    slug: 'canucks',
    hashtag: 'Canucks',
    abbreviation: 'VAN',
    teamColor: '#00205b',
    secondaryTeamColor: '#00843d',
    teamId: 23,
  },
  {
    name: 'Vegas Golden Knights',
    slug: 'goldenknights',
    hashtag: 'VegasBorn',
    abbreviation: 'VGK',
    teamColor: '#b9975b',
    secondaryTeamColor: '#333f48',
    teamId: 54,
  },
  {
    name: 'Washington Capitals',
    slug: 'capitals',
    hashtag: 'ALLCAPS',
    abbreviation: 'WSH',
    teamColor: '#041E42',
    secondaryTeamColor: '#C8102E',
    teamId: 15,
  },
  {
    name: 'Winnipeg Jets',
    slug: 'jets',
    hashtag: 'GoJetsGo',
    abbreviation: 'WPG',
    teamColor: '#041e42',
    secondaryTeamColor: '#296ec8',
    teamId: 52,
  },
  // International
  {
    name: 'Canada',
    abbreviation: 'CAN',
    teamColor: '#c8102e',
    secondaryTeamColor: '#ddcba4',
  },
  {
    name: 'Finland',
    abbreviation: 'FIN',
    teamColor: '#041e42',
    secondaryTeamColor: '#ffb81c',
  },
  {
    name: 'Sweden',
    abbreviation: 'SWE',
    teamColor: '#006EB3',
    secondaryTeamColor: '#041e42',
  },
  {
    name: 'USA',
    abbreviation: 'USA',
    teamColor: '#003087',
    secondaryTeamColor: '#c8102e',
  },

];

const defaultTeam = (isHome) => {
  let teamColor = '#3A5DAE';
  let secondaryTeamColor = '#FFB81C';
  if (!isHome) {
    teamColor = '#FFB81C';
    secondaryTeamColor = '#3A5DAE';
  }

  return {
    name: 'NHL',
    hashtag: 'NHL',
    abbreviation: 'NHL',
    teamColor,
    secondaryTeamColor,
    teamId: 0,
  };
};

export const getTeamSlugs = () => {
  return teamData.map((team) => team.slug);
};

export const getTeamDataByAbbreviation = (abbreviation, isHome) => {
  const team = teamData.find((t) => t.abbreviation === abbreviation);

  return team ? team : defaultTeam(isHome);
};

export const getTeamDataByCommonName = (name, isHome) => {
  const team = teamData.find((t) => t.name === name);

  return team ? team : defaultTeam(isHome);
};

export const getTeamDataBySlug = (slug, isHome) => {
  const team = teamData.find((t) => t.name.toLowerCase().replace(' ', '-') === slug);

  return team ? team : defaultTeam(isHome);
};
