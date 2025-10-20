'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Fuse, { type FuseResultMatch } from 'fuse.js';
import type { Phase } from '@/lib/types/cms';

/**
 * Search Hook using Fuse.js for fuzzy searching
 * 
 * Searches across phase and module titles, descriptions, and summaries
 */

export interface SearchableItem {
  id: number;
  type: 'phase' | 'module';
  title: string;
  description: string;
  slug: string;
  phaseSlug?: string; // For modules, to construct URL
  phaseTitle?: string; // For modules, to show context
}

export interface SearchResult extends SearchableItem {
  score: number;
  matches?: readonly FuseResultMatch[];
}

interface UseSearchOptions {
  threshold?: number; // 0.0 = perfect match, 1.0 = match anything
  minCharacters?: number; // Minimum characters before searching
}

/**
 * Hook for searching phases and modules
 */
export function useSearch(
  phases: Phase[],
  options: UseSearchOptions = {}
) {
  const {
    threshold = 0.3,
    minCharacters = 2,
  } = options;

  const [searchQuery, setSearchQuery] = useState('');

  // Build searchable data from phases and modules
  const searchableData = useMemo(() => {
    const items: SearchableItem[] = [];

    phases.forEach((phase) => {
      // Add phase
      items.push({
        id: phase.id,
        type: 'phase',
        title: phase.attributes.title,
        description: phase.attributes.description,
        slug: phase.attributes.slug,
      });

      // Add modules from this phase
      if (phase.attributes.modules?.data) {
        phase.attributes.modules.data.forEach((module) => {
          items.push({
            id: module.id,
            type: 'module',
            title: module.attributes.title,
            description: module.attributes.summary,
            slug: module.attributes.slug,
            phaseSlug: phase.attributes.slug,
            phaseTitle: phase.attributes.title,
          });
        });
      }
    });

    return items;
  }, [phases]);

  // Configure Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(searchableData, {
      keys: [
        { name: 'title', weight: 2 },
        { name: 'description', weight: 1 },
        { name: 'phaseTitle', weight: 0.5 },
      ],
      threshold,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
      ignoreLocation: true, // Search entire string, not just beginning
    });
  }, [searchableData, threshold]);

  // Perform search
  const results = useMemo(() => {
    if (!searchQuery || searchQuery.length < minCharacters) {
      return [];
    }

    const fuseResults = fuse.search(searchQuery);
    
    return fuseResults.map((result) => ({
      ...result.item,
      score: result.score || 0,
      matches: result.matches,
    }));
  }, [fuse, searchQuery, minCharacters]);

  // Debounced search query setter
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
    searchQuery,
    results,
    handleSearch,
    clearSearch,
    hasResults: results.length > 0,
    isSearching: searchQuery.length >= minCharacters,
  };
}

/**
 * Hook for debounced search input
 * Fixed: Proper cleanup pattern using useEffect
 */
export function useDebouncedSearch(
  phases: Phase[],
  debounceMs: number = 300,
  options?: UseSearchOptions
) {
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [inputValue, setInputValue] = useState('');

  // Debounce the input value with proper cleanup
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [inputValue, debounceMs]);

  // Update input value handler
  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  // Use the base search hook with debounced query
  const searchHook = useSearch(phases, options);
  
  // Override the search query with debounced one
  searchHook.handleSearch(debouncedQuery);

  return {
    ...searchHook,
    inputValue,
    setInputValue: handleInputChange,
  };
}

