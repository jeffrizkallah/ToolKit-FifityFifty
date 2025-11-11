'use client';

import { useState, useCallback } from 'react';
import { useSearch } from '@/lib/hooks/useSearch';
import { SearchInput } from '@/components/SearchInput';
import { SearchResults, SearchResultsCount } from '@/components/SearchResults';
import { useTranslations } from 'next-intl';
import type { Phase } from '@/lib/types/cms';
import { cn } from '@/lib/utils';

/**
 * Main Search Component
 * 
 * Combines search input and results with Fuse.js fuzzy search
 */

interface SearchProps {
  phases: Phase[];
  locale: string;
  variant?: 'dropdown' | 'inline';
  className?: string;
}

export function Search({ 
  phases, 
  locale,
  variant = 'dropdown',
  className = ''
}: SearchProps) {
  const t = useTranslations('Search');
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    searchQuery,
    results,
    handleSearch,
    clearSearch,
    isSearching,
  } = useSearch(phases, {
    threshold: 0.3,
    minCharacters: 2,
  });

  const handleInputChange = useCallback((value: string) => {
    handleSearch(value);
    if (variant === 'dropdown') {
      setIsOpen(value.length >= 2);
    }
  }, [handleSearch, variant]);

  const handleClear = useCallback(() => {
    clearSearch();
    setIsOpen(false);
  }, [clearSearch]);

  const handleResultClick = useCallback(() => {
    clearSearch();
    setIsOpen(false);
  }, [clearSearch]);

  // Dropdown variant (for header/navigation)
  if (variant === 'dropdown') {
    return (
      <div className={cn('relative', className)}>
        <SearchInput
          value={searchQuery}
          onChange={handleInputChange}
          onClear={handleClear}
          placeholder={t('placeholder')}
        />

        {/* Dropdown Results */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Results Panel */}
            <div className={cn(
              'absolute top-full mt-2 w-full min-w-[400px] max-w-2xl',
              'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700',
              'rounded-lg shadow-xl z-50 max-h-[500px] overflow-auto'
            )}>
              {isSearching && (
                <>
                  {results.length > 0 && (
                    <SearchResultsCount count={results.length} query={searchQuery} />
                  )}
                  <SearchResults
                    results={results}
                    query={searchQuery}
                    locale={locale}
                    onResultClick={handleResultClick}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // Inline variant (for dedicated search pages)
  return (
    <div className={cn('space-y-4', className)}>
      <SearchInput
        value={searchQuery}
        onChange={handleInputChange}
        onClear={handleClear}
        placeholder={t('placeholder')}
        autoFocus
      />

      {isSearching && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {results.length > 0 && (
            <SearchResultsCount count={results.length} query={searchQuery} />
          )}
          <SearchResults
            results={results}
            query={searchQuery}
            locale={locale}
          />
        </div>
      )}
    </div>
  );
}

