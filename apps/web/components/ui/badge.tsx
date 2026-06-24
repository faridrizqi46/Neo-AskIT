'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

const badgeVariants = [
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
];

const variantClasses: Record<string, string> = {
  default: 'bg-blue-100 text-blue-700 border border-blue-200',
  secondary: 'bg-slate-100 text-slate-600 border border-slate-200',
  destructive: 'bg-red-100 text-red-700 border border-red-200',
  outline: 'border border-slate-300 text-slate-600',
  success: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-100 text-amber-700 border border-amber-200',
  info: 'bg-blue-100 text-blue-600 border border-blue-200',
  muted: 'bg-slate-100 text-slate-500 border border-slate-200',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variantClasses;
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants, variantClasses[variant], className)} {...props} />
  );
}

export { Badge, badgeVariants, variantClasses };