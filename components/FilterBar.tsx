'use client';

import { useTranslations } from 'next-intl';
import { X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FILTER_OPTIONS, type FilterCategory } from '@/lib/hooks/useFilter';

/**
 * Filter Bar Component
 * 
 * Displays filter options as tags/buttons
 */

interface FilterBarProps {
  selectedCategories: FilterCategory[];
  onToggleCategory: (category: FilterCategory) => void;
  onClearFilters: () => void;
  getCategoryCount?: (category: FilterCategory) => number;
  locale: string;
  variant?: 'tags' | 'buttons' | 'dropdown';
  showCounts?: boolean;
  className?: string;
}

export function FilterBar({
  selectedCategories,
  onToggleCategory,
  onClearFilters,
  getCategoryCount,
  locale,
  variant = 'tags',
  showCounts = false,
  className = '',
}: FilterBarProps) {
  const t = useTranslations('Filter');
  const hasActiveFilters = !selectedCategories.includes('all');

  // Tags variant - pill-style buttons
  if (variant === 'tags') {
    return (
      <div className={cn('flex flex-wrap items-center gap-2', className)}>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Filter className="w-4 h-4" />
          <span className="font-medium">{t('filterBy')}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((option) => {
            const isSelected = selectedCategories.includes(option.id);
            const count = getCategoryCount ? getCategoryCount(option.id) : 0;
            const label = locale === 'ar' ? option.labelAr : option.label;

            return (
              <button
                key={option.id}
                onClick={() => onToggleCategory(option.id)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                  'border',
                  isSelected
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-primary'
                )}
              >
                {label}
                {showCounts && count > 0 && (
                  <span className="ms-1.5 opacity-75">({count})</span>
                )}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <X className="w-4 h-4 me-1" />
            {t('clearFilters')}
          </Button>
        )}
      </div>
    );
  }

  // Buttons variant - full-size buttons
  if (variant === 'buttons') {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Filter className="w-4 h-4" />
            {t('filterBy')}
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs"
            >
              <X className="w-3 h-3 me-1" />
              {t('clearFilters')}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {FILTER_OPTIONS.map((option) => {
            const isSelected = selectedCategories.includes(option.id);
            const count = getCategoryCount ? getCategoryCount(option.id) : 0;
            const label = locale === 'ar' ? option.labelAr : option.label;

            return (
              <button
                key={option.id}
                onClick={() => onToggleCategory(option.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  'border text-start',
                  isSelected
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary'
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{label}</span>
                  {showCounts && count > 0 && (
                    <span className="text-xs opacity-75">({count})</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Dropdown variant - select element
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      <select
        value={selectedCategories[0] || 'all'}
        onChange={(e) => onToggleCategory(e.target.value as FilterCategory)}
        className={cn(
          'px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600',
          'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          'transition-colors'
        )}
      >
        {FILTER_OPTIONS.map((option) => {
          const label = locale === 'ar' ? option.labelAr : option.label;
          const count = getCategoryCount ? getCategoryCount(option.id) : 0;

          return (
            <option key={option.id} value={option.id}>
              {label} {showCounts && count > 0 ? `(${count})` : ''}
            </option>
          );
        })}
      </select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-gray-600 dark:text-gray-400"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

/**
 * Active Filters Display
 * 
 * Shows currently active filters as removable badges
 */
export function ActiveFilters({
  selectedCategories,
  onToggleCategory,
  locale,
  className = '',
}: {
  selectedCategories: FilterCategory[];
  onToggleCategory: (category: FilterCategory) => void;
  locale: string;
  className?: string;
}) {
  const t = useTranslations('Filter');

  if (selectedCategories.includes('all')) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {t('activeFilters')}:
      </span>
      {selectedCategories.map((categoryId) => {
        const option = FILTER_OPTIONS.find((opt) => opt.id === categoryId);
        if (!option) return null;

        const label = locale === 'ar' ? option.labelAr : option.label;

        return (
          <button
            key={categoryId}
            onClick={() => onToggleCategory(categoryId)}
            className={cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
              'bg-primary text-white',
              'hover:bg-primary/90 transition-colors'
            )}
          >
            {label}
            <X className="w-3 h-3" />
          </button>
        );
      })}
    </div>
  );
}

