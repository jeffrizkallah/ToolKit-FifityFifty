import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ProgressProvider, useProgress } from '../ProgressContext';

describe('ProgressContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ProgressProvider>{children}</ProgressProvider>
  );

  describe('Initial State', () => {
    it('should initialize with empty completed modules', () => {
      const { result } = renderHook(() => useProgress(), { wrapper });
      
      expect(result.current.completedModules).toEqual([]);
      expect(result.current.getCompletedCount()).toBe(0);
    });

    it('should load existing progress from localStorage', () => {
      localStorage.setItem('fiftyfifty_progress', JSON.stringify([1, 2, 3]));
      
      const { result } = renderHook(() => useProgress(), { wrapper });
      
      // Wait for hydration
      expect(result.current.completedModules).toEqual([1, 2, 3]);
    });
  });

  describe('markModuleComplete', () => {
    it('should add module to completed list', () => {
      const { result } = renderHook(() => useProgress(), { wrapper });
      
      act(() => {
        result.current.markModuleComplete(1);
      });
      
      expect(result.current.completedModules).toContain(1);
      expect(result.current.isModuleComplete(1)).toBe(true);
    });

    it('should not add duplicate modules', () => {
      const { result } = renderHook(() => useProgress(), { wrapper });
      
      act(() => {
        result.current.markModuleComplete(1);
        result.current.markModuleComplete(1);
      });
      
      expect(result.current.completedModules).toEqual([1]);
    });

    it('should persist to localStorage', () => {
      const { result } = renderHook(() => useProgress(), { wrapper });
      
      act(() => {
        result.current.markModuleComplete(5);
      });
      
      const stored = localStorage.getItem('fiftyfifty_progress');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toContain(5);
    });
  });

  describe('markModuleIncomplete', () => {
    it('should remove module from completed list', () => {
      const { result } = renderHook(() => useProgress(), { wrapper });
      
      act(() => {
        result.current.markModuleComplete(1);
        result.current.markModuleIncomplete(1);
      });
      
      expect(result.current.completedModules).not.toContain(1);
      expect(result.current.isModuleComplete(1)).toBe(false);
    });
  });

  describe('getCompletionPercentage', () => {
    it('should calculate correct percentage', () => {
      const { result } = renderHook(() => useProgress(), { wrapper });
      
      act(() => {
        result.current.markModuleComplete(1);
        result.current.markModuleComplete(2);
      });
      
      expect(result.current.getCompletionPercentage(10)).toBe(20);
    });

    it('should return 0 for zero total modules', () => {
      const { result } = renderHook(() => useProgress(), { wrapper });
      
      expect(result.current.getCompletionPercentage(0)).toBe(0);
    });

    it('should round percentages correctly', () => {
      const { result } = renderHook(() => useProgress(), { wrapper });
      
      act(() => {
        result.current.markModuleComplete(1);
      });
      
      // 1/3 = 33.333... should round to 33
      expect(result.current.getCompletionPercentage(3)).toBe(33);
    });
  });

  describe('resetProgress', () => {
    it('should clear all completed modules', () => {
      const { result } = renderHook(() => useProgress(), { wrapper });
      
      act(() => {
        result.current.markModuleComplete(1);
        result.current.markModuleComplete(2);
        result.current.resetProgress();
      });
      
      expect(result.current.completedModules).toEqual([]);
      expect(result.current.getCompletedCount()).toBe(0);
    });

    it('should remove data from localStorage', () => {
      const { result } = renderHook(() => useProgress(), { wrapper });
      
      act(() => {
        result.current.markModuleComplete(1);
        result.current.resetProgress();
      });
      
      expect(localStorage.getItem('fiftyfifty_progress')).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('fiftyfifty_progress', 'invalid-json');
      
      const { result } = renderHook(() => useProgress(), { wrapper });
      
      // Should initialize with empty array instead of crashing
      expect(result.current.completedModules).toEqual([]);
    });

    it('should handle non-array data in localStorage', () => {
      localStorage.setItem('fiftyfifty_progress', JSON.stringify({ data: 'wrong' }));
      
      const { result } = renderHook(() => useProgress(), { wrapper });
      
      // Should initialize with empty array
      expect(result.current.completedModules).toEqual([]);
    });
  });

  describe('useProgress hook error', () => {
    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useProgress());
      }).toThrow('useProgress must be used within a ProgressProvider');
    });
  });
});

