'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Phase, Module } from '@/lib/types/cms';

/**
 * Filter Hook for categorizing and filtering content
 * 
 * Supports filtering by predefined categories and custom tags
 */

export type FilterCategory = 
  | 'all'
  | 'strategy'
  | 'messaging'
  | 'team_building'
  | 'planning'
  | 'communication'
  | 'leadership';

export interface FilterOption {
  id: FilterCategory;
  label: string;
  labelAr: string;
}

// Predefined filter categories
export const FILTER_OPTIONS: FilterOption[] = [
  { id: 'all', label: 'All Topics', labelAr: 'جميع المواضيع' },
  { id: 'strategy', label: 'Strategy', labelAr: 'الإستراتيجية' },
  { id: 'messaging', label: 'Messaging', labelAr: 'الرسائل' },
  { id: 'team_building', label: 'Team Building', labelAr: 'بناء الفريق' },
  { id: 'planning', label: 'Planning', labelAr: 'التخطيط' },
  { id: 'communication', label: 'Communication', labelAr: 'التواصل' },
  { id: 'leadership', label: 'Leadership', labelAr: 'القيادة' },
];

/**
 * Categorize content based on keywords in titles and descriptions
 * This can be replaced with CMS tags when available
 */
function categorizePhase(phase: Phase): FilterCategory[] {
  const categories: FilterCategory[] = [];
  const text = `${phase.attributes.title} ${phase.attributes.description}`.toLowerCase();

  if (text.match(/strateg|plan|approach|vision|goal/i)) {
    categories.push('strategy', 'planning');
  }
  if (text.match(/messag|communicat|brand|market|story/i)) {
    categories.push('messaging', 'communication');
  }
  if (text.match(/team|collaborat|group|member|staff/i)) {
    categories.push('team_building');
  }
  if (text.match(/lead|manag|director|coordinat/i)) {
    categories.push('leadership');
  }

  return categories.length > 0 ? categories : ['strategy']; // Default fallback
}

function categorizeModule(module: Module): FilterCategory[] {
  const categories: FilterCategory[] = [];
  const text = `${module.attributes.title} ${module.attributes.summary}`.toLowerCase();

  if (text.match(/strateg|plan|approach|vision|goal/i)) {
    categories.push('strategy', 'planning');
  }
  if (text.match(/messag|communicat|brand|market|story/i)) {
    categories.push('messaging', 'communication');
  }
  if (text.match(/team|collaborat|group|member|staff/i)) {
    categories.push('team_building');
  }
  if (text.match(/lead|manag|director|coordinat/i)) {
    categories.push('leadership');
  }

  return categories.length > 0 ? categories : ['strategy']; // Default fallback
}

interface UseFilterOptions {
  multiSelect?: boolean;
}

/**
 * Hook for filtering phases and modules by category
 */
export function useFilter(
  phases: Phase[],
  options: UseFilterOptions = {}
) {
  const { multiSelect = false } = options;

  const [selectedCategories, setSelectedCategories] = useState<FilterCategory[]>(['all']);

  // Filter phases based on selected categories
  const filteredPhases = useMemo(() => {
    if (selectedCategories.includes('all')) {
      return phases;
    }

    return phases.filter((phase) => {
      const phaseCategories = categorizePhase(phase);
      return selectedCategories.some((cat) => phaseCategories.includes(cat));
    }).map((phase) => {
      // Also filter modules within the phase
      if (phase.attributes.modules?.data) {
        const filteredModules = phase.attributes.modules.data.filter((module) => {
          const moduleCategories = categorizeModule(module);
          return selectedCategories.some((cat) => moduleCategories.includes(cat));
        });

        return {
          ...phase,
          attributes: {
            ...phase.attributes,
            modules: {
              ...phase.attributes.modules,
              data: filteredModules,
            },
          },
        };
      }
      return phase;
    });
  }, [phases, selectedCategories]);

  // Toggle a category
  const toggleCategory = useCallback((category: FilterCategory) => {
    if (category === 'all') {
      setSelectedCategories(['all']);
      return;
    }

    setSelectedCategories((prev) => {
      // If 'all' is selected, replace with the new category
      if (prev.includes('all')) {
        return [category];
      }

      if (multiSelect) {
        // Multi-select mode
        if (prev.includes(category)) {
          const newCategories = prev.filter((c) => c !== category);
          return newCategories.length === 0 ? ['all'] : newCategories;
        } else {
          return [...prev, category];
        }
      } else {
        // Single-select mode
        return [category];
      }
    });
  }, [multiSelect]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSelectedCategories(['all']);
  }, []);

  // Check if a category is selected
  const isCategorySelected = useCallback(
    (category: FilterCategory) => selectedCategories.includes(category),
    [selectedCategories]
  );

  // Get count of items per category
  const getCategoryCount = useCallback(
    (category: FilterCategory) => {
      if (category === 'all') {
        return phases.length;
      }

      let count = 0;
      phases.forEach((phase) => {
        const phaseCategories = categorizePhase(phase);
        if (phaseCategories.includes(category)) {
          count++;
        }
        if (phase.attributes.modules?.data) {
          phase.attributes.modules.data.forEach((module) => {
            const moduleCategories = categorizeModule(module);
            if (moduleCategories.includes(category)) {
              count++;
            }
          });
        }
      });
      return count;
    },
    [phases]
  );

  return {
    filteredPhases,
    selectedCategories,
    toggleCategory,
    clearFilters,
    isCategorySelected,
    getCategoryCount,
    hasActiveFilters: !selectedCategories.includes('all'),
  };
}

