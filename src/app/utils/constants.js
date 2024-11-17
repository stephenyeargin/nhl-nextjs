export const GAME_STATES = {
  FINAL: 'Final',
  OFF: 'Final',
  LIVE: 'Live',
  OT: 'Overtime',
  PRE: 'Pregame',
  FUT: 'Future',
  CRIT: 'Critical',
}

export const PERIOD_DESCRIPTORS = {
  1: '1st',
  2: '2nd',
  3: '3rd',
  4: 'Overtime',
  5: 'Shootout',
}

export const PENALTY_TYPES = {
  "BEN": "Bench Minor",
  "GAM": "Game Misconduct",
  "GRO": "Gross Misconduct",
  "MAJ": "Major",
  "MAT": "Match",
  "MIN": "Minor",
  "MIS": "Misconduct",
  "PS": "Penalty Shot",
  "SO": "Shootout"
}

export const PENALTY_DESCRIPTIONS = {
  "20-minute-match": "20 Minute Match",
  "3-minute-minor": "3 Minute Minor",
  "abuse-of-officials": "Abuse of officials",
  "abusive-language": "Abusive language",
  "aggressor": "Aggressor",
  "attempt-to-injure": "Attempt to injure",
  "bench": "Bench",
  "boarding": "Boarding",
  "broken-stick": "Broken stick",
  "butt-ending": "Butt-ending",
  "butt-ending-double-minor": "Butt-ending - double minor",
  "charging": "Charging",
  "checking-from-behind": "Checking from behind",
  "clipping": "Clipping",
  "closing-hand-on-puck": "Closing hand on puck",
  "coach-or-manager-on-the-ice": "Coach or Manager on the ice",
  "concealing-puck": "Concealing puck",
  "cross-checking": "Cross-checking",
  "cross-checking-double-minor": "Cross-checking - double minor",
  "delaying-game": "Delaying Game",
  "delaying-game-bench": "Delaying Game - Bench",
  "delaying-game-bench-face-off-violation": "Delaying Game - Bench - Face-off violation",
  "delaying-game-equipment": "Delaying Game - Equipment",
  "delaying-game-face-off-violation": "Delaying Game - Face-off violation",
  "delaying-game-illegal-play-by-goalie": "Delaying Game - Illegal play by goalie",
  "delaying-game-puck-over-glass": "Delaying Game - Puck over glass",
  "delaying-game-smothering-puck": "Delaying Game - Smothering puck",
  "delaying-game-unsuccessful-challenge": "Delaying Game - Unsuccessful challenge",
  "delaying-game-unsuccessful-challenge-double-minor": "Delaying Game - Unsuccessful challenge, double minor",
  "deliberate-injury": "Deliberate injury",
  "diving": "Diving",
  "elbowing": "Elbowing",
  "embellishment": "Embellishment",
  "fighting": "Fighting",
  "game-misconduct": "Game Misconduct",
  "game-misconduct-head-coach": "Game Misconduct - Head coach",
  "game-misconduct-team-staff": "Game Misconduct - Team staff",
  "goalie-leave-crease": "Goalie leave crease",
  "goalie-participation-beyond-center": "Goalie participation beyond Center",
  "goalie-removed-own-mask": "Goalie removed own mask",
  "gross-misconduct": "Gross Misconduct",
  "head-butting": "Head butting",
  "head-butting-double-minor": "Head butting - double minor",
  "high-sticking": "High-sticking",
  "high-sticking-double-minor": "High-sticking - double minor",
  "holding": "Holding",
  "holding-obstruction": "Holding - Obstruction",
  "holding-stick-obstruction": "Holding stick - Obstruction",
  "holding-the-stick": "Holding the stick",
  "hooking": "Hooking",
  "hooking-obstruction": "Hooking - Obstruction",
  "illegal-check-to-head": "Illegal check to head",
  "illegal-equipment": "Illegal equipment",
  "illegal-stick": "Illegal stick",
  "illegal-stick-bench": "Illegal stick - bench",
  "illegal-substitution": "Illegal substitution",
  "ineligible-player": "Ineligible Player",
  "instigator": "Instigator",
  "instigator-face-shield": "Instigator - face shield",
  "instigator-misconduct": "Instigator - Misconduct",
  "interference": "Interference",
  "interference-bench": "Interference - Bench",
  "interference-goalkeeper": "Interference - Goalkeeper",
  "interference-obstruction": "Interference - Obstruction",
  "interference-with-official": "Interference with official",
  "kicking": "Kicking",
  "kneeing": "Kneeing",
  "late-on-ice": "Late on ice",
  "leaving-penalty-box": "Leaving penalty box",
  "leaving-players-penalty-bench": "Leaving player's penalty bench",
  "major": "Major",
  "match-penalty": "Match Penalty",
  "match-penalty-10-minutes": "Match Penalty - 10 minutes",
  "minor": "Minor",
  "misconduct": "Misconduct",
  "not-proceding-to-dressing-room": "Not proceeding to dressing room",
  "not-proceeding-directly-to-penalty-box": "Not proceeding directly to penalty box",
  "objects-on-ice": "Objects on ice",
  "penalty-shot": "Penalty shot",
  "penalty-shot-bench-minor": "Penalty Shot - Bench Minor",
  "penalty-shot-major": "Penalty Shot - Major",
  "penalty-shot-minor": "Penalty Shot - Minor",
  "player-leaves-bench": "Player leaves bench",
  "playing-without-a-helmet": "Playing without a helmet",
  "protective-equipment": "Protective equipment",
  "ps-covering-puck-in-crease": "Penalty Shot - Covering puck in crease",
  "ps-goalkeeper-displaced-net": "Penalty Shot - Goalkeeper displaced net",
  "ps-holding-on-breakaway": "Penalty Shot - Holding on breakaway",
  "ps-holding-stick-on-breakaway": "Penalty Shot - Holding stick on breakaway",
  "ps-hooking-on-breakaway": "Penalty Shot - Hooking on breakaway",
  "ps-illegal-substitution": "Penalty Shot - Illegal substitution",
  "ps-interference-from-bench": "Penalty Shot - Interference from bench",
  "ps-net-displaced": "Penalty Shot - Net displaced",
  "ps-picking-up-puck-in-crease": "Penalty Shot - Picking up puck in crease",
  "ps-players-leaving-bench": "Penalty Shot - Players leaving bench",
  "ps-slash-on-breakaway": "Penalty Shot - Slash on breakaway",
  "ps-throwing-object-at-puck": "Penalty Shot - Throwing object at puck",
  "ps-throwing-object-on-ice": "Penalty Shot - Throwing object on ice",
  "ps-tripping-on-breakaway": "Penalty Shot - Tripping on breakaway",
  "puck-thrown-forward-goalkeeper": "Puck thrown forward - Goalkeeper",
  "refusal-to-play": "Refusal to play",
  "removing-sweater": "Removing sweater",
  "roughing": "Roughing",
  "roughing-double-minor": "Roughing - double minor",
  "roughing-removing-opponents-helmet": "Roughing - Removing opponent's helmet",
  "shootout-illegal-stick": "Shootout - Illegal stick",
  "shootout-unsuccessful-challenge": "Shootout - Unsuccessful challenge",
  "slashing": "Slashing",
  "spearing": "Spearing",
  "spearing-double-minor": "Spearing - double minor",
  "throwing-equipment": "Throwing equipment",
  "throwing-stick": "Throwing stick",
  "too-many-men-on-the-ice": "Too many men on the ice",
  "tripping": "Tripping",
  "tripping-obstruction": "Tripping - Obstruction",
  "unnecessary-roughness": "Unnecessary roughness",
  "unsportsmanlike-conduct": "Unsportsmanlike conduct",
  "unsportsmanlike-conduct-coach": "Unsportsmanlike conduct - Coach",
  "unsportsmanlike-conduct-bench": "Unsportsmanlike conduct-bench"
}

export const TEAM_STATS = {
  sog: 'Shots on Goal',
  faceoffWinningPctg: 'Faceoff Winning %',
  powerPlay: 'Power Play',
  powerPlayPctg: 'Power Play %',
  pim: 'Penalty Minutes',
  hits: 'Hits',
  blockedShots: 'Blocked Shots',
  giveaways: 'Giveaways',
  takeaways: 'Takeaways',
}

export const PLAYER_STATS = {
  goals: 'Goals',
  assists: 'Assists',
  points: 'Points',
}

export const STAT_CONTEXT = {
  last_5_games: 'Last 5 Games',
  regular_season: 'Regular Season',
}

export const SHOOTOUT_RESULT = {
  save: 'Save',
  goal: 'Goal',
  miss: 'Miss',
}
