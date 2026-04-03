import { sortPlaysByRecency } from './sortPlays';

describe('sortPlaysByRecency', () => {
  test('uses game clock recency over sortOrder when delayed plays are inserted', () => {
    const sorted = sortPlaysByRecency([
      {
        eventId: 100,
        periodDescriptor: { number: 2 },
        timeRemaining: '10:05',
        sortOrder: 10,
      },
      {
        eventId: 101,
        periodDescriptor: { number: 2 },
        timeRemaining: '11:02',
        sortOrder: 999,
      },
      {
        eventId: 102,
        periodDescriptor: { number: 2 },
        timeRemaining: '10:39',
        sortOrder: 20,
      },
    ]);

    expect(sorted.map((play) => play.eventId)).toEqual([100, 102, 101]);
  });

  test('prefers higher period when viewing all periods', () => {
    const sorted = sortPlaysByRecency([
      {
        eventId: 1,
        periodDescriptor: { number: 2 },
        timeRemaining: '00:01',
      },
      {
        eventId: 2,
        periodDescriptor: { number: 3 },
        timeRemaining: '19:59',
      },
    ]);

    expect(sorted.map((play) => play.eventId)).toEqual([2, 1]);
  });

  test('uses timeInPeriod when available', () => {
    const sorted = sortPlaysByRecency([
      {
        eventId: 1,
        periodDescriptor: { number: 1 },
        timeInPeriod: '07:30',
        timeRemaining: '12:30',
      },
      {
        eventId: 2,
        periodDescriptor: { number: 1 },
        timeInPeriod: '08:00',
        timeRemaining: '12:00',
      },
    ]);

    expect(sorted.map((play) => play.eventId)).toEqual([2, 1]);
  });

  test('falls back to sortOrder when no usable clock data exists', () => {
    const sorted = sortPlaysByRecency([
      {
        eventId: 1,
        periodDescriptor: { number: 1 },
        timeInPeriod: 'SO',
        sortOrder: 4,
      },
      {
        eventId: 2,
        periodDescriptor: { number: 1 },
        sortOrder: 8,
      },
    ]);

    expect(sorted.map((play) => play.eventId)).toEqual([2, 1]);
  });
});
