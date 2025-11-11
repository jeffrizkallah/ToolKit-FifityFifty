import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearch } from '../useSearch';
import type { Phase } from '@/lib/types/cms';

// Mock phase data
const mockPhases: Phase[] = [
  {
    id: 1,
    attributes: {
      title: 'Strategic Planning',
      description: 'Learn how to create effective strategies',
      slug: 'strategic-planning',
      phase_number: 1,
      order: 1,
      modules: {
        data: [
          {
            id: 101,
            attributes: {
              title: 'Introduction to Strategy',
              summary: 'Basic concepts of strategic planning',
              slug: 'intro-strategy',
              order: 1,
              content: '',
              duration: 30,
              resources: { data: [] }
            }
          },
          {
            id: 102,
            attributes: {
              title: 'Team Building Workshop',
              summary: 'Build effective teams',
              slug: 'team-building',
              order: 2,
              content: '',
              duration: 45,
              resources: { data: [] }
            }
          }
        ]
      }
    }
  },
  {
    id: 2,
    attributes: {
      title: 'Messaging Framework',
      description: 'Develop your communication strategy',
      slug: 'messaging',
      phase_number: 2,
      order: 2,
      modules: {
        data: [
          {
            id: 201,
            attributes: {
              title: 'Brand Messaging',
              summary: 'Create compelling brand messages',
              slug: 'brand-messaging',
              order: 1,
              content: '',
              duration: 30,
              resources: { data: [] }
            }
          }
        ]
      }
    }
  }
] as Phase[];

describe('useSearch', () => {
  describe('Initial State', () => {
    it('should initialize with empty query and no results', () => {
      const { result } = renderHook(() => useSearch(mockPhases));
      
      expect(result.current.searchQuery).toBe('');
      expect(result.current.results).toEqual([]);
      expect(result.current.hasResults).toBe(false);
      expect(result.current.isSearching).toBe(false);
    });
  });

  describe('Search Functionality', () => {
    it('should find exact title matches', () => {
      const { result } = renderHook(() => useSearch(mockPhases));
      
      act(() => {
        result.current.handleSearch('Strategic Planning');
      });
      
      expect(result.current.results.length).toBeGreaterThan(0);
      expect(result.current.results[0].title).toBe('Strategic Planning');
      expect(result.current.results[0].type).toBe('phase');
    });

    it('should find partial matches', () => {
      const { result } = renderHook(() => useSearch(mockPhases));
      
      act(() => {
        result.current.handleSearch('strategy');
      });
      
      expect(result.current.results.length).toBeGreaterThan(0);
      const titles = result.current.results.map(r => r.title);
      expect(titles.some(t => t.toLowerCase().includes('strategy'))).toBe(true);
    });

    it('should search in descriptions', () => {
      const { result } = renderHook(() => useSearch(mockPhases));
      
      act(() => {
        result.current.handleSearch('communication');
      });
      
      expect(result.current.results.length).toBeGreaterThan(0);
    });

    it('should find module matches', () => {
      const { result } = renderHook(() => useSearch(mockPhases));
      
      act(() => {
        result.current.handleSearch('Team Building');
      });
      
      const moduleResults = result.current.results.filter(r => r.type === 'module');
      expect(moduleResults.length).toBeGreaterThan(0);
    });

    it('should be case-insensitive', () => {
      const { result } = renderHook(() => useSearch(mockPhases));
      
      act(() => {
        result.current.handleSearch('STRATEGY');
      });
      
      expect(result.current.results.length).toBeGreaterThan(0);
    });
  });

  describe('Minimum Characters Threshold', () => {
    it('should not search with less than minCharacters', () => {
      const { result } = renderHook(() => 
        useSearch(mockPhases, { minCharacters: 3 })
      );
      
      act(() => {
        result.current.handleSearch('ab');
      });
      
      expect(result.current.results).toEqual([]);
      expect(result.current.isSearching).toBe(false);
    });

    it('should search when reaching minCharacters', () => {
      const { result } = renderHook(() => 
        useSearch(mockPhases, { minCharacters: 2 })
      );
      
      act(() => {
        result.current.handleSearch('st');
      });
      
      expect(result.current.isSearching).toBe(true);
    });
  });

  describe('Fuzzy Matching', () => {
    it('should handle typos with fuzzy search', () => {
      const { result } = renderHook(() => 
        useSearch(mockPhases, { threshold: 0.3 })
      );
      
      act(() => {
        result.current.handleSearch('stratgic'); // typo
      });
      
      // Should still find "Strategic Planning"
      expect(result.current.results.length).toBeGreaterThan(0);
    });
  });

  describe('Weighted Fields', () => {
    it('should prioritize title matches over description matches', () => {
      const { result } = renderHook(() => useSearch(mockPhases));
      
      act(() => {
        result.current.handleSearch('messaging');
      });
      
      // "Messaging Framework" (title match) should rank higher than
      // descriptions mentioning messaging
      expect(result.current.results[0].title).toContain('Messaging');
    });
  });

  describe('Clear Search', () => {
    it('should clear search query and results', () => {
      const { result } = renderHook(() => useSearch(mockPhases));
      
      act(() => {
        result.current.handleSearch('strategy');
      });
      
      expect(result.current.results.length).toBeGreaterThan(0);
      
      act(() => {
        result.current.clearSearch();
      });
      
      expect(result.current.searchQuery).toBe('');
      expect(result.current.results).toEqual([]);
    });
  });

  describe('Empty Query', () => {
    it('should return no results for empty query', () => {
      const { result } = renderHook(() => useSearch(mockPhases));
      
      act(() => {
        result.current.handleSearch('');
      });
      
      expect(result.current.results).toEqual([]);
    });
  });

  describe('No Matches', () => {
    it('should return empty results when nothing matches', () => {
      const { result } = renderHook(() => useSearch(mockPhases));
      
      act(() => {
        result.current.handleSearch('xyznonexistent');
      });
      
      expect(result.current.results).toEqual([]);
      expect(result.current.hasResults).toBe(false);
    });
  });

  describe('Special Characters', () => {
    it('should handle special characters in search query', () => {
      const { result } = renderHook(() => useSearch(mockPhases));
      
      act(() => {
        result.current.handleSearch('plan(ning');
      });
      
      // Should not crash, may or may not return results
      expect(result.current.results).toBeDefined();
    });
  });

  describe('Search Context', () => {
    it('should include phase context for module results', () => {
      const { result } = renderHook(() => useSearch(mockPhases));
      
      act(() => {
        result.current.handleSearch('Introduction');
      });
      
      const moduleResult = result.current.results.find(r => r.type === 'module');
      expect(moduleResult).toBeDefined();
      expect(moduleResult?.phaseTitle).toBe('Strategic Planning');
      expect(moduleResult?.phaseSlug).toBe('strategic-planning');
    });
  });
});

