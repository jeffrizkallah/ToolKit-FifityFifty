'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FileText, Folder, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SearchResult } from '@/lib/hooks/useSearch';

/**
 * Search Results Component
 * 
 * Displays search results with highlighting and links
 */

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  locale: string;
  onResultClick?: () => void;
  className?: string;
}

export function SearchResults({
  results,
  query,
  locale,
  onResultClick,
  className = '',
}: SearchResultsProps) {
  const t = useTranslations('Search');

  if (results.length === 0) {
    return (
      <div className={cn('p-8 text-center', className)}>
        <p className="text-gray-600 dark:text-gray-400">
          {t('noResults', { query })}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          {t('noResultsHint')}
        </p>
      </div>
    );
  }

  return (
    <div className={cn('divide-y divide-gray-200 dark:divide-gray-700', className)}>
      {results.map((result) => {
        const href = result.type === 'phase'
          ? `/${locale}/phase/${result.slug}`
          : `/${locale}/phase/${result.phaseSlug}#${result.slug}`;

        return (
          <Link
            key={`${result.type}-${result.id}`}
            href={href}
            onClick={onResultClick}
            className={cn(
              'block p-4 hover:bg-gray-50 dark:hover:bg-gray-800',
              'transition-colors group'
            )}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="mt-1">
                {result.type === 'phase' ? (
                  <Folder className="w-5 h-5 text-primary" />
                ) : (
                  <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Title */}
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary">
                  <HighlightedText text={result.title} query={query} />
                </h3>

                {/* Context for modules */}
                {result.type === 'module' && result.phaseTitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {result.phaseTitle}
                  </p>
                )}

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                  <HighlightedText text={result.description} query={query} />
                </p>

                {/* Type Badge */}
                <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {result.type === 'phase' ? t('typePhase') : t('typeModule')}
                </span>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/**
 * Highlighted Text Component
 * 
 * Highlights matching portions of text
 */
function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;

  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'));

  return (
    <>
      {parts.map((part, i) => (
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-600 text-gray-900 dark:text-gray-100 rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      ))}
    </>
  );
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Search Results Count
 */
export function SearchResultsCount({ count, query }: { count: number; query: string }) {
  const t = useTranslations('Search');

  return (
    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <p className="text-sm text-gray-700 dark:text-gray-300">
        {t('resultsCount', { count, query })}
      </p>
    </div>
  );
}

