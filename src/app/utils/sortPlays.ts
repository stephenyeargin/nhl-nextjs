type SortablePlay = {
  periodDescriptor?: { number?: number };
  timeInPeriod?: string;
  timeRemaining?: string;
  sortOrder?: number;
  eventId?: number | string;
};

const parseClockToSeconds = (clock: unknown): number | null => {
  if (typeof clock !== 'string') {
    return null;
  }

  const parts = clock.split(':');
  if (parts.length !== 2) {
    return null;
  }

  const [minutesRaw, secondsRaw] = parts;
  const minutes = Number(minutesRaw);
  const seconds = Number(secondsRaw);

  if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) {
    return null;
  }

  return minutes * 60 + seconds;
};

const parseEventId = (eventId: unknown): number | null => {
  if (typeof eventId === 'number' && Number.isFinite(eventId)) {
    return eventId;
  }
  if (typeof eventId === 'string') {
    const parsed = Number(eventId);

    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

export const comparePlaysByRecency = (a: SortablePlay, b: SortablePlay): number => {
  const periodA = a.periodDescriptor?.number ?? 0;
  const periodB = b.periodDescriptor?.number ?? 0;
  if (periodA !== periodB) {
    return periodB - periodA;
  }

  const elapsedA = parseClockToSeconds(a.timeInPeriod);
  const elapsedB = parseClockToSeconds(b.timeInPeriod);
  if (elapsedA !== null && elapsedB !== null && elapsedA !== elapsedB) {
    return elapsedB - elapsedA;
  }
  if (elapsedA !== null && elapsedB === null) {
    return -1;
  }
  if (elapsedA === null && elapsedB !== null) {
    return 1;
  }

  const remainingA = parseClockToSeconds(a.timeRemaining);
  const remainingB = parseClockToSeconds(b.timeRemaining);
  if (remainingA !== null && remainingB !== null && remainingA !== remainingB) {
    return remainingA - remainingB;
  }
  if (remainingA !== null && remainingB === null) {
    return -1;
  }
  if (remainingA === null && remainingB !== null) {
    return 1;
  }

  const sortOrderA = a.sortOrder ?? Number.NEGATIVE_INFINITY;
  const sortOrderB = b.sortOrder ?? Number.NEGATIVE_INFINITY;
  if (sortOrderA !== sortOrderB) {
    return sortOrderB - sortOrderA;
  }

  const eventIdA = parseEventId(a.eventId) ?? Number.NEGATIVE_INFINITY;
  const eventIdB = parseEventId(b.eventId) ?? Number.NEGATIVE_INFINITY;

  return eventIdB - eventIdA;
};

export const sortPlaysByRecency = <T extends SortablePlay>(plays: T[]): T[] => {
  return [...plays].sort(comparePlaysByRecency);
};
