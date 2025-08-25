import { GAME_STATES, PENALTY_TYPES, PENALTY_DESCRIPTIONS, TEAM_STATS, PLAYER_STATS, STAT_CONTEXT, SHOOTOUT_RESULT, GAME_EVENTS, GOAL_MODIFIERS, ZONE_DESCRIPTIONS, MISS_TYPES, GAME_REPORT_NAMES, NHL_BRIGHTCOVE_ACCOUNT } from './constants';

describe('constants exports', () => {
  test('game states contain FINAL', () => {
    expect(GAME_STATES.FINAL).toBe('Final');
  });
  test('penalty types has MIN', () => {
    expect(PENALTY_TYPES.MIN).toBe('Minor');
  });
  test('penalty descriptions includes high-sticking', () => {
    expect(PENALTY_DESCRIPTIONS['high-sticking']).toBe('High-sticking');
  });
  test('team stats maps goalsForPerGamePlayed', () => {
    expect(TEAM_STATS.goalsForPerGamePlayed).toContain('Goals For');
  });
  test('player stats maps goals', () => {
    expect(PLAYER_STATS.goals).toBe('Goals');
  });
  test('stat context includes regular season', () => {
    expect(STAT_CONTEXT.regular_season).toBe('Regular Season');
  });
  test('shootout result goal', () => {
    expect(SHOOTOUT_RESULT.goal).toBe('Goal');
  });
  test('game events contains goal', () => {
    expect(GAME_EVENTS.goal).toBe('Goal');
  });
  test('goal modifiers own-goal', () => {
    expect(GOAL_MODIFIERS['own-goal'].label).toBe('OWN');
  });
  test('zone descriptions', () => {
    expect(ZONE_DESCRIPTIONS.D).toBe('defensive zone');
  });
  test('miss types', () => {
    expect(MISS_TYPES['wide-right']).toBe('wide right');
  });
  test('report names', () => {
    expect(GAME_REPORT_NAMES.gameSummary).toBe('Game Summary');
  });
  test('brightcove account constant', () => {
    expect(NHL_BRIGHTCOVE_ACCOUNT).toBeDefined();
  });
});
