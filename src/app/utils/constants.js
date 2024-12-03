export const GAME_STATES = {
  FINAL: 'Final',
  OFF: 'Final',
  LIVE: 'Live',
  OT: 'Overtime',
  PRE: 'Pregame',
  FUT: 'Future',
  CRIT: 'Critical'
};

export const PENALTY_TYPES = {
  'BEN': 'Bench Minor',
  'GAM': 'Game Misconduct',
  'GRO': 'Gross Misconduct',
  'MAJ': 'Major',
  'MAT': 'Match',
  'MIN': 'Minor',
  'MIS': 'Misconduct',
  'PS': 'Penalty Shot',
  'SO': 'Shootout'
};

export const PENALTY_DESCRIPTIONS = {
  '20-minute-match': '20 Minute Match',
  '3-minute-minor': '3 Minute Minor',
  'abuse-of-officials': 'Abuse of officials',
  'abusive-language': 'Abusive language',
  'aggressor': 'Aggressor',
  'attempt-to-injure': 'Attempt to injure',
  'bench': 'Bench',
  'boarding': 'Boarding',
  'broken-stick': 'Broken stick',
  'butt-ending': 'Butt-ending',
  'butt-ending-double-minor': 'Butt-ending - double minor',
  'charging': 'Charging',
  'checking-from-behind': 'Checking from behind',
  'clipping': 'Clipping',
  'closing-hand-on-puck': 'Closing hand on puck',
  'coach-or-manager-on-the-ice': 'Coach or Manager on the ice',
  'concealing-puck': 'Concealing puck',
  'cross-checking': 'Cross-checking',
  'cross-checking-double-minor': 'Cross-checking - double minor',
  'delaying-game': 'Delaying Game',
  'delaying-game-bench': 'Delaying Game - Bench',
  'delaying-game-bench-face-off-violation': 'Delaying Game - Bench - Face-off violation',
  'delaying-game-equipment': 'Delaying Game - Equipment',
  'delaying-game-face-off-violation': 'Delaying Game - Face-off violation',
  'delaying-game-illegal-play-by-goalie': 'Delaying Game - Illegal play by goalie',
  'delaying-game-puck-over-glass': 'Delaying Game - Puck over glass',
  'delaying-game-smothering-puck': 'Delaying Game - Smothering puck',
  'delaying-game-unsuccessful-challenge': 'Delaying Game - Unsuccessful challenge',
  'delaying-game-unsuccessful-challenge-double-minor': 'Delaying Game - Unsuccessful challenge, double minor',
  'deliberate-injury': 'Deliberate injury',
  'diving': 'Diving',
  'elbowing': 'Elbowing',
  'embellishment': 'Embellishment',
  'fighting': 'Fighting',
  'game-misconduct': 'Game Misconduct',
  'game-misconduct-head-coach': 'Game Misconduct - Head coach',
  'game-misconduct-team-staff': 'Game Misconduct - Team staff',
  'goalie-leave-crease': 'Goalie leave crease',
  'goalie-participation-beyond-center': 'Goalie participation beyond Center',
  'goalie-removed-own-mask': 'Goalie removed own mask',
  'gross-misconduct': 'Gross Misconduct',
  'head-butting': 'Head butting',
  'head-butting-double-minor': 'Head butting - double minor',
  'high-sticking': 'High-sticking',
  'high-sticking-double-minor': 'High-sticking - double minor',
  'holding': 'Holding',
  'holding-obstruction': 'Holding - Obstruction',
  'holding-stick-obstruction': 'Holding stick - Obstruction',
  'holding-the-stick': 'Holding the stick',
  'hooking': 'Hooking',
  'hooking-obstruction': 'Hooking - Obstruction',
  'illegal-check-to-head': 'Illegal check to head',
  'illegal-equipment': 'Illegal equipment',
  'illegal-stick': 'Illegal stick',
  'illegal-stick-bench': 'Illegal stick - bench',
  'illegal-substitution': 'Illegal substitution',
  'ineligible-player': 'Ineligible Player',
  'instigator': 'Instigator',
  'instigator-face-shield': 'Instigator - face shield',
  'instigator-misconduct': 'Instigator - Misconduct',
  'interference': 'Interference',
  'interference-bench': 'Interference - Bench',
  'interference-goalkeeper': 'Interference - Goalkeeper',
  'interference-obstruction': 'Interference - Obstruction',
  'interference-with-official': 'Interference with official',
  'kicking': 'Kicking',
  'kneeing': 'Kneeing',
  'late-on-ice': 'Late on ice',
  'leaving-penalty-box': 'Leaving penalty box',
  'leaving-players-penalty-bench': 'Leaving player\'s penalty bench',
  'major': 'Major',
  'match-penalty': 'Match Penalty',
  'match-penalty-10-minutes': 'Match Penalty - 10 minutes',
  'minor': 'Minor',
  'misconduct': 'Misconduct',
  'not-proceding-to-dressing-room': 'Not proceeding to dressing room',
  'not-proceeding-directly-to-penalty-box': 'Not proceeding directly to penalty box',
  'objects-on-ice': 'Objects on ice',
  'penalty-shot': 'Penalty shot',
  'penalty-shot-bench-minor': 'Penalty Shot - Bench Minor',
  'penalty-shot-major': 'Penalty Shot - Major',
  'penalty-shot-minor': 'Penalty Shot - Minor',
  'player-leaves-bench': 'Player leaves bench',
  'playing-without-a-helmet': 'Playing without a helmet',
  'protective-equipment': 'Protective equipment',
  'ps-covering-puck-in-crease': 'Penalty Shot - Covering puck in crease',
  'ps-goalkeeper-displaced-net': 'Penalty Shot - Goalkeeper displaced net',
  'ps-holding-on-breakaway': 'Penalty Shot - Holding on breakaway',
  'ps-holding-stick-on-breakaway': 'Penalty Shot - Holding stick on breakaway',
  'ps-hooking-on-breakaway': 'Penalty Shot - Hooking on breakaway',
  'ps-illegal-substitution': 'Penalty Shot - Illegal substitution',
  'ps-interference-from-bench': 'Penalty Shot - Interference from bench',
  'ps-net-displaced': 'Penalty Shot - Net displaced',
  'ps-picking-up-puck-in-crease': 'Penalty Shot - Picking up puck in crease',
  'ps-players-leaving-bench': 'Penalty Shot - Players leaving bench',
  'ps-slash-on-breakaway': 'Penalty Shot - Slash on breakaway',
  'ps-throwing-object-at-puck': 'Penalty Shot - Throwing object at puck',
  'ps-throwing-object-on-ice': 'Penalty Shot - Throwing object on ice',
  'ps-tripping-on-breakaway': 'Penalty Shot - Tripping on breakaway',
  'puck-thrown-forward-goalkeeper': 'Puck thrown forward - Goalkeeper',
  'refusal-to-play': 'Refusal to play',
  'removing-sweater': 'Removing sweater',
  'roughing': 'Roughing',
  'roughing-double-minor': 'Roughing - double minor',
  'roughing-removing-opponents-helmet': 'Roughing - Removing opponent\'s helmet',
  'shootout-illegal-stick': 'Shootout - Illegal stick',
  'shootout-unsuccessful-challenge': 'Shootout - Unsuccessful challenge',
  'slashing': 'Slashing',
  'spearing': 'Spearing',
  'spearing-double-minor': 'Spearing - double minor',
  'throwing-equipment': 'Throwing equipment',
  'throwing-stick': 'Throwing stick',
  'too-many-men-on-the-ice': 'Too many men on the ice',
  'tripping': 'Tripping',
  'tripping-obstruction': 'Tripping - Obstruction',
  'unnecessary-roughness': 'Unnecessary roughness',
  'unsportsmanlike-conduct': 'Unsportsmanlike conduct',
  'unsportsmanlike-conduct-coach': 'Unsportsmanlike conduct - Coach',
  'unsportsmanlike-conduct-bench': 'Unsportsmanlike conduct-bench'
};

