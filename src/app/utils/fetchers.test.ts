import { safeFetchJSON, noStoreInit } from './fetchers';

describe('safeFetchJSON', () => {
  const originalFetch = global.fetch;
  const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockReset();
  });
  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  test('returns parsed json', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ x: 1 }),
    });
    const res = await safeFetchJSON<{ x: number }>('http://example.com');
    expect(res).toEqual({ x: 1 });
  });

  test('returns null on 404 when allow404', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 404 });
    const res = await safeFetchJSON<unknown>('http://x/none', { allow404: true });
    expect(res).toBeNull();
  });

  test('throws on network error', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('net'));
    await expect(safeFetchJSON<unknown>('http://x')).rejects.toMatchObject({
      message: expect.stringContaining('Network error'),
    });
  });

  test('throws on non ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });
    await expect(safeFetchJSON<unknown>('http://x')).rejects.toMatchObject({ status: 500 });
  });

  test('throws on invalid json', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => {
        throw new Error('bad');
      },
    });
    await expect(safeFetchJSON<unknown>('http://x')).rejects.toMatchObject({
      message: expect.stringContaining('Invalid JSON'),
    });
  });
});

describe('noStoreInit', () => {
  test('returns cache no-store', () => {
    expect(noStoreInit()).toEqual({ cache: 'no-store' });
    expect(noStoreInit({ method: 'GET' })).toEqual({ cache: 'no-store', method: 'GET' });
  });
});
