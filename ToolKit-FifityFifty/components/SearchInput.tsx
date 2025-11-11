'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

/**
 * Search Input Component
 * 
 * Debounced search input with clear button
 */

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  debounceMs?: number;
  autoFocus?: boolean;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder,
  debounceMs = 300,
  autoFocus = false,
  className = '',
}: SearchInputProps) {
  const t = useTranslations('Search');
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Handle input change with debouncing
  const handleChange = (newValue: string) => {
    setLocalValue(newValue);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  };

  // Handle clear
  const handleClear = () => {
    setLocalValue('');
    onChange('');
    if (onClear) {
      onClear();
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder || t('placeholder')}
          className={cn(
            'w-full ps-10 pe-10 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600',
            'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
            'placeholder:text-gray-500 dark:placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'transition-colors'
          )}
          aria-label={t('searchLabel')}
        />
        {localValue && (
          <button
            onClick={handleClear}
            className={cn(
              'absolute end-3 top-1/2 -translate-y-1/2',
              'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
              'transition-colors'
            )}
            aria-label={t('clearSearch')}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

