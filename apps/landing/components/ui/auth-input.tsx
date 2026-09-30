'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

export interface AuthInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
  hint?: string;
  endAdornment?: React.ReactNode;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, label, error, success, hint, endAdornment, id, ...props }, ref) => {
    const inputId = id || `auth-input-${label.replace(/\s+/g, '-').toLowerCase()}`;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[#131b2e]"
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'block w-full h-11 px-3.5 rounded-xl border bg-white text-[#131b2e] text-sm',
              'placeholder:text-[#6c7a71]/60',
              'transition-all duration-200 outline-none',
              'focus:ring-2 focus:ring-[#006c49]/20 focus:border-[#006c49]',
              'hover:border-[#bbcabf]',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#f2f3ff]',
              error
                ? 'border-[#ba1a1a] focus:ring-[#ba1a1a]/20 focus:border-[#ba1a1a]'
                : success
                  ? 'border-[#006c49] focus:ring-[#006c49]/20'
                  : 'border-[#bbcabf]',
              endAdornment ? 'pe-11' : '',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : hint ? hintId : undefined
            }
            {...props}
          />
          {endAdornment && (
            <div className="absolute inset-y-0 end-0 flex items-center pe-3">
              {endAdornment}
            </div>
          )}
        </div>
        {error && (
          <p
            id={errorId}
            className="flex items-center gap-1.5 text-xs text-[#ba1a1a] mt-1"
            role="alert"
            aria-live="polite"
          >
            <svg
              className="w-3.5 h-3.5 flex-shrink-0"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4.25a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0v-3zM8 11a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-xs text-[#6c7a71] mt-1">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
AuthInput.displayName = 'AuthInput';
