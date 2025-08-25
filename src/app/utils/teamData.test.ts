import { getTeamSlugs, getTeamDataByAbbreviation, getTeamDataByCommonName, getTeamDataBySlug, getAllTeamsByDivision } from './teamData';

describe('teamData utilities', () => {
  test('getTeamSlugs returns array with expected values', () => {
    const slugs = getTeamSlugs();
    expect(slugs).toContain('ducks');
    expect(slugs).toContain('bruins');
  });

  test('getTeamDataByAbbreviation returns team or default', () => {
    const team = getTeamDataByAbbreviation('BOS', true);
    expect(team.name).toBe('Boston Bruins');
    const fallback = getTeamDataByAbbreviation('XXX', true);
    expect(fallback.abbreviation).toBe('NHL');
  });

  test('getTeamDataByCommonName returns team or default', () => {
    const team = getTeamDataByCommonName('Boston Bruins', true);
    expect(team.abbreviation).toBe('BOS');
    const fallback = getTeamDataByCommonName('No Team', false);
    expect(fallback.abbreviation).toBe('NHL');
  });

  test('getTeamDataBySlug returns team or default', () => {
    const team = getTeamDataBySlug('boston-bruins', true);
    expect(team.abbreviation).toBe('BOS');
    const fallback = getTeamDataBySlug('not-real', false);
    expect(fallback.abbreviation).toBe('NHL');
  });

  test('getAllTeamsByDivision groups correctly', () => {
    const byDiv = getAllTeamsByDivision();
    expect(Object.keys(byDiv)).toEqual(['Atlantic', 'Central', 'Metropolitan', 'Pacific']);
    expect(byDiv.Pacific.find(t => t.abbreviation === 'ANA')).toBeTruthy();
  });
});
