import * as fetcherMod from './fetcher';
const { nhlFetch, nhlStatic } = fetcherMod;

describe('nhlFetch', () => {
  const originalFetch = global.fetch;
  beforeEach(() => {
    global.fetch = jest.fn();
  });
  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  test('prepends slash if missing and returns JSON', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });
    const result = await nhlFetch('/scoreboard/now');
    expect(result).toEqual({ ok: true });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/scoreboard/now'),
      expect.any(Object)
    );
  });

  test('auto adds leading slash', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ hi: 1 }),
    });
    await nhlFetch('scoreboard/now');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/scoreboard/now'),
      expect.any(Object)
    );
  });

  test('throws detailed error on !ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Server',
      text: () => Promise.resolve('Bad things'),
      json: () => Promise.resolve({}),
    });
    await expect(nhlFetch('/fail')).rejects.toThrow(/nhlFetch failed 500/);
  });

  test('includes headers and next options', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
    await nhlFetch('/x', { revalidate: 120, tags: ['abc'], headers: { 'x-test': '1' } });
    const call = (global.fetch as jest.Mock).mock.calls[0];
    expect(call[1].headers['x-test']).toBe('1');
    expect(call[1].next).toEqual({ revalidate: 120, tags: ['abc'] });
  });
});

describe('nhlStatic', () => {
  test('delegates to nhlFetch with defaults', async () => {
    (global.fetch as any) = jest
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve({ via: 'static' }) });
    const result = await nhlStatic('/abc');
    expect(result).toEqual({ via: 'static' });
    const call = (global.fetch as jest.Mock).mock.calls[0];
    expect(call[0]).toContain('/abc');
    expect(call[1].next).toEqual({ revalidate: 300, tags: [] });
  });
});