export const TEAM_STATS = {
  goalsForPerGamePlayed: 'Goals For / Game Played',
  goalsAgainstPerGamePlayed: 'Goals Against / Game Played',
  powerPlayPctg: 'Power Play %',
  ppPctg: 'Power Play %',
  pkPctg: 'Penalty Kill %',
  faceoffWinningPctg: 'Face Off Win %',
  ppPctgRank: 'Power Play % Rank',
  pkPctgRank: 'Penalty Kill % Rank',
  goalsForPerGamePlayedRank: 'Goals For / Game Played Rank',
  goalsAgainstPerGamePlayedRank: 'Goals Against / Game Played Rank',
  faceOffPctgRank: 'Face Off Win % Rank',
  sog: 'Shots on Goal',
  hits: 'Hits',
  blockedShots: 'Blocked Shots',
  takeaways: 'Takeaways',
  giveaways: 'Giveaways',
  pim: 'Penalty Minutes',
  powerPlay: 'Power Plays',
};

export const PLAYER_STATS = {
  goals: 'Goals',
  assists: 'Assists',
  points: 'Points'
};

export const STAT_CONTEXT = {
  last_5_games: 'Last 5 Games',
  regular_season: 'Regular Season'
};

export const SHOOTOUT_RESULT = {
  save: 'Save',
  goal: 'Goal',
  miss: 'Miss'
};

