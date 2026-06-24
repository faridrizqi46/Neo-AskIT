'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

const buttonVariants = [
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none',
];

const variantClasses: Record<string, string> = {
  default: 'bg-blue-500 text-white hover:bg-blue-600 active:scale-[0.98] shadow-sm',
  destructive: 'bg-red-500 text-white hover:bg-red-600 active:scale-[0.98] shadow-sm',
  outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:scale-[0.98]',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-[0.98]',
  ghost: 'hover:bg-slate-100 text-slate-700',
  link: 'text-blue-500 underline-offset-4 hover:underline',
  success: 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.98] shadow-sm',
  warning: 'bg-amber-500 text-white hover:bg-amber-600 active:scale-[0.98] shadow-sm',
};

const sizeClasses: Record<string, string> = {
  default: 'h-10 px-4 py-2',
  sm: 'h-8 rounded-md px-3 text-xs',
  lg: 'h-12 rounded-lg px-8 text-base',
  xl: 'h-14 rounded-xl px-10 text-lg',
  icon: 'h-10 w-10',
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  loading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading, asChild = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants, variantClasses[variant], sizeClasses[size], className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants, variantClasses, sizeClasses };