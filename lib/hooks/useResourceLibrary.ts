'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Phase, Module, Resource } from '@/lib/types/cms';

/**
 * Resource Library Hook
 * 
 * Manages resource aggregation, filtering, and search
 */

export interface ResourceWithContext extends Resource {
  moduleTitle: string;
  moduleSlug: string;
  phaseTitle: string;
  phaseSlug: string;
  phaseNumber: number;
}

export type ResourceFileType = 'all' | 'PDF' | 'Excel' | 'Word' | 'Other';

interface UseResourceLibraryOptions {
  initialFileType?: ResourceFileType;
  initialSearchQuery?: string;
}

/**
 * Hook for managing resource library
 */
export function useResourceLibrary(
  phases: Phase[],
  options: UseResourceLibraryOptions = {}
) {
  const {
    initialFileType = 'all',
    initialSearchQuery = '',
  } = options;

  const [fileTypeFilter, setFileTypeFilter] = useState<ResourceFileType>(initialFileType);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [groupBy, setGroupBy] = useState<'phase' | 'module' | 'type'>('phase');

  // Aggregate all resources from all phases and modules
  const allResources = useMemo<ResourceWithContext[]>(() => {
    const resources: ResourceWithContext[] = [];

    phases.forEach((phase) => {
      if (phase.attributes.modules?.data) {
        phase.attributes.modules.data.forEach((module) => {
          if (module.attributes.resources?.data) {
            module.attributes.resources.data.forEach((resource) => {
              resources.push({
                ...resource,
                moduleTitle: module.attributes.title,
                moduleSlug: module.attributes.slug,
                phaseTitle: phase.attributes.title,
                phaseSlug: phase.attributes.slug,
                phaseNumber: phase.attributes.phase_number,
              });
            });
          }
        });
      }
    });

    // Sort by phase number, then module order, then resource order
    return resources.sort((a, b) => {
      if (a.phaseNumber !== b.phaseNumber) {
        return a.phaseNumber - b.phaseNumber;
      }
      return (a.attributes.order || 0) - (b.attributes.order || 0);
    });
  }, [phases]);

  // Filter resources by file type
  const filteredByType = useMemo(() => {
    if (fileTypeFilter === 'all') {
      return allResources;
    }
    return allResources.filter(
      (resource) => resource.attributes.file_type === fileTypeFilter
    );
  }, [allResources, fileTypeFilter]);

  // Filter resources by search query
  const filteredResources = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) {
      return filteredByType;
    }

    const query = searchQuery.toLowerCase();
    return filteredByType.filter((resource) => {
      const title = resource.attributes.title.toLowerCase();
      const description = resource.attributes.description?.toLowerCase() || '';
      const moduleTitle = resource.moduleTitle.toLowerCase();
      const phaseTitle = resource.phaseTitle.toLowerCase();

      return (
        title.includes(query) ||
        description.includes(query) ||
        moduleTitle.includes(query) ||
        phaseTitle.includes(query)
      );
    });
  }, [filteredByType, searchQuery]);

  // Group resources
  const groupedResources = useMemo(() => {
    const groups = new Map<string, ResourceWithContext[]>();

    filteredResources.forEach((resource) => {
      let key: string;
      let label: string;

      if (groupBy === 'phase') {
        key = resource.phaseSlug;
        label = resource.phaseTitle;
      } else if (groupBy === 'module') {
        key = `${resource.phaseSlug}-${resource.moduleSlug}`;
        label = `${resource.phaseTitle} › ${resource.moduleTitle}`;
      } else {
        key = resource.attributes.file_type;
        label = resource.attributes.file_type;
      }

      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(resource);
    });

    return Array.from(groups.entries()).map(([key, resources]) => ({
      key,
      label: resources[0]
        ? groupBy === 'phase'
          ? resources[0].phaseTitle
          : groupBy === 'module'
          ? `${resources[0].phaseTitle} › ${resources[0].moduleTitle}`
          : resources[0].attributes.file_type
        : key,
      resources,
    }));
  }, [filteredResources, groupBy]);

  // Get file type counts
  const fileTypeCounts = useMemo(() => {
    const counts: Record<ResourceFileType, number> = {
      all: allResources.length,
      PDF: 0,
      Excel: 0,
      Word: 0,
      Other: 0,
    };

    allResources.forEach((resource) => {
      const type = resource.attributes.file_type;
      if (type in counts) {
        counts[type]++;
      }
    });

    return counts;
  }, [allResources]);

  // Handlers
  const handleFileTypeChange = useCallback((fileType: ResourceFileType) => {
    setFileTypeFilter(fileType);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleGroupByChange = useCallback((grouping: 'phase' | 'module' | 'type') => {
    setGroupBy(grouping);
  }, []);

  const clearFilters = useCallback(() => {
    setFileTypeFilter('all');
    setSearchQuery('');
  }, []);

  return {
    allResources,
    filteredResources,
    groupedResources,
    fileTypeFilter,
    searchQuery,
    groupBy,
    fileTypeCounts,
    handleFileTypeChange,
    handleSearchChange,
    handleGroupByChange,
    clearFilters,
    totalCount: allResources.length,
    filteredCount: filteredResources.length,
    hasFilters: fileTypeFilter !== 'all' || searchQuery.length > 0,
  };
}