export const GAME_EVENTS = {
  'advantage-time': 'Advantage Time',
  'all-star': 'All-Star',
  'anthem-start': 'Anthem start',
  'assistant-coach': 'Assistant coach',
  'associate-head-coach': 'Associate head coach',
  'awarded-empty-net': 'Awarded Empty-Net',
  'between-legs': 'Between Legs',
  'blocked-shot': 'Blocked Shot',
  'bottom-left': 'Bottom Left',
  'bottom-middle': 'Bottom Middle',
  'bottom-right': 'Bottom Right',
  'chlg-hm-goal-interference': 'Challenge (Home) - Goal Interference',
  'chlg-hm-missed-stoppage': 'Challenge (Home) - Missed Stoppage',
  'chlg-hm-off-side': 'Challenge (Home) - Off-side',
  'chlg-league-goal-interference': 'Challenge (League) - Goal Interference',
  'chlg-league-missed-stoppage': 'Challenge (League) - Missed Stoppage',
  'chlg-league-off-side': 'Challenge (League) - off-side',
  'chlg-vis-goal-interference': 'Challenge (Visitor) - Goal Interference',
  'chlg-vis-missed-stoppage': 'Challenge (Visitor) - Missed Stoppage',
  'chlg-vis-off-side': 'Challenge (Visitor) - Off-side',
  'clock-problem': 'Clock Problem',
  'defensive-zone': 'Defensive Zone',
  'delayed-penalty': 'Delayed Penalty',
  'disallowed-goal-overturned': 'Disallowed goal overturned',
  'disallowed-goal-upheld': 'Disallowed goal upheld',
  'early-intermission-end': 'Early Intermission End',
  'early-intermission-start': 'Early Intermission Start',
  'emergency-goaltender-player-id-change': 'Emergency Goaltender Player ID Change',
  'emergency-goaltender': 'Emergency Goaltender',
  'empty-net': 'Empty-Net',
  'expired-penalty': 'Expired Penalty',
  'face-off': 'Face-off',
  'failed-shot-attempt': 'Failed Shot Attempt',
  'game-end': 'Game End',
  'game-official': 'Game Official',
  'game-scheduled': 'Game Scheduled',
  'game-winning-goal': 'Game Winning Goal',
  'goal-overturned': 'Goal overturned',
  'goal-time': 'Goal Time',
  'goal-upheld': 'Goal upheld',
  'goalie-puck-frozen-played-from-beyond-center': 'Goalie Puck Frozen - played from beyond center',
  'goalie-stopped-after-sog': 'Goalie Stopped Shot',
  'hand-pass': 'Hand Pass',
  'head-coach': 'Head coach',
  'high-stick': 'High Stick',
  'home-timeout': 'Home Timeout',
  'ice-problem': 'Ice problem',
  'ice-time': 'Ice Time',
  'interference-on-goalie': 'Interference on goalie',
  'left-wing': 'Left Wing',
  'missed-shot': 'Missed Shot',
  'missed-stoppage': 'Missed stoppage',
  'net-dislodged-by-goaltender': 'Net Dislodged by Goaltender',
  'net-dislodged-defensive-skater': 'Net Dislodged Defensive Skater',
  'net-dislodged-offensive-skater': 'Net Dislodged Offensive Skater',
  'net-off': 'Net Off',
  'neutral-zone': 'Neutral Zone',
  'objects-on-ice': 'Objects on Ice',
  'offensive-zone': 'Offensive Zone',
  'official-challenge': 'Official Challenge',
  'offsetting-penalty': 'Offsetting Penalty',
  'offsides-pass': 'Offsides Pass',
  'own-goal-empty-net': 'Own Goal Empty-Net',
  'own-goal': 'Own Goal',
  'penalty-shot': 'Penalty Shot',
  'penalty-time': 'Penalty Time',
  'period-end': 'Period End',
  'period-official': 'Period Official',
  'period-ready': 'Period Ready',
  'period-start': 'Period Start',
  'player-equipment': 'Player Equipment',
  'player-injury': 'Player Injury',
  'power-play-goal-scored': 'Power Play Goal Scored',
  'pre-game-skate-end': 'Pregame Skate End',
  'pre-game-skate-start': 'Pregame Skate Start',
  'pre-season': 'Pre-Season',
  'premature-substitution': 'Premature Substitution',
  'puck-frozen': 'Puck Frozen',
  'puck-in-benches': 'Puck in Benches',
  'puck-in-crowd': 'Puck in Crowd',
  'puck-in-netting': 'Puck in Netting',
  'referee-or-linesman': 'Referee or Linesperson',
  'regular-season': 'Regular Season',
  'right-wing': 'Right Wing',
  'rink-repair': 'Rink Repair',
  'shootout-complete': 'Shootout Complete',
  'shot-on-goal': 'Shot On Goal',
  'skater-puck-frozen': 'Skater Puck Frozen',
  'switch-sides': 'Switch sides',
  'time-out-home': 'Time Out - Home',
  'time-out-visitor': 'Time Out - Visitor',
  'tip-in': 'Tip-In',
  'top-left': 'Top Left',
  'top-middle': 'Top Middle',
  'top-right': 'Top Right',
  'tv-timeout': 'TV timeout',
  'tv-to': 'TV TO',
  'video-review': 'Video Review',
  'visitor-timeout': 'Visitor Timeout',
  'wrap-around': 'Wrap-around',
  'zone-time': 'Zone Time',
  alternate: 'Alternate',
  awarded: 'Awarded',
  backhand: 'Backhand',
  bat: 'Bat',
  blocked: 'Blocked',
  center: 'Center',
  cradle: 'Cradle',
  defense: 'Defense',
  deflected: 'Deflected',
  ev: 'EV',
  faceoff: 'Face-off',
  forward: 'Forward',
  giveaway: 'Giveaway',
  goal: 'Goal',
  goalie: 'Goalie',
  hit: 'Hit',
  icing: 'Icing',
  injury: 'Injury',
  linesman: 'Linesperson',
  missed: 'Missed',
  none: 'none',
  noPenaltiesTaken: 'No penalties taken',
  offside: 'Offside',
  penalty: 'Penalty',
  playoff: 'Playoff',
  poke: 'Poke',
  pp: 'PP',
  referee: 'Referee',
  series: 'Series',
  sh: 'SH',
  shot: 'Shot',
  slap: 'Slap',
  snap: 'Snap',
  stoppage: 'Stoppage',
  substitution: 'Substitution',
  takeaway: 'Takeaway',
  turnover: 'Turnover',
  unknown: 'Unknown',
  wrist: 'Wrist'
};

