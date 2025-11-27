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

/**
 * Convert Google Drive share link to direct download link
 * 
 * @param url - The Google Drive share URL
 * @returns Direct download URL or original URL if not a Google Drive link
 */
function convertGoogleDriveUrl(url: string): string {
  // Pattern 1: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch) {
    return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
  }
  
  // Pattern 2: https://drive.google.com/open?id=FILE_ID
  const openIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openIdMatch) {
    return `https://drive.google.com/uc?export=download&id=${openIdMatch[1]}`;
  }
  
  // Pattern 3: Google Docs - https://docs.google.com/document/d/FILE_ID/...
  const docsMatch = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (docsMatch) {
    return `https://docs.google.com/document/d/${docsMatch[1]}/export?format=pdf`;
  }
  
  // Pattern 4: Google Sheets - https://docs.google.com/spreadsheets/d/FILE_ID/...
  const sheetsMatch = url.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (sheetsMatch) {
    return `https://docs.google.com/spreadsheets/d/${sheetsMatch[1]}/export?format=xlsx`;
  }
  
  // Pattern 5: Google Slides - https://docs.google.com/presentation/d/FILE_ID/...
  const slidesMatch = url.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  if (slidesMatch) {
    return `https://docs.google.com/presentation/d/${slidesMatch[1]}/export/pptx`;
  }
  
  // Not a Google Drive link, return as-is
  return url;
}

/**
 * Download a file from a URL
 * Works for both same-origin and cross-origin URLs
 * Handles Google Drive links by converting to direct download format
 * 
 * @param url - The URL of the file to download
 * @param filename - Optional filename for the downloaded file
 */
export async function downloadFile(url: string, filename?: string): Promise<void> {
  try {
    // Convert Google Drive URLs to direct download links
    const downloadUrl = convertGoogleDriveUrl(url);
    
    // For Google Drive files, use direct link approach (cross-origin fetch won't work)
    if (downloadUrl.includes('drive.google.com') || downloadUrl.includes('docs.google.com')) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    
    // Fetch the file as a blob (for non-Google Drive files)
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    // Create a temporary object URL
    const objectUrl = URL.createObjectURL(blob);
    
    // Extract filename from URL if not provided
    const downloadFilename = filename || extractFilenameFromUrl(url);
    
    // Create a temporary anchor element and trigger download
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = downloadFilename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback: open in new tab
    window.open(url, '_blank');
  }
}

/**
 * Extract filename from a URL
 */
function extractFilenameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').pop() || 'download';
    return decodeURIComponent(filename);
  } catch {
    return 'download';
  }
}

