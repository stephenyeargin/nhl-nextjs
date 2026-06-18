import { getTopBarMode } from './season';

describe('getTopBarMode', () => {
  const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockReset();
  });

  afterEach(() => {
    mockFetch.mockReset();
  });

  it('returns schedule when games exist in the next three weeks', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        gamesByDate: [
          {
            date: '2026-06-10',
            games: [{ id: 1 }],
          },
        ],
      }),
    } as Response);

    await expect(getTopBarMode(new Date('2026-06-02T12:00:00Z'))).resolves.toBe('schedule');
  });

  it('returns schedule when games exist in the previous three days', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        gamesByDate: [
          {
            date: '2026-06-17',
            games: [{ id: 99 }],
          },
        ],
      }),
    } as Response);

    await expect(getTopBarMode(new Date('2026-06-18T12:00:00Z'))).resolves.toBe('schedule');
  });

  it('returns draft when no games are scheduled within three days behind or 21 days ahead', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        gamesByDate: [
          {
            date: '2026-06-05',
            games: [{ id: 99 }],
          },
        ],
      }),
    } as Response);

    await expect(getTopBarMode(new Date('2026-06-18T12:00:00Z'))).resolves.toBe('draft');
  });
});
