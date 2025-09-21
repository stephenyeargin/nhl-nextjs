import React from 'react';
import { formatStat } from '@/app/utils/formatters';

type StatHeader = {
  key: string;
  label: string;
  title: string;
  altKey?: string;
  precision?: number;
  unit?: string;
};

interface StatBoxProps {
  statKey: string;
  value: number | string | undefined;
  statHeaders: readonly StatHeader[];
}

const StatBox: React.FC<StatBoxProps> = ({ statKey, value, statHeaders }) => {
  const header = statHeaders.find((s) => s.key === statKey || s.altKey === statKey);
  const title = header?.title ?? statKey;
  const precision = header?.precision ?? 0;

  const content = (() => {
    if (statKey === 'plusMinus') {
      if (value === undefined || value === null || value === '') {
        return '--';
      }
      const n = typeof value === 'number' ? value : Number(value);
      if (Number.isNaN(n)) {
        return '--';
      }

      return n > 0 ? `+${n}` : `${n}`;
    }

    return formatStat(value, precision);
  })();

  return (
    <div
      className="p-2 bg-transparent text-center border rounded content-center"
      style={{ minWidth: '7rem' }}
    >
      <div className="text-2xl capitalize">{content}</div>
      <div className="text-xs font-light">{title}</div>
    </div>
  );
};

export default StatBox;
