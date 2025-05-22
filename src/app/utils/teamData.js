const teamData = [
  {
    name: 'Anaheim Ducks',
    slug: 'ducks',
    hashtag: 'FlyTogether',
    abbreviation: 'ANA',
    teamColor: '#cf4520',
    secondaryTeamColor: '#89734c',
    teamId: 24,
    division: 'Pacific',
  },
  {
    name: 'Boston Bruins',
    slug: 'bruins',
    hashtag: 'NHLBruins',
    abbreviation: 'BOS',
    teamColor: '#FFB81C',
    secondaryTeamColor: '#000000',
    teamId: 6,
    division: 'Atlantic',
  },
  {
    name: 'Buffalo Sabres',
    slug: 'sabres',
    hashtag: 'SabreHood',
    abbreviation: 'BUF',
    teamColor: '#003087',
    secondaryTeamColor: '#FFB81C',
    teamId: 7,
    division: 'Atlantic'
  },
  {
    name: 'Calgary Flames',
    slug: 'flames',
    hashtag: 'Flames',
    abbreviation: 'CGY',
    teamColor: '#c8102e',
    secondaryTeamColor: '#FAAF19',
    teamId: 20,
    division: 'Pacific',
  },
  {
    name: 'Carolina Hurricanes',
    slug: 'hurricanes',
    hashtag: 'RaiseUp',
    abbreviation: 'CAR',
    teamColor: '#c8102e',
    secondaryTeamColor: '#FFFFFF',
    teamId: 12,
    division: 'Metropolitan',
  },
  {
    name: 'Chicago Blackhawks',
    slug: 'blackhawks',
    hashtag: 'Blackhawks',
    abbreviation: 'CHI',
    teamColor: '#ce1126',
    secondaryTeamColor: '#FF671B',
    teamId: 16,
    division: 'Central',
  },
  {
    name: 'Colorado Avalanche',
    slug: 'avalanche',
    hashtag: 'GoAvsGo',
    abbreviation: 'COL',
    teamColor: '#8a2432',
    secondaryTeamColor: '#236192',
    teamId: 21,
    division: 'Central',
  },
  {
    name: 'Columbus Blue Jackets',
    slug: 'bluejackets',
    hashtag: 'CBJ',
    abbreviation: 'CBJ',
    teamColor: '#041e42',
    secondaryTeamColor: '#ce1126',
    teamId: 29,
    division: 'Metropolitan',
  },
  {
    name: 'Dallas Stars',
    slug: 'stars',
    hashtag: 'TexasHockey',
    abbreviation: 'DAL',
    teamColor: '#00823e',
    secondaryTeamColor: '#8F8F8C',
    teamId: 25,
    division: 'Central',
  },
  {
    name: 'Detroit Red Wings',
    slug: 'redwings',
    hashtag: 'LGRW',
    abbreviation: 'DET',
    teamColor: '#c8102e',
    secondaryTeamColor: '#FFFFFF',
    teamId: 17,
    division: 'Atlantic',
  },
  {
    name: 'Edmonton Oilers',
    slug: 'oilers',
    hashtag: 'LetsGoOilers',
    abbreviation: 'EDM',
    teamColor: '#00205b',
    secondaryTeamColor: '#FF4C00',
    teamId: 22,
    division: 'Pacific',
  },
  {
    name: 'Florida Panthers',
    slug: 'panthers',
    hashtag: 'TimeToHunt',
    abbreviation: 'FLA',
    teamColor: '#041E42',
    secondaryTeamColor: '#c8102E',
    teamId: 13,
    division: 'Atlantic',
  },
  {
    name: 'Los Angeles Kings',
    slug: 'kings',
    hashtag: 'GoKingsGo',
    abbreviation: 'LAK',
    teamColor: '#8a9599',
    secondaryTeamColor: '#111111',
    teamId: 26,
    division: 'Pacific',
  },
  {
    name: 'Minnesota Wild',
    slug: 'wild',
    hashtag: 'MNWild',
    abbreviation: 'MIN',
    teamColor: '#0e4431',
    secondaryTeamColor: '#ddc9a3',
    teamId: 30,
    division: 'Central',
  },
  {
    name: 'Montréal Canadiens',
    slug: 'canadiens',
    hashtag: 'GoHabsGo',
    abbreviation: 'MTL',
    teamColor: '#a6192e',
    secondaryTeamColor: '#192168',
    teamId: 8,
    division: 'Atlantic',
  },
  {
    name: 'Nashville Predators',
    slug: 'predators',
    hashtag: 'Smashville',
    abbreviation: 'NSH',
    teamColor: '#ffb81c',
    secondaryTeamColor: '#041E42',
    teamId: 18,
    division: 'Central',
  },
  {
    name: 'New Jersey Devils',
    slug: 'devils',
    hashtag: 'NJDevils',
    abbreviation: 'NJD',
    teamColor: '#cc0000',
    secondaryTeamColor: '#000000',
    teamId: 1,
    division: 'Metropolitan',
  },
  {
    name: 'New York Islanders',
    slug: 'islanders',
    hashtag: 'Isles',
    abbreviation: 'NYI',
    teamColor: '#00468b',
    secondaryTeamColor: '#f47d30',
    teamId: 2,
    division: 'Metropolitan',
  },
  {
    name: 'New York Rangers',
    slug: 'rangers',
    hashtag: 'NYR',
    abbreviation: 'NYR',
    teamColor: '#0033a0',
    secondaryTeamColor: '#CE1126',
    teamId: 3,
    division: 'Metropolitan',
  },
  {
    name: 'Ottawa Senators',
    hashtag: 'GoSensGo',
    abbreviation: 'OTT',
    teamColor: '#c8102e',
    secondaryTeamColor: '#000000',
    teamId: 9,
    division: 'Atlantic',
  },
  {
    name: 'Philadelphia Flyers',
    slug: 'flyers',
    hashtag: 'LetsGoFlyers',
    abbreviation: 'PHI',
    teamColor: '#d24303',
    secondaryTeamColor: '#000000',
    teamId: 4,
    division: 'Metropolitan',
  },
  {
    name: 'Pittsburgh Penguins',
    slug: 'penguins',
    hashtag: 'LetsGoPens',
    abbreviation: 'PIT',
    teamColor: '#000000',
    secondaryTeamColor: '#CFC493',
    teamId: 5,
    division: 'Metropolitan',
  },
  {
    name: 'St. Louis Blues',
    slug: 'blues',
    hashtag: 'STLBlues',
    abbreviation: 'STL',
    teamColor: '#004986',
    secondaryTeamColor: '#FCB514',
    teamId: 19,
    division: 'Central',
  },
  {
    name: 'San Jose Sharks',
    slug: 'sharks',
    hashtag: 'TheFutureIsTeal',
    abbreviation: 'SJS',
    teamColor: '#00778b',
    secondaryTeamColor: '#e57200',
    teamId: 28,
    division: 'Pacific',
  },
  {
    name: 'Seattle Kraken',
    slug: 'kraken',
    hashtag: 'SeaKraken',
    abbreviation: 'SEA',
    teamColor: '#001425',
    secondaryTeamColor: '#99d9d9',
    teamId: 55,
    division: 'Pacific',
  },
  {
    name: 'Tampa Bay Lightning',
    slug: 'lightning',
    hashtag: 'GoBolts',
    abbreviation: 'TBL',
    teamColor: '#00205b',
    secondaryTeamColor: '#000',
    teamId: 14,
    division: 'Atlantic',
  },
  {
    name: 'Toronto Maple Leafs',
    slug: 'mapleleafs',
    hashtag: 'LeafsForever',
    abbreviation: 'TOR',
    teamColor: '#00205b',
    secondaryTeamColor: '#FFFFFF',
    teamId: 10,
    division: 'Atlantic',
  },
  {
    name: 'Utah Mammoth',
    slug: 'utah',
    hashtag: 'TusksUp',
    abbreviation: 'UTA',
    teamColor: '#6cace4',
    secondaryTeamColor: '#010101',
    teamId: 59,
    division: 'Central',
  },
  {
    name: 'Vancouver Canucks',
    slug: 'canucks',
    hashtag: 'Canucks',
    abbreviation: 'VAN',
    teamColor: '#00205b',
    secondaryTeamColor: '#00843d',
    teamId: 23,
    division: 'Pacific',
  },
  {
    name: 'Vegas Golden Knights',
    slug: 'goldenknights',
    hashtag: 'VegasBorn',
    abbreviation: 'VGK',
    teamColor: '#b9975b',
    secondaryTeamColor: '#333f48',
    teamId: 54,
    division: 'Pacific',
  },
  {
    name: 'Washington Capitals',
    slug: 'capitals',
    hashtag: 'ALLCAPS',
    abbreviation: 'WSH',
    teamColor: '#041E42',
    secondaryTeamColor: '#C8102E',
    teamId: 15,
    division: 'Metropolitan',
  },
  {
    name: 'Winnipeg Jets',
    slug: 'jets',
    hashtag: 'GoJetsGo',
    abbreviation: 'WPG',
    teamColor: '#041e42',
    secondaryTeamColor: '#296ec8',
    teamId: 52,
    division: 'Central',
  },
  // International
  {
    name: 'Canada',
    abbreviation: 'CAN',
    teamColor: '#c8102e',
    secondaryTeamColor: '#ddcba4',
    teamId: 0,
    division: 'International',
  },
  {
    name: 'Finland',
    abbreviation: 'FIN',
    teamColor: '#041e42',
    secondaryTeamColor: '#ffb81c',
    teamId: 0,
    division: 'International',
  },
  {
    name: 'Sweden',
    abbreviation: 'SWE',
    teamColor: '#006EB3',
    secondaryTeamColor: '#041e42',
    teamId: 0,
    division: 'International',
  },
  {
    name: 'USA',
    abbreviation: 'USA',
    teamColor: '#003087',
    secondaryTeamColor: '#c8102e',
    teamId: 0,
    division: 'International',
  },

];

// Sort teamData by .name
teamData.sort((a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }

  return 0;
});

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

export const getAllTeamsByDivision = () => {
  const teams = {
    Atlantic: [],
    Central: [],
    Metropolitan: [],
    Pacific: [],
  };

  teamData.forEach((team) => {
    if (!team.division || team.division === 'International') {
      return;
    }
    teams[team.division].push(team);
  });

  return teams;
};
