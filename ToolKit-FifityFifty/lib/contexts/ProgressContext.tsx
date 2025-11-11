'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * Progress Context for tracking module completion
 * 
 * This context provides state management for user progress tracking,
 * storing completed module IDs in browser localStorage.
 */

interface ProgressContextType {
  completedModules: number[];
  markModuleComplete: (moduleId: number) => void;
  markModuleIncomplete: (moduleId: number) => void;
  isModuleComplete: (moduleId: number) => boolean;
  getCompletionPercentage: (totalModules: number) => number;
  getCompletedCount: () => number;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const STORAGE_KEY = 'fiftyfifty_progress';

/**
 * Progress Provider Component
 * 
 * Manages user progress state and localStorage persistence
 */
export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCompletedModules(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load progress from localStorage:', error);
    }
    setIsHydrated(true);
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (!isHydrated) return; // Don't save during initial hydration
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedModules));
    } catch (error) {
      console.error('Failed to save progress to localStorage:', error);
    }
  }, [completedModules, isHydrated]);

  /**
   * Mark a module as complete
   */
  const markModuleComplete = useCallback((moduleId: number) => {
    setCompletedModules((prev) => {
      if (prev.includes(moduleId)) return prev;
      return [...prev, moduleId];
    });
  }, []);

  /**
   * Mark a module as incomplete
   */
  const markModuleIncomplete = useCallback((moduleId: number) => {
    setCompletedModules((prev) => prev.filter((id) => id !== moduleId));
  }, []);

  /**
   * Check if a module is complete
   */
  const isModuleComplete = useCallback(
    (moduleId: number) => completedModules.includes(moduleId),
    [completedModules]
  );

  /**
   * Get completion percentage
   */
  const getCompletionPercentage = useCallback(
    (totalModules: number) => {
      if (totalModules === 0) return 0;
      return Math.round((completedModules.length / totalModules) * 100);
    },
    [completedModules]
  );

  /**
   * Get count of completed modules
   */
  const getCompletedCount = useCallback(() => completedModules.length, [completedModules]);

  /**
   * Reset all progress
   */
  const resetProgress = useCallback(() => {
    setCompletedModules([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to reset progress:', error);
    }
  }, []);

  const value: ProgressContextType = {
    completedModules,
    markModuleComplete,
    markModuleIncomplete,
    isModuleComplete,
    getCompletionPercentage,
    getCompletedCount,
    resetProgress,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

/**
 * Hook to use progress context
 */
export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}