export const GOAL_MODIFIERS = {
  'awarded': { label: 'AWD', title: 'Awarded Goal' },
  'awarded-empty-net': { label: 'AWD, EN', title: 'Awarded Goal (Empty Net)' },
  'empty-net': { label: 'EN', title: 'Empty Net' },
  'game-winning-goal': { label: 'GWG', title: 'Game Winning Goal' },
  'none': { label: '', title: 'None' },
  'own-goal': { label: 'OWN', title: 'Own Goal' },
  'own-goal-empty-net': { label: 'OWN, EN', title: 'Own Goal (Empty Net)' },
  'penalty-shot': { label: 'PS', title: 'Penalty Shot' }
};

export const ZONE_DESCRIPTIONS = {
  D: 'defensive zone',
  O: 'offensive zone',
  N: 'neutral zone'
};

export const MISS_TYPES = {
  'short': 'short side',
  'wide-right': 'wide right',
  'wide-left': 'wide left',
  'hit-crossbar': 'hit crossbar',
  'hit-left-post': 'hit left post',
  'hit-right-post': 'hit right post',
  'high-and-wide-left': 'high and wide left',
  'high-and-wide-right': 'high and wide right',
  'above-crossbar': 'above the crossbar',
  'failed-bank-attempt': 'failed bank attempt',
};

export const GAME_REPORT_NAMES = {
  gameSummary: 'Game Summary',
  eventSummary: 'Event Summary',
  playByPlay: 'Full Play-By-Play',
  faceoffSummary: 'Face-off Summary',
  faceoffComparison: 'Face-off Comparison',
  rosters: 'Roster Report',
  shotSummary: 'Shot Report',
  shiftChart: 'Shift Chart',
  toiAway: 'Time on Ice: Away',
  toiHome: 'Time on Ice: Home',
};
