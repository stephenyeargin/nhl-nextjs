import React from 'react';

const cx = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(' ');

export const SKELETON_BLOCK_CLASS = 'bg-slate-300 dark:bg-slate-700';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const SkeletonPulse: React.FC<SkeletonProps> = ({ className, children, ...rest }) => (
  <div className={cx('animate-pulse', className)} {...rest}>
    {children}
  </div>
);

export const SkeletonBlock: React.FC<SkeletonProps> = ({ className, children, ...rest }) => (
  <div className={cx(SKELETON_BLOCK_CLASS, className)} {...rest}>
    {children}
  </div>
);

export const SkeletonCard: React.FC<SkeletonProps> = ({ className, children, ...rest }) => (
  <div
    className={cx('border border-slate-300 dark:border-slate-700 rounded-lg shadow-xs', className)}
    {...rest}
  >
    {children}
  </div>
);
