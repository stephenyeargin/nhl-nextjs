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

  it('returns draft when no games are scheduled in the next three weeks', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        gamesByDate: [
          {
            date: '2026-07-01',
            games: [{ id: 7 }],
          },
        ],
      }),
    } as Response);

    await expect(getTopBarMode(new Date('2026-06-02T12:00:00Z'))).resolves.toBe('draft');
  });
});
