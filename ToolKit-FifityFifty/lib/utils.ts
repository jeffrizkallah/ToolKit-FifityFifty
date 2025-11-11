/**
 * Utility Functions
 * 
 * Common utility functions used across the application.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine and merge Tailwind CSS classes
 * Uses clsx for conditional classes and tailwind-merge to handle conflicts
 * 
 * @example
 * cn('px-2 py-1', condition && 'bg-blue-500', 'px-4') // => 'py-1 bg-blue-500 px-4'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string, locale: string = 'en'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Truncate text to a specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Sleep/delay function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if code is running on client side
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if code is running on server side
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

