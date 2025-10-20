'use client';

import { useTranslations } from 'next-intl';
import { useResourceLibrary } from '@/lib/hooks/useResourceLibrary';
import {
  FileTypeFilter,
  ResourceSearch,
  GroupBySelector,
  ResourceGroup,
} from '@/components/ResourceLibrary';
import type { Phase } from '@/lib/types/cms';
import { trackDownload } from '@/lib/analytics';

/**
 * Resource Library Client Component
 * 
 * Client-side component for resource library with filtering and search
 */

interface ResourceLibraryClientProps {
  phases: Phase[];
  locale: string;
}

export function ResourceLibraryClient({ phases, locale }: ResourceLibraryClientProps) {
  const t = useTranslations('Resources');

  const {
    groupedResources,
    fileTypeFilter,
    searchQuery,
    groupBy,
    fileTypeCounts,
    handleFileTypeChange,
    handleSearchChange,
    handleGroupByChange,
    clearFilters,
    totalCount,
    filteredCount,
    hasFilters,
  } = useResourceLibrary(phases);

  const handleDownload = (_resourceId: number, resourceName: string, fileType: string, moduleSlug: string) => {
    // Track download in analytics
    trackDownload(resourceName, fileType, moduleSlug);
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
        {/* Search */}
        <ResourceSearch
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={t('searchPlaceholder')}
        />

        {/* File Type Filter */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('filterByType')}
          </h3>
          <FileTypeFilter
            selectedType={fileTypeFilter}
            onTypeChange={handleFileTypeChange}
            counts={fileTypeCounts}
            locale={locale}
          />
        </div>

        {/* Group By Selector */}
        <div className="flex items-center justify-between">
          <GroupBySelector
            value={groupBy}
            onChange={handleGroupByChange}
            locale={locale}
          />

          {/* Results Count */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {hasFilters ? (
              <>
                {t('showing')} <span className="font-semibold">{filteredCount}</span>{' '}
                {t('of')} <span className="font-semibold">{totalCount}</span>{' '}
                {t('resources')}
              </>
            ) : (
              <>
                <span className="font-semibold">{totalCount}</span> {t('resources')}
              </>
            )}
          </div>
        </div>

        {/* Clear Filters */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            {t('clearAllFilters')}
          </button>
        )}
      </div>

      {/* Results Section */}
      {groupedResources.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {hasFilters ? t('noResourcesMatch') : t('noResourcesAvailable')}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedResources.map((group) => (
            <ResourceGroup
              key={group.key}
              label={group.label}
              resources={group.resources}
              locale={locale}
              onDownload={handleDownload}
              showContext={groupBy !== 'module'}
            />
          ))}
        </div>
      )}
    </div>
  );
}

